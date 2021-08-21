const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  or,
  not,
  omit,
  assign,
} = require("rubico");
const { defaultsDeep, isEmpty, first, includes } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "ECSCluster" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findName = get("live.clusterName");
const findId = get("live.clusterArn");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html

exports.ECSCluster = ({ spec, config }) => {
  const ecs = () => createEndpoint({ endpointName: "ECS" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "CapacityProvider",
      group: "ecs",
      ids: pipe([
        () => live,
        get("capacityProviders"),
        map(
          pipe([
            (name) =>
              lives.getByName({
                name,
                type: "CapacityProvider",
                group: "ecs",
                providerName: config.providerName,
              }),
            get("id"),
          ])
        ),
      ])(),
    },
    {
      type: "Key",
      group: "kms",
      ids: pipe([
        () => live,
        get("configuration.executeCommandConfiguration.kmsKeyId"),
      ])(),
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeClusters-property
  const describeClusters = (params = {}) =>
    pipe([
      () => params,
      defaultsDeep({ include: ["TAGS"] }),
      ecs().describeClusters,
      get("clusters"),
      tap((clusters) => {
        logger.debug(`describeClusters #cluster ${tos(clusters)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#getParameter-property
  const getByName = ({ name }) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(name);
        }),
        () => ({ clusters: [name] }),
        describeClusters,
        first,
      ]),
      switchCase([
        eq(get("code"), "ClusterNotFoundException"),
        () => undefined,
        (error) => {
          throw error;
        },
      ])
    )();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listClusters-property

  const getList = () =>
    pipe([
      ecs().listClusters,
      get("clusterArns"),
      (clusters) => ({ clusters }),
      describeClusters,
    ])();
  const isUpByName = pipe([getByName, not(isEmpty)]);

  const isInstanceDown = or([isEmpty, eq(get("status"), "INACTIVE")]);

  const isDownByName = pipe([getByName, isInstanceDown]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createCluster-property
  const create = ({ payload, name, namespace }) =>
    pipe([
      () => payload,
      omit(["Tags"]),
      ecs().createCluster,
      // () => ({
      //   resourceArn: `arn:aws:ecs:${
      //     config.region
      //   }:${config.accountId()}:cluster/${name}`,
      //   tags: buildTags({
      //     name,
      //     config,
      //     namespace,
      //     UserTags: payload.Tags,
      //     key: "key",
      //     value: "value",
      //   }),
      // }),
      // tap((params) => {
      //   assert(true);
      // }),
      // ecs().tagResource,
      tap(() =>
        retryCall({
          name: `createCluster isUpByName: ${name}`,
          fn: () => isUpByName({ name }),
        })
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteCluster-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      ({ clusterName }) => ({ cluster: clusterName }),
      tap(({ cluster }) => {
        assert(cluster);
      }),
      tryCatch(
        pipe([
          ({ cluster }) =>
            retryCall({
              name: `deleteCluster isDownByName: ${live.clusterName}`,
              fn: () => ecs().deleteCluster({ cluster }),
              config,
              shouldRetryOnException: ({ error }) =>
                pipe([
                  tap(() => {
                    logger.error(
                      `deleteCluster isExpectedException ${tos(error)}`
                    );
                  }),
                  () => error,
                  eq(get("code"), "ClusterContainsContainerInstancesException"),
                ])(),
            }),
          () =>
            retryCall({
              name: `deleteCluster isDownByName: ${live.clusterName}`,
              fn: () => isDownByName({ name: live.clusterName }),
              config,
            }),
        ]),
        (error, params) =>
          pipe([
            tap(() => {
              logger.error(`error deleteCluster ${tos({ params, error })}`);
            }),
            () => error,
            switchCase([
              or([
                eq(get("code"), "ClusterNotFoundException"),
                pipe([
                  get("message"),
                  includes(
                    "The specified cluster is inactive. Specify an active cluster and try again."
                  ),
                ]),
              ]),
              () => undefined,
              () => {
                throw error;
              },
            ]),
          ])()
      ),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { capacityProviders = [] },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        clusterName: name,
        capacityProviders: pipe([
          () => capacityProviders,
          map((capacityProvider) => getField(capacityProvider, "name")),
        ])(),
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
          key: "key",
          value: "value",
        }),
      }),
      tap((params) => {
        assert(true);
      }),
    ])();

  return {
    spec,
    findId,
    findNamespace,
    findDependencies,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
