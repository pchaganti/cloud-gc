const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeDeploy", async function () {
  it("Application", () =>
    pipe([
      () => ({
        groupType: "CodeDeploy::Application",
        livesNotFound: ({ config }) => [{ applicationName: "my-project" }],
      }),
      awsResourceTest,
    ])());
  it("DeploymentConfig", () =>
    pipe([
      () => ({
        groupType: "CodeDeploy::DeploymentConfig",
        livesNotFound: ({ config }) => [{ deploymentConfigName: "aaaa" }],
      }),
      awsResourceTest,
    ])());
  it("DeploymentGroup", () =>
    pipe([
      () => ({
        groupType: "CodeDeploy::DeploymentGroup",
        livesNotFound: ({ config }) => [
          { applicationName: "my-app", deploymentGroupName: "aaaa" },
        ],
      }),
      awsResourceTest,
    ])());
});
