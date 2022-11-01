const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("ElastiCache CacheCluster", async function () {
  let config;
  let provider;
  let cluster;

  before(async function () {
    provider = await AwsProvider({ config });
    cluster = provider.getClient({
      groupType: "ElastiCache::CacheCluster",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => cluster.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        cluster.destroy({
          live: { CacheClusterId: "cluster-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        cluster.getById({
          CacheClusterId: "cluster-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        cluster.getByName({
          name: "cluster-1234",
        }),
    ])
  );
});
