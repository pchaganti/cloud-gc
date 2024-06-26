const { describe, it } = require("node:test");
const assert = require("assert");
const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const config = require("../config");

const title = "Gcp Storate simple";

describe(title, async function () {
  it(
    "run",
    {
      timeout: 35 * 60e3,
    },
    async function () {
      await testEnd2End({
        title,
        programOptions: { workingDirectory: path.resolve(__dirname, "../") },
        outputDir: "artifacts",
        steps: [{ createStack, configs: [config] }],
      });
    }
  );
});
