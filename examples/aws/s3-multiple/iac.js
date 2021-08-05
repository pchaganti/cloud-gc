const { pipe, map } = require("rubico");

const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = async ({ provider }) => {
  const maxBuckets = 2;
  const resources = await pipe([
    () => maxBuckets,
    (maxBuckets) =>
      Array(maxBuckets)
        .fill("")
        .map((value, index) => `grucloud-bucket-${index}`),

    map((bucket) =>
      provider.s3.makeBucket({
        name: bucket,
        properties: () => ({}),
      })
    ),
  ])();

  return resources;
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  const resources = await createResources({ provider });
  return { provider, resources };
};
