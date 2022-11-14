const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ IdentityStoreId, UserId }) => {
    assert(IdentityStoreId);
    assert(UserId);
  }),
  pick(["IdentityStoreId", "UserId"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live);
    }),
    defaultsDeep({ InstanceArn: live.InstanceArn }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html
exports.IdentityStoreUser = () => ({
  type: "User",
  propertiesDefault: {},
  omitProperties: ["UserId", "IdentityStoreId", "InstanceArn"],
  // TODO prefix with store name ?
  inferName: pipe([
    get("properties.UserName"),
    tap((UserName) => {
      assert(UserName);
    }),
  ]),
  dependencies: {
    identityStore: {
      type: "Instance",
      group: "SSOAdmin",
      parent: true,
      //excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("InstanceArn"),
          tap((InstanceArn) => {
            assert(InstanceArn);
          }),
        ]),
    },
  },
  package: "identitystore",
  client: "Identitystore",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#describeUser-property
  getById: {
    method: "describeUser",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#listUsers-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#createUser-property
  create: {
    method: "createUser",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#updateUser-property
  update: {
    method: "updateUser",
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#deleteUser-property
  destroy: {
    method: "deleteUser",
    pickId,
  },
  // TODO prefix with store name ?
  findName: pipe([
    get("live"),
    get("UserName"),
    tap((name) => {
      assert(name);
    }),
  ]),
  // TODO prefix with store id ?
  findId: pipe([
    get("live"),
    get("UserId"),
    tap((id) => {
      assert(id);
    }),
  ]),
  getByName: getByNameCore,
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Instance", group: "SSOAdmin" },
          pickKey: pipe([
            tap((params) => {
              assert(true);
            }),
            pick(["IdentityStoreId", "InstanceArn"]),
          ]),
          method: "listUsers",
          getParam: "Users",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent);
              }),
              defaultsDeep({ InstanceArn: parent.InstanceArn }),
            ]),
        }),
    ])(),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { identityStore },
  }) =>
    pipe([
      tap((params) => {
        assert(identityStore);
      }),
      () => otherProps,
      defaultsDeep({
        IdentityStoreId: getField(identityStore, "IdentityStoreId"),
      }),
    ])(),
});
