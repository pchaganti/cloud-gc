const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("StepFunctions", async function () {
  it.skip("Activity", () =>
    pipe([
      () => ({
        groupType: "StepFunctions::Activity",
        livesNotFound: ({ config }) => [
          {
            // stateMachineArn: `arn:aws:states:${
            //   config.region
            // }:${config.accountId()}:stateMachine:test-test`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("StateMachine", () =>
    pipe([
      () => ({
        groupType: "StepFunctions::StateMachine",
        livesNotFound: ({ config }) => [
          {
            stateMachineArn: `arn:aws:states:${
              config.region
            }:${config.accountId()}:stateMachine:test-test`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
