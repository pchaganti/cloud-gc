const path = require("path");
const assert = require("assert");
const chance = require("chance")();
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");
const cliCommands = require("../../../cli/cliCommands");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("GcpBucket", async function () {
  const types = ["Bucket", "Object"];
  const bucketName = `mybucket-test-${chance.guid()}`;
  const bucketNamePublic = `grucloud-test-bucket`;
  const objectName = `mypath/myfile`;
  let config;
  let provider;
  let bucket;
  let bucketPublic;

  let file;
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = GoogleProvider({
      config: config.google,
    });

    bucket = await provider.makeBucket({
      name: bucketName,
      properties: () => ({}),
    });

    bucketPublic = await provider.makeBucket({
      name: bucketNamePublic,
      properties: () => ({
        iamConfiguration: {
          uniformBucketLevelAccess: {
            enabled: true,
          },
        },
        iam: {
          bindings: [
            {
              role: "roles/storage.objectViewer",
              members: ["allUsers"],
            },
          ],
        },
        website: { mainPageSuffix: "index.html", notFoundPage: "404.html" },
      }),
    });
    file = await provider.makeObject({
      name: objectName,
      dependencies: { bucket: bucket },
      properties: () => ({
        path: "/",
        source: path.join(
          process.cwd(),
          "examples/aws/s3/fixtures/testFile.txt"
        ),
      }),
    });
  });
  after(async () => {});
  it("bucket config", async function () {
    const config = await bucket.resolveConfig();
    assert(config);
    assert.equal(config.name, bucketName);
  });
  it("gcp bucket apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    const bucketLive = await bucket.getLive();

    const bucketPublicLive = await bucketPublic.getLive({ deep: true });
    assert(bucketPublicLive.iam);
    assert(bucketPublicLive.iamConfiguration);
    assert(bucketPublicLive.website);

    {
      const provider = GoogleProvider({
        config: config.google,
      });

      const bucket = await provider.makeBucket({
        name: bucketName,
        properties: () => ({}),
      });

      const file = await provider.makeObject({
        name: objectName,
        dependencies: { bucket: bucket },
        properties: () => ({
          path: "/",
          source: path.join(
            process.cwd(),
            "examples/aws/s3/fixtures/testFile2.txt"
          ),
        }),
      });
      {
        const { error, resultQuery } = await cliCommands.planQuery({
          infra: { provider },
          commandOptions: { force: true },
        });
        assert(!error);
        const plan = resultQuery.results[0];
        assert.equal(plan.resultCreate.length, 1);
        assert.equal(plan.resultCreate[0].action, "UPDATE");
      }

      const resultApply = await cliCommands.planApply({
        infra: { provider },
        commandOptions: { force: true },
      });
      assert(!resultApply.error);
    }
    await testPlanDestroy({ provider, types });
  });
});
