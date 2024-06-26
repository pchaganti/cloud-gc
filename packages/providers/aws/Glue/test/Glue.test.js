const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Glue", async function () {
  it("Database", () =>
    pipe([
      () => ({
        groupType: "Glue::Database",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Classifier", () =>
    pipe([
      () => ({
        groupType: "Glue::Classifier",
        livesNotFound: ({ config }) => [
          {
            JsonClassifier: { Name: "a-12345" },
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Connection", () =>
    pipe([
      () => ({
        groupType: "Glue::Connection",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Crawler", () =>
    pipe([
      () => ({
        groupType: "Glue::Crawler",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DevEndpoint", () =>
    pipe([
      () => ({
        groupType: "Glue::Crawler",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Job", () =>
    pipe([
      () => ({
        groupType: "Glue::Job",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("MLTransform", () =>
    pipe([
      () => ({
        groupType: "Glue::MLTransform",
        livesNotFound: ({ config }) => [{ TransformId: "t12345" }],
      }),
      awsResourceTest,
    ])());
  it("Partition", () =>
    pipe([
      () => ({
        groupType: "Glue::Partition",
        livesNotFound: ({ config }) => [
          {
            DatabaseName: "a123",
            PartitionValues: ["p123"],
            TableName: "t123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Registry", () =>
    pipe([
      () => ({
        groupType: "Glue::Registry",
        livesNotFound: ({ config }) => [
          {
            RegistryArn: `arn:${config.partition}:glue:${
              config.region
            }:${config.accountId()}:registry/r123`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ResourcePolicy", () =>
    pipe([
      () => ({
        groupType: "Glue::ResourcePolicy",
        livesNotFound: ({ config }) => [{ PolicyHash: "123456789" }],
      }),
      awsResourceTest,
    ])());
  it("Schema", () =>
    pipe([
      () => ({
        groupType: "Glue::Schema",
        livesNotFound: ({ config }) => [
          {
            RegistryName: `r123`,
            SchemaName: `r123`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("SecurityConfiguration", () =>
    pipe([
      () => ({
        groupType: "Glue::SecurityConfiguration",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Table", () =>
    pipe([
      () => ({
        groupType: "Glue::Table",
        livesNotFound: ({ config }) => [
          {
            DatabaseName: "d-12345",
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Trigger", () =>
    pipe([
      () => ({
        groupType: "Glue::Trigger",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("UserDefinedFunction", () =>
    pipe([
      () => ({
        groupType: "Glue::UserDefinedFunction",
        livesNotFound: ({ config }) => [
          {
            DatabaseName: "d123",
            FunctionName: "f123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Workflow", () =>
    pipe([
      () => ({
        groupType: "Glue::Workflow",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
