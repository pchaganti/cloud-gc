const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe } = require("rubico");

describe("Api Gateway V2 DomainName", async function () {
  let config;
  let provider;
  let domainName;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    domainName = provider.getClient({ groupType: "ApiGatewayV2::DomainName" });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        domainName.destroy({
          live: { DomainName: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        domainName.getById({
          DomainName: "12345",
        }),
    ])
  );
});
