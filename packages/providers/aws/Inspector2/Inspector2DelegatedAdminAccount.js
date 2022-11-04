const assert = require("assert");
const { pipe, tap, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");
const pickId = pipe([pick(["delegatedAdminAccountId"])]);

const model = ({ config }) => ({
  package: "inspector2",
  client: "Inspector2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html#listDelegatedAdminAccounts-property
  getList: {
    method: "listDelegatedAdminAccounts",
    getParam: "delegatedAdminAccounts",
    decorate: ({ getById }) =>
      pipe([
        tap((params) => {
          assert(params);
        }),
        ({ accountId, ...other }) => ({
          delegatedAdminAccountId: accountId,
          ...other,
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html#enableDelegatedAdminAccount-property
  create: {
    method: "enableDelegatedAdminAccount",
    pickCreated: ({ payload }) => pipe([() => payload]),
    filterParams: pipe([
      tap((params) => {
        assert(true);
      }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html#disableDelegatedAdminAccount-property
  destroy: {
    method: "disableDelegatedAdminAccount",
    pickId,
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html
exports.Inspector2DelegatedAdminAccount = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([() => "default"]),
    findId: pipe([() => "default"]),
    //TODO
    update:
      ({ endpoint }) =>
      ({ payload, live }) =>
        pipe([
          () => live,
          endpoint().disableDelegatedAdminAccount,
          () => payload,
          endpoint().enableDelegatedAdminAccount,
        ])(),
    getByName: ({ getList, endpoint, getById }) => pipe([getList]),
    configDefault: ({
      name,
      namespace,
      properties: { ...otherProps },
      dependencies: { account },
    }) =>
      pipe([
        tap((params) => {
          assert(account);
        }),
        () => otherProps,
        defaultsDeep({
          delegatedAdminAccountId: getField(account, "Id"),
        }),
      ])(),
  });
