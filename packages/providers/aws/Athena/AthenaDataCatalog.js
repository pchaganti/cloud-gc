const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./AthenaCommon");

const ignoreErrorMessages = ["was not found"];

const buildArn =
  ({ region, accountId }) =>
  ({ Name }) =>
    `arn:${
      config.partition
    }:athena:${region}:${accountId()}:datacatalog/${Name}`;

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const cannotBeDeleted = () => pipe([eq(get("Name"), "AwsDataCatalog")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html
exports.AthenaDataCatalog = ({ compare }) => ({
  type: "DataCatalog",
  package: "athena",
  client: "Athena",
  propertiesDefault: {},
  omitProperties: [],
  inferName: () => get("Name"),
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Name"),
      tap((id) => {
        assert(id);
      }),
    ]),
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),

  ignoreErrorCodes: ["ResourceNotFoundException"],
  ignoreErrorMessages,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#getDataCatalog-property
  getById: {
    method: "getDataCatalog",
    getField: "DataCatalog",
    pickId,
    ignoreErrorMessages,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#listDataCatalogs-property
  getList: {
    method: "listDataCatalogs",
    getParam: "DataCatalogsSummary",
    decorate: ({ getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        ({ CatalogName }) => ({ Name: CatalogName }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#createDataCatalog-property
  create: {
    method: "createDataCatalog",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#updateDataCatalog-property
  update: {
    method: "updateDataCatalog",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#deleteDataCatalog-property
  destroy: {
    method: "deleteDataCatalog",
    pickId,
    ignoreErrorMessages,
  },
});
