const assert = require("assert");
const { find } = require("rubico/x");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const cliCommands = require("@grucloud/core/cli/cliCommands");

describe("AwsHostedZone", async function () {
  let config;
  const types = ["HostedZone"];
  const domainName = "grucloud.org";
  const subDomainName = `sub.${domainName}`;

  const createStack = async ({ config }) => {
    const provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    const domain = await provider.route53Domain.useRoute53Domain({
      name: domainName,
    });

    const hostedZone = await provider.route53.makeHostedZone({
      name: `${subDomainName}.`,
      dependencies: { domain },
      properties: () => ({}),
    });

    const recordA = await provider.route53.makeRoute53Record({
      name: `${subDomainName}.`,
      dependencies: { hostedZone },
      properties: () => ({
        ResourceRecords: [
          {
            Value: "192.0.2.44",
          },
        ],
        TTL: 60,
        Type: "A",
      }),
    });

    const recordNS = await provider.route53.makeRoute53Record({
      name: `validation.${subDomainName}.`,
      dependencies: { hostedZone },
      properties: () => ({
        Name: `1234567890.${subDomainName}.`,
        ResourceRecords: [
          {
            Value: "ns-1139.awsdns-14.org.",
          },
        ],
        TTL: 60,
        Type: "NS",
      }),
    });

    return { provider, resources: { domain, hostedZone, recordA, recordNS } };
  };

  const createStackNext = async ({ config }) => {
    const provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    const domain = await provider.route53Domain.useRoute53Domain({
      name: domainName,
    });

    const hostedZone = await provider.route53.makeHostedZone({
      name: `${subDomainName}.`,
      dependencies: { domain },
      properties: () => ({}),
    });

    const recordA = await provider.route53.makeRoute53Record({
      name: `${subDomainName}.`,
      dependencies: { hostedZone },
      properties: () => ({
        ResourceRecords: [
          {
            Value: "192.0.2.45",
          },
        ],
        TTL: 60,
        Type: "A",
      }),
    });
    return { provider, resources: { domain, hostedZone, recordA } };
  };
  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});

  it("hostedZone apply plan", async function () {
    const {
      provider,
      resources: { hostedZone },
    } = await createStack({ config });

    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 3, destroy: 0 },
    });

    const hostedZoneLive = await hostedZone.getLive();
    assert(hostedZoneLive);
    assert(find((record) => record.Type === "A")(hostedZoneLive.RecordSet));

    const { provider: providerNext } = await createStackNext({ config });

    const { error, resultQuery } = await cliCommands.planQuery({
      infra: { provider: providerNext },
      commandOptions: {},
    });

    assert(!error);
    const plan = resultQuery.results[0];
    //assert.equal(plan.resultDestroy.length, 1);
    //assert.equal(plan.resultCreate.length, 2);
    const updateHostedZone = plan.resultCreate[0];
    assert.equal(updateHostedZone.action, "UPDATE");
    assert(updateHostedZone.diff.liveDiff.updated.ResourceRecords);

    //const updateRecord = plan.resultCreate[1];
    //assert.equal(updateRecord.action, "UPDATE");
    //assert(updateRecord.diff.updated.ResourceRecords);
    {
      const result = await cliCommands.planApply({
        infra: { provider: providerNext },
        commandOptions: { force: true },
      });
      assert(!result.error);
      // assert.equal(
      //   result.resultDeploy.results[0].resultCreate.results.length,
      //   2
      // );
    }
    await testPlanDestroy({ provider: providerNext, types });
  });
});
