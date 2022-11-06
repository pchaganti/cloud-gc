const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("BatchComputeEnvironment", async function () {
  let config;
  let provider;
  let computeEnvironment;

  before(async function () {
    provider = await AwsProvider({ config });
    computeEnvironment = provider.getClient({
      groupType: "Batch::ComputeEnvironment",
    });
    await provider.start();
  });
  after(async () => {});
  it(
    "list",
    pipe([
      () => computeEnvironment.getList(),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => ({
        live: {
          computeEnvironmentName: "compute-environment",
        },
      }),
      (x) => computeEnvironment.destroy(x),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        computeEnvironment.getById({
          computeEnvironmentName: "compute-environment",
        }),
    ])
  );
});
