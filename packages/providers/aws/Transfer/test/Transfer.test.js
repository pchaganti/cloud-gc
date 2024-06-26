const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Transfer", async function () {
  it("Access", () =>
    pipe([
      () => ({
        groupType: "Transfer::Access",
        livesNotFound: ({ config }) => [
          {
            ServerId: "s-dc21f45ec5764e801",
            ExternalId: "S-1-1-12-1234567890-123456789-1234567890-1234",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Server", () =>
    pipe([
      () => ({
        groupType: "Transfer::Server",
        livesNotFound: ({ config }) => [{ ServerId: "s-dc21f45ec5764e801" }],
      }),
      awsResourceTest,
    ])());
  it("User", () =>
    pipe([
      () => ({
        groupType: "Transfer::User",
        livesNotFound: ({ config }) => [
          { ServerId: "s-dc21f45ec5764e801", UserName: "123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Workflow", () =>
    pipe([
      () => ({
        groupType: "Transfer::Workflow",
        livesNotFound: ({ config }) => [{ WorkflowId: "w-01234567891234567" }],
      }),
      awsResourceTest,
    ])());
});
