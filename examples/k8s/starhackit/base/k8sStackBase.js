const assert = require("assert");
const { K8sProvider } = require("@grucloud/core");
const { createChartWebServer } = require("./charts/web-server");
const { createChartRestServer } = require("./charts/rest-server");
const { createChartPostgres } = require("./charts/postgres");
const { createChartRedis } = require("./charts/redis");
const hooks = require("./hooks");

const createResources = async ({ provider, config }) => {
  assert(config.namespaceName);

  const serviceAccountName = "service-account-aws";

  const namespace = await provider.makeNamespace({
    name: config.namespaceName,
  });

  const postgresChart = await createChartPostgres({
    provider,
    resources: { namespace },
    config,
  });

  const redisChart = await createChartRedis({
    provider,
    resources: { namespace },
    config,
  });

  const restServerChart = await createChartRestServer({
    provider,
    resources: {
      namespace,
      postgresService: postgresChart.service,
      redisService: redisChart.service,
    },
    config,
  });

  const webServerChart = await createChartWebServer({
    provider,
    resources: { namespace },
    config,
  });

  const serviceAccount = await provider.makeServiceAccount({
    name: serviceAccountName,
    dependencies: { namespace },
    properties: () => ({}),
  });

  return {
    namespace,
    serviceAccount,
    restServerChart,
    webServerChart,
  };
};

exports.createResources = createResources;

exports.createStack = async ({ config, dependencies }) => {
  const provider = K8sProvider({ config, dependencies });

  return {
    provider,
    resources: await createResources({ provider, config }),
    hooks,
  };
};
