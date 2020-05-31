const assert = require("assert");
const logger = require("logger")({ prefix: "CoreProvider" });
const { testProviderLifeCycle } = require("test/E2ETestUtils");
const ScalewayProvider = require("../ScalewayProvider");
const config = require("../config");

describe("ScalewayProvider", async function () {
  let provider;
  let ip;
  let image;
  let server;

  before(async () => {
    provider = await ScalewayProvider({ name: "scaleway", config });
    await provider.destroyAll();
    ip = provider.makeIp({ name: "myip" });
    image = provider.makeImage({
      name: "ubuntu",
      config: ({ items: images }) => {
        assert(images);
        const image = images.find(
          ({ name, arch, default_bootscript }) =>
            name.includes("Ubuntu") && arch === "x86_64" && default_bootscript
        );
        assert(image);
        return image;
      },
    });
    server = provider.makeServer({
      name: "web-server",
      dependencies: { image, ip },
      properties: {
        name: "web-server",
        commercial_type: "DEV1-S",
        volumes: {
          "0": {
            size: 20_000_000_000,
          },
        },
      },
    });
  });
  after(async () => {
    await provider.destroyAll();
  });

  it("list all config", async function () {
    const configs = await provider.listConfig();
    //console.log(JSON.stringify(configs, null, 4));
    assert(configs);
  });

  it("list lives", async function () {
    const result = await provider.listLives();
    //console.log(JSON.stringify(result, null, 4));
    assert(result);
  });
  it("list targets", async function () {
    const result = await provider.listTargets();
    assert(result);
  });
  it.skip("plan", async function () {
    await testProviderLifeCycle({ provider });
  });
});