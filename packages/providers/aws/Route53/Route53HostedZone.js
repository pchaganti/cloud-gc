const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  filter,
  assign,
  flatMap,
  or,
  not,
  eq,
  and,
  pick,
  any,
} = require("rubico");
const {
  callProp,
  groupBy,
  first,
  find,
  pluck,
  defaultsDeep,
  isEmpty,
  includes,
  differenceWith,
  isDeepEqual,
  when,
} = require("rubico/x");

const { AwsClient } = require("../AwsClient");
const util = require("util");

const logger = require("@grucloud/core/logger")({ prefix: "HostedZone" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  getByNameCore,
  logError,
  axiosErrorToJSON,
} = require("@grucloud/core/Common");
const {
  buildTags,
  findNamespaceInTags,
  getNewCallerReference,
} = require("../AwsCommon");

const { filterEmptyResourceRecords } = require("./Route53Utils");
const {
  createRoute53,
  tagResource,
  untagResource,
  hostedZoneIdToResourceId,
} = require("./Route53Common");
const {
  createRoute53Domains,
} = require("../Route53Domain/Route53DomainCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

// https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/DomainNameFormat.html
// TODO make it generic
// parseInt("052",8) => 42
// String.fromCharCode(42) => *

const octalReplace = pipe([callProp("replaceAll", "\\052", "*")]);

//Check for the final dot
const findName = get("live.Name");
const findId = pipe([get("live.Id"), hostedZoneIdToResourceId]);
const pickId = pick(["Id"]);

const canDeleteRecord = (zoneName) =>
  not(
    and([
      (record) => ["NS", "SOA"].includes(record.Type),
      eq(get("Name"), zoneName),
    ])
  );

const findNsRecordByName = (name) =>
  find(and([eq(get("Name"), name), eq(get("Type"), "NS")]));

const findDnsServers = (live) =>
  pipe([
    () => live.RecordSet,
    findNsRecordByName(live.Name),
    get("ResourceRecords"),
    pluck("Value"),
    tap((params) => {
      assert(true);
    }),
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.Route53HostedZone = ({ spec, config }) => {
  const route53 = createRoute53(config);
  const route53Domains = createRoute53Domains(config);
  const client = AwsClient({ spec, config })(route53);
  const { providerName } = config;

  const findDependencies = ({ live, lives }) => [
    {
      type: "Domain",
      group: "Route53Domains",
      ids: pipe([
        () =>
          lives.getByType({
            type: "Domain",
            group: "Route53Domains",
            providerName,
          }),
        filter(
          pipe([
            get("live.DomainName"),
            (DomainName) =>
              pipe([() => live.Name.slice(0, -1), includes(DomainName)])(),
          ])
        ),
        pluck("id"),
      ])(),
    },
    {
      type: "HostedZone",
      group: "Route53",
      ids: pipe([
        () =>
          lives.getByType({
            type: "HostedZone",
            group: "Route53",
            providerName,
          }),
        filter(not(eq(get("name"), live.Name))),
        filter(
          pipe([
            get("live.RecordSet"),
            findNsRecordByName(live.Name),
            get("ResourceRecords"),
            first,
            get("Value"),
            (dnsServer) => includes(dnsServer)(findDnsServers(live)),
          ])
        ),
        pluck("id"),
      ])(),
    },
    {
      type: "Vpc",
      group: "EC2",
      ids: [pipe([() => live, get("VpcAssociations"), first, get("VPCId")])()],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listHostedZones-property
  const getList = client.getList({
    method: "listHostedZones",
    getParam: "HostedZones",
    decorate: () =>
      pipe([
        assign({
          RecordSet: pipe([
            (hostedZone) => ({
              HostedZoneId: hostedZone.Id,
            }),
            route53().listResourceRecordSets,
            get("ResourceRecordSets"),
            map(
              pipe([
                assign({
                  Name: pipe([get("Name"), octalReplace]),
                }),
                when(
                  get("AliasTarget"),
                  assign({
                    AliasTarget: pipe([
                      get("AliasTarget"),
                      assign({
                        DNSName: pipe([get("DNSName"), octalReplace]),
                      }),
                    ]),
                  })
                ),
              ])
            ),
          ]),
          Tags: pipe([
            (hostedZone) => ({
              ResourceId: hostedZoneIdToResourceId(hostedZone.Id),
              ResourceType: "hostedzone",
            }),
            route53().listTagsForResource,
            get("ResourceTagSet.Tags"),
          ]),
        }),
      ]),
    // When at least one of the hosted zone is private:
    //   Get the list of VPCs
    //   For each VPCs, call listHostedZonesByVPC to get the hosted zones associated to the VPC
    //   Group the list by hosted zones
    //   Assign the hosted zones with the vpc associations
    transformListPost:
      ({ lives, endpoint }) =>
      (hostedZones) =>
        pipe([
          () => hostedZones,
          when(
            any(get("Config.PrivateZone")),
            pipe([
              () =>
                lives.getByType({
                  type: "Vpc",
                  group: "EC2",
                  providerName: config.providerName,
                }),
              pluck("live"),
              flatMap(({ VpcId /*Region */ }) =>
                pipe([
                  //TODO add region to the VPC, then
                  () => ({
                    VPCId: VpcId,
                    VPCRegion: config.region, // /*Region */
                  }),
                  endpoint().listHostedZonesByVPC,
                  get("HostedZoneSummaries"),
                  map(
                    defaultsDeep({
                      VPCId: VpcId /*, VPCRegion: config.region*/,
                    })
                  ),
                ])()
              ),
              groupBy("HostedZoneId"),
              (mapZone) =>
                pipe([
                  () => hostedZones,
                  map(
                    assign({
                      VpcAssociations: ({ Id }) =>
                        pipe([
                          () => Id,
                          hostedZoneIdToResourceId,
                          (id) => mapZone.get(id),
                          map(pick(["VPCId", "VPCRegion", "Owner"])),
                        ])(),
                    })
                  ),
                ])(),
            ])
          ),
        ])(),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getHostedZone-property
  const getById = client.getById({
    pickId,
    method: "getHostedZone",
    ignoreErrorCodes: ["NoSuchHostedZone"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createHostedZone-property
  const create = ({
    name,
    namespace,
    payload = {},
    resolvedDependencies: { domain },
  }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(payload);
        logger.info(`create hosted zone: ${name}, ${tos(payload)}`);
      }),
      () => payload,
      defaultsDeep({ CallerReference: getNewCallerReference() }),
      route53().createHostedZone,
      tap((result) => {
        logger.debug(`created hosted zone: ${name}, result: ${tos(result)}`);
      }),
      tap(
        pipe([
          get("HostedZone.Id"),
          tap((Id) => {
            assert(Id);
          }),
          hostedZoneIdToResourceId,
          (ResourceId) => ({
            ResourceId,
            AddTags: payload.Tags,
            ResourceType: "hostedzone",
          }),
          route53().changeTagsForResource,
        ])
      ),
      // tap(({ HostedZone }) =>
      //   pipe([
      //     () => payload.RecordSet,
      //     map((ResourceRecordSet) => ({
      //       Action: "CREATE",
      //       ResourceRecordSet,
      //     })),
      //     tap.if(not(isEmpty), (Changes) =>
      //       route53().changeResourceRecordSets({
      //         HostedZoneId: HostedZone.Id,
      //         ChangeBatch: {
      //           Changes,
      //         },
      //       })
      //     ),
      //   ])()
      // ),
      tap.if(
        ({ DelegationSet }) =>
          domain &&
          DelegationSet &&
          !isEmpty(
            differenceWith(
              isDeepEqual,
              DelegationSet.NameServers
            )(domain.live.Nameservers.map(({ Name }) => Name))
          ),
        pipe([
          get("DelegationSet.NameServers"),
          tap((NameServers) => {
            logger.debug(
              `updateDomainNameservers ${tos(NameServers)}, old: ${tos(
                domain.live.Nameservers
              )}`
            );
          }),
          map((nameserver) => ({ Name: nameserver })),
          tryCatch(
            pipe([
              //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Domains.html#updateDomainNameservers-property
              (Nameservers) => ({
                DomainName: domain.live.DomainName,
                Nameservers,
              }),
              route53Domains().updateDomainNameservers,
              tap(({ OperationId }) => {
                logger.debug(`updateDomainNameservers ${tos({ OperationId })}`);
              }),
              ({ OperationId }) =>
                retryCall({
                  name: `updateDomainNameservers: getOperationDetail OperationId: ${OperationId}`,
                  fn: pipe([
                    () => ({ OperationId }),
                    route53Domains().getOperationDetail,
                    tap((details) => {
                      logger.debug(
                        `updateDomainNameservers details: ${util.inspect(
                          details
                        )}`
                      );
                    }),
                    tap(({ Status, Message }) =>
                      pipe([
                        tap(() => {
                          logger.debug(
                            `updateDomainNameservers Status: ${Status}, Message: ${Message}`
                          );
                        }),
                        () => ["ERROR", "FAILED"],
                        tap.if(includes(Status), () => {
                          logger.error(
                            `Cannot updateDomainNameservers: ${Message}`
                          );
                          throw Error(
                            `Cannot updateDomainNameservers: ${Message}`
                          );
                        }),
                      ])()
                    ),
                  ]),
                  isExpectedResult: or([
                    pipe([get("Status"), isEmpty]), //TODO SDK v3 does not have Status
                    pipe([eq(get("Status"), "SUCCESSFUL")]),
                  ]),
                  config,
                }),
              // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Domains.html#getOperationDetail-property
            ]),
            (error) => {
              logger.error(`updateDomainNameservers ${tos({ error })}`);
              throw error;
            }
          ),
        ])
      ),
      tap((HostedZone) => {
        logger.debug(`created done`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteHostedZone-property
  const destroy = client.destroy({
    pickId,
    preDestroy: ({ live, name }) =>
      pipe([
        () => live,
        ({ Id: HostedZoneId }) =>
          pipe([
            () => ({
              HostedZoneId,
            }),
            route53().listResourceRecordSets,
            get("ResourceRecordSets"),
            tap((ResourceRecordSet) => {
              logger.debug(`destroy ${tos(ResourceRecordSet)}`);
            }),
            filter(canDeleteRecord(name)),
            map((ResourceRecordSet) => ({
              Action: "DELETE",
              ResourceRecordSet: filterEmptyResourceRecords(ResourceRecordSet),
            })),
            tap((Changes) => {
              //logger.debug(`destroy ${tos(Changes)}`);
            }),
            tap.if(not(isEmpty), (Changes) =>
              route53().changeResourceRecordSets({
                HostedZoneId,
                ChangeBatch: {
                  Changes,
                },
              })
            ),
          ])(),
      ])(),
    method: "deleteHostedZone",
    getById,
    ignoreErrorCodes: ["NoSuchHostedZone"],
    config,
  });

  const update = ({ name, live, diff }) =>
    pipe([
      tap(() => {
        logger.info(`update hosted zone ${name}, diff: ${tos(diff)}`);
        assert(name, "name");
        assert(live, "live");
        assert(diff, "diff");
        assert(diff.needUpdate, "diff.needUpate");
        assert(diff.deletions, "diff.deletions");
      }),
      switchCase([
        () => diff.needUpdateRecordSet,
        tryCatch(
          pipe([
            () =>
              map((ResourceRecordSet) => ({
                Action: "DELETE",
                ResourceRecordSet:
                  filterEmptyResourceRecords(ResourceRecordSet),
              }))(diff.deletions),
            tap((Changes) => {
              logger.debug(`update changes ${tos(Changes)}`);
            }),
            (Changes) =>
              route53().changeResourceRecordSets({
                HostedZoneId: live.Id,
                ChangeBatch: {
                  Changes,
                },
              }),
            tap(({ ChangeInfo }) => {
              logger.info(`updated ${name}, ChangeInfo: ${ChangeInfo}`);
            }),
          ]),
          (error) => {
            logError(`update`, error);
            //TODO axios here ?
            throw axiosErrorToJSON(error);
          }
        ),
      ]),
    ])();

  const configDefault = ({
    name,
    properties: { Tags, ...otherProp },
    namespace,
    dependencies: { vpc },
  }) =>
    pipe([
      () => otherProp,
      defaultsDeep({
        Name: name,
        Tags: buildTags({
          name,
          namespace,
          config,
          UserTags: Tags,
        }),
      }),
      when(
        () => vpc,
        defaultsDeep({
          VPC: { VPCId: getField(vpc, "VpcId"), VPCRegion: config.region },
        })
      ),
      tap((params) => {
        assert(true);
      }),
    ])();

  const ResourceType = "hostedzone";

  return {
    spec,
    findId,
    getByName,
    findDependencies,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    findNamespace: findNamespaceInTags(config),
    tagResource: tagResource({ ResourceType })({ endpoint: route53 }),
    untagResource: untagResource({ ResourceType })({ endpoint: route53 }),
  };
};
