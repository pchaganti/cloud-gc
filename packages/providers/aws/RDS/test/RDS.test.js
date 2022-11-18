const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("RDS", async function () {
  it("DBCluster", () =>
    pipe([
      () => ({
        groupType: "RDS::DBCluster",
        livesNotFound: ({ config }) => [
          { DBClusterIdentifier: "cluster-12345" },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBClusterEndpoint", () =>
    pipe([
      () => ({
        groupType: "RDS::DBClusterEndpoint",
        livesNotFound: ({ config }) => [
          {
            DBClusterIdentifier: "cluster-12345",
            DBClusterEndpointIdentifier: "ce123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBClusterParameterGroup", () =>
    pipe([
      () => ({
        groupType: "RDS::DBClusterParameterGroup",
        livesNotFound: ({ config }) => [
          {
            DBClusterParameterGroupName: "p123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBInstance", () =>
    pipe([
      () => ({
        groupType: "RDS::DBInstance",
        livesNotFound: ({ config }) => [
          { DBInstanceIdentifier: "instance-12345" },
        ],
      }),
      awsResourceTest,
    ])());
  it("DBProxy", () =>
    pipe([
      () => ({
        groupType: "RDS::DBProxy",
        livesNotFound: ({ config }) => [{ DBProxyName: "dbProxy-12345" }],
      }),
      awsResourceTest,
    ])());
  it("DBProxyTargetGroup", () =>
    pipe([
      () => ({
        groupType: "RDS::DBProxyTargetGroup",
        livesNotFound: ({ config }) => [
          { DBProxyName: "proxyName-12345", TargetGroupName: "target" },
        ],
        nameNotFound: "myproxy::myTarget",
      }),
      awsResourceTest,
    ])());
  it("DBSubnetGroup", () =>
    pipe([
      () => ({
        groupType: "RDS::DBSubnetGroup",
        livesNotFound: ({ config }) => [{ DBSubnetGroupName: "a12344" }],
      }),
      awsResourceTest,
    ])());
  it("EventSubscription", () =>
    pipe([
      () => ({
        groupType: "RDS::EventSubscription",
        livesNotFound: ({ config }) => [{ SubscriptionName: "s123" }],
      }),
      awsResourceTest,
    ])());
});