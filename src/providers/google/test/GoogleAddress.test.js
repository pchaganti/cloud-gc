const assert = require("assert");
const GoogleProvider = require("../GoogleProvider");
const configProvider = require("../config");
const { testProviderLifeCycle } = require("../../../test/E2ETestUtils");

describe("GoogleAddress", async function () {
  const addressName = "myaddress-test";
  let provider;
  let address;
  before(async () => {
    provider = await GoogleProvider({ name: "google", config: configProvider });
    address = provider.makeAddress({ name: addressName });
    await provider.destroyAll();
  });
  after(async () => {
    await provider.destroyAll();
  });
  it("address config", async function () {
    const config = await address.resolveConfig();
    assert(config);
    assert.equal(config.name, addressName);
    //TODO use label instead
    assert.equal(config.description, `${addressName}${provider.config.tag}`);
  });
  it("lives", async function () {
    const lives = await provider.listLives();
    //console.log("lives ip", lives);
  });
  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });
  it.skip("deploy plan", async function () {
    await testProviderLifeCycle({ provider });
  });
});