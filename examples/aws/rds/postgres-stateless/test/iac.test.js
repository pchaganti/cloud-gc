const assert = require("assert");
const { Cli, testEnd2End } = require("@grucloud/core/cli/cliCommands");
const { createStack } = require("../iac");
const path = require("path");

describe("RDS Postgres Stateless", async function () {
  before(async function () {});
  it("run", async function () {
    const programOptions = { workingDirectory: path.resolve(__dirname, "../") };
    const cli = await Cli({ programOptions, createStack });

    await testEnd2End({
      cli,
      listOptions: {},
    });
  }).timeout(20 * 60e3);
});
