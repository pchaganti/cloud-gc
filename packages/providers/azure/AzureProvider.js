const assert = require("assert");
const { map, pipe, get, tap, fork, tryCatch, assign } = require("rubico");
const path = require("path");
const CoreProvider = require("@grucloud/core/CoreProvider");
const {
  createProjectAzure,
  writeConfigToFile,
} = require("@grucloud/core/cli/providers/createProjectAzure");

const { mergeConfig } = require("@grucloud/core/ProviderCommon");
const { AzAuthorize } = require("./AzAuthorize");
const { checkEnv } = require("@grucloud/core/Utils");
const { generateCode } = require("./Az2gc");
const { fnSpecs } = require("./AzureSpec");

const AUDIENCES = ["https://management.azure.com", "https://vault.azure.net"];

exports.AzureProvider = ({
  name = "azure",
  config,
  configs = [],
  ...other
}) => {
  const mandatoryEnvs = ["TENANT_ID", "SUBSCRIPTION_ID", "APP_ID", "PASSWORD"];

  const bearerTokenMap = {};

  const authorizeByResource = ({ resource }) =>
    pipe([
      AzAuthorize({ resource }),
      get("bearerToken"),
      tap((bearerToken) => {
        bearerTokenMap[resource] = bearerToken;
      }),
    ]);

  const start = pipe([
    tap(() => {
      checkEnv(mandatoryEnvs);
    }),
    () => AUDIENCES,
    map((resource) =>
      pipe([
        () => ({
          tenantId: process.env.TENANT_ID,
          appId: process.env.APP_ID,
          password: process.env.PASSWORD,
        }),
        authorizeByResource({
          resource,
        }),
      ])()
    ),
  ]);

  const configProviderDefault = {
    bearerToken: pipe([
      (audience) => bearerTokenMap[audience],
      tap((params) => {
        assert(true);
      }),
    ]),
    retryCount: 60,
    retryDelay: 10e3,
    tenantId: process.env.TENANT_ID,
    appId: process.env.APP_ID,
  };

  const makeConfig = () =>
    mergeConfig({ configDefault: configProviderDefault, config, configs });

  const info = () => ({
    subscriptionId: process.env.SUBSCRIPTION_ID,
    tenantId: process.env.TENANT_ID,
    appId: process.env.APP_ID,
    config: makeConfig(),
  });

  const configRead = ({ programOptions }) =>
    pipe([
      tryCatch(
        pipe([
          () => path.resolve(programOptions.workingDirectory, "config.js"),
          require,
          (fnConfig) => fnConfig(),
        ]),
        (error) => {
          return undefined;
        }
      ),
    ])();

  const init = ({ options, programOptions }) =>
    pipe([
      tap(() => {
        assert(programOptions.workingDirectory);
      }),
      fork({
        config: pipe([() => ({ programOptions }), configRead]),
        dirs: () => ({
          destination: path.resolve(programOptions.workingDirectory),
        }),
      }),
      assign({ projectName: get("config.projectName") }),
      createProjectAzure,
      writeConfigToFile,
    ])();

  // GET https://management.azure.com/subscriptions/{subscriptionId}/resources?api-version=2021-04-01
  // const axios = AxiosMaker({
  //   baseURL: AZURE_MANAGEMENT_BASE_URL,
  //   onHeaders: () => ({
  //     Authorization: `Bearer ${_bearerToken}`,
  //   }),
  // });

  // const listLives = ({
  //   onStateChange = identity,
  //   options = {},
  //   title = "TT",
  //   readWrite = false,
  // } = {}) =>
  //   pipe([
  //     tap(() => {
  //       assert(options);
  //     }),
  //     () =>
  //       `/subscriptions/${process.env.SUBSCRIPTION_ID}/resources?api-version=2021-04-01`,
  //     axios.get,
  //     get("data.value"),
  //   ])();

  return {
    ...CoreProvider({
      ...other,
      type: "azure",
      name,
      mandatoryConfigKeys: ["location"],
      makeConfig,
      fnSpecs,
      start,
      info,
      init,
      generateCode: ({ commandOptions, programOptions }) =>
        generateCode({
          providerConfig: makeConfig(),
          specs: fnSpecs(makeConfig()),
          commandOptions,
          programOptions,
        }),
    }),
    //listLives,
  };
};
