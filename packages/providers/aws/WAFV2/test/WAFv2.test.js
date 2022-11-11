const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("WAFv2", async function () {
  it("WebACL", () =>
    pipe([
      () => ({
        groupType: "WAFv2::WebACL",
        livesNotFound: ({ config }) => [
          {
            Id: "6041b115-b84b-47db-b0ca-47039e3b5279",
            LockToken: "57768011-a86a-4f07-b145-5767ec55d963",
            Name: "sss",
            Scope: "REGIONAL",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("WebACLCloudFront", () =>
    pipe([
      () => ({
        groupType: "WAFv2::WebACLCloudFront",
        livesNotFound: ({ config }) => [
          {
            Id: "6041b115-b84b-47db-b0ca-47039e3b5279",
            LockToken: "57768011-a86a-4f07-b145-5767ec55d963",
            Name: "sss",
            Scope: "CLOUDFRONT",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("WebACLAssociation", () =>
    pipe([
      () => ({
        groupType: "WAFv2::WebACLAssociation",
        livesNotFound: ({ config }) => [
          {
            ResourceArn: `arn:aws:apigateway:us-east-1::/restapis/j9zcm72xm6/stages/dev`,
          },
        ],
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
});
