const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("EKS", async function () {
  it.skip("Addon", () =>
    pipe([
      () => ({
        groupType: "EKS::Addon",
        livesNotFound: ({ config }) => [
          {
            addonName: "12345",
            clusterName: "c123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Cluster", () =>
    pipe([
      () => ({
        groupType: "EKS::Cluster",
        livesNotFound: ({ config }) => [
          {
            name: "12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("NodeGroup", () =>
    pipe([
      () => ({
        groupType: "EKS::NodeGroup",
        livesNotFound: ({ config }) => [
          {
            clusterName: "mycluster",
            nodegroupName: "12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
});