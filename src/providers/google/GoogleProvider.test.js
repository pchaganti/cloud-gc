const assert = require("assert");
const GoogleProvider = require("./GoogleProvider");

const config = {
  project: "starhackit",
  region: "europe-west4",
  zone: "europe-west4-a",
};

describe.skip("GoogleProvider", function () {
  const provider = GoogleProvider({ name: "google" }, config);

  const volume = provider.makeVolume({
    name: "volume1",
    config: () => ({
      size: 20000000000,
    }),
  });

  const server = provider.makeServer({
    name: "web-server",
    dependencies: { volume },
    config: async ({ dependencies: { volume } }) => ({
      name: "web-server",
    }),
  });
});
