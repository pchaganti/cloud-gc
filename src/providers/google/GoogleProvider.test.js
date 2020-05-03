const assert = require("assert");
const GoogleProvider = require("./GoogleProvider");
const config = require("./config");
const { testProviderLifeCycle } = require("test/E2ETestUtils");

describe("GoogleProvider", async function () {
  const provider = await GoogleProvider({ name: "google" }, config);
  const ip = provider.makeAddress({ name: "ip-webserver" });

  const server = provider.makeInstance({
    name: "web-server",
    dependencies: {},
    config: async ({ dependencies: { ip } }) => ({
      machineType: "e2-micro",
      networkInterfaces: [
        {
          accessConfigs: [
            {
              natIP: await ip.configLive().address,
            },
          ],
        },
      ],
    }),
  });

  before(async () => {
    await provider.destroyAll();
  });
  after(async () => {
    await provider.destroyAll();
  });
  it.only("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 2);
  });
  it.skip("deploy plan", async function () {
    await testProviderLifeCycle({ provider });
  });
});
