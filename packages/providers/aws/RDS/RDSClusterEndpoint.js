const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase, not } = require("rubico");
const { defaultsDeep, when, isEmpty, append } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");

const { Tagger } = require("./RDSCommon");

const buildArn = () =>
  pipe([
    get("DBClusterEndpointArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DBClusterEndpointIdentifier }) => {
    assert(DBClusterEndpointIdentifier);
  }),
  pick(["DBClusterEndpointIdentifier"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const managedByOther = () => pipe([not(get("DBClusterEndpointIdentifier"))]);

const model = ({ config }) => ({
  package: "rds",
  client: "RDS",
  ignoreErrorCodes: ["DBClusterEndpointNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Neptune.html#getDBClusterEndpoint-property
  getById: {
    method: "describeDBClusterEndpoints",
    getField: "DBClusterEndpoints",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Neptune.html#describeDBClusterEndpoints-property
  getList: {
    method: "describeDBClusterEndpoints",
    getParam: "DBClusterEndpoints",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Neptune.html#createDBClusterEndpoint-property
  create: {
    method: "createDBClusterEndpoint",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("Status"), "available")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Neptune.html#modifyDBClusterEndpoint-property
  update: {
    method: "modifyDBClusterEndpoint",
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Neptune.html#deleteDBClusterEndpoint-property
  destroy: {
    method: "deleteDBClusterEndpoint",
    pickId,
  },
});

const findNameClusterEndpoint = pipe([
  switchCase([
    get("DBClusterEndpointIdentifier"),
    get("DBClusterEndpointIdentifier"),
    pipe([
      tap((params) => {
        assert(true);
      }),
      ({ DBClusterIdentifier, EndpointType }) =>
        `${DBClusterIdentifier}::${EndpointType}`,
    ]),
  ]),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Neptune.html
exports.RDSClusterEndpoint = ({ compare }) => ({
  type: "DBClusterEndpoint",
  propertiesDefault: {},
  omitProperties: [
    "DBClusterIdentifier",
    "DBClusterEndpointResourceIdentifier",
    "Endpoint",
    "Status",
    "DBClusterEndpointArn",
    "CustomEndpointType",
  ],
  inferName: get("properties.DBClusterEndpointIdentifier"),
  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  dependencies: {
    cluster: {
      type: "DBCluster",
      group: "Neptune",
      dependencyId: ({ lives, config }) => pipe([get("DBClusterIdentifier")]),
    },
  },
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      managedByOther,
      cannotBeDeleted: managedByOther,
      findName: () => pipe([findNameClusterEndpoint]),
      findId: () =>
        pipe([
          findNameClusterEndpoint,
          tap((id) => {
            assert(id);
          }),
        ]),
      getByName: ({ getById }) =>
        pipe([
          ({ name }) => ({ DBClusterEndpointIdentifier: name }),
          getById({}),
        ]),
      ...Tagger({ buildArn: buildArn(config) }),
      configDefault: ({
        name,
        namespace,
        properties: { Tags, ...otherProps },
        dependencies: { cluster },
      }) =>
        pipe([
          tap((params) => {
            assert(cluster);
          }),
          () => otherProps,
          defaultsDeep({
            DBClusterIdentifier: getField(cluster, "DBClusterIdentifier"),
            Tags: buildTags({ name, config, namespace, UserTags: Tags }),
          }),
        ])(),
    }),
});
