const assert = require("assert");
const { pipe, tap, get, pick, eq, map } = require("rubico");
const { defaultsDeep, pluck, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./RedshiftServerlessCommon");

const buildArn = () =>
  pipe([
    get("namespaceArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  tap(({ namespaceName }) => {
    assert(namespaceName);
  }),
  pick(["namespaceName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html
exports.RedshiftServerlessNamespace = () => ({
  type: "Namespace",
  package: "redshift-serverless",
  client: "RedshiftServerless",
  propertiesDefault: {},
  omitProperties: [
    "creationDate",
    "defaultIamRoleArn",
    "iamRoles",
    "kmsKeyId",
    "namespaceArn",
    "namespaceId",
    "status",
    "adminUserPassword",
  ],
  inferName: pipe([
    get("properties.namespaceName"),
    tap((Name) => {
      assert(Name);
    }),
  ]),
  findName: () =>
    pipe([
      get("namespaceName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("namespaceName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  environmentVariables: [
    { path: "adminUsername", suffix: "ADMIN_USERNAME" },
    { path: "adminUserPassword", suffix: "ADMIN_USER_PASSWORD" },
  ],
  dependencies: {
    iamRoleDefault: {
      type: "Role",
      group: "IAM",
      dependencyIds: ({ lives, config }) => pipe([get("defaultIamRoleArn")]),
    },
    iamRoles: {
      type: "Role",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Monitors"), pluck("AlarmRoleArn")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("kmsKeyId"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#getNamespace-property
  getById: {
    method: "getNamespace",
    getField: "namespace",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#listNamespaces-property
  getList: {
    method: "listNamespaces",
    getParam: "namespaces",
    decorate: ({ getById }) => pipe([getById]),
    //decorate: ({ getById }) => pipe([(name) => ({ name }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#createNamespace-property
  create: {
    method: "createNamespace",
    pickCreated: ({ payload }) => pipe([get("namespace")]),
    isInstanceUp: pipe([eq(get("status"), "AVAILABLE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#updateNamespace-property
  update: {
    method: "updateNamespace",
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#deleteNamespace-property
  destroy: {
    method: "deleteNamespace",
    pickId,
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ namespaceName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { iamRoleDefault, iamRoles, kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
          key: "key",
          value: "value",
        }),
      }),
      when(
        () => iamRoles,
        defaultsDeep({
          iamRoles: pipe([
            () => iamRoles,
            map((role) => getField(role, "Arn")),
          ])(),
        })
      ),
      when(
        () => iamRoleDefault,
        defaultsDeep({
          defaultIamRoleArn: getField(iamRoleDefault, "Arn"),
        })
      ),
      when(
        () => kmsKey,
        defaultsDeep({
          kmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
