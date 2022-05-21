const assert = require("assert");
const path = require("path");
const fs = require("fs").promises;

const { pipe, tap, get, eq, map, tryCatch } = require("rubico");
const { find } = require("rubico/x");

const { SpecGroupDirs } = require("../../AzureSpecDirs");

const specDir = "node_modules/azure-rest-api-specs/specification/";
const {
  processSwaggerFiles,
  processSwagger,
  buildDependenciesFromBody,

  buildPickProperties,
} = require("../AzureRestApi");
const SwaggerParser = require("@apidevtools/swagger-parser");

describe("AzureRestApi", function () {
  before(async function () {});

  it("processSwagger compute", async function () {
    await pipe([
      () => ({
        name: "compute.json",
      }),
      processSwagger({
        dir: path.resolve(
          process.cwd(),
          specDir,
          "compute/resource-manager/Microsoft.Compute/stable/2021-07-01"
        ),
        group: "Microsoft.Compute",
        groupDir: "compute",
        apiVersion: "2021-07-01",
      }),
      tap((params) => {
        assert(true);
      }),
    ])();
  });
  it("buildDependenciesFromBody virtualMachines", async function () {
    await pipe([
      () =>
        path.resolve(
          process.cwd(),
          specDir,
          "compute/resource-manager/Microsoft.Compute/stable/2021-07-01",
          "compute.json"
        ),
      (filename) => SwaggerParser.dereference(filename, {}),
      get("paths"),
      get([
        "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}",
      ]),
      get("put.parameters"),
      find(eq(get("in"), "body")),
      get("schema.properties"),
      buildDependenciesFromBody({}),
      tap((params) => {
        assert(true);
      }),
    ])();
  });

  it("processSwagger webapp", async function () {
    await pipe([
      () => ({
        name: "WebApps.json",
      }),
      processSwagger({
        dir: path.resolve(
          process.cwd(),
          specDir,
          "web/resource-manager/Microsoft.Web/stable/2021-02-01"
        ),
        group: "Microsoft.Web",
        groupDir: "web",
        apiVersion: "2021-02-01",
      }),
      tap((params) => {
        assert(true);
      }),
    ])();
  });
  it("processSwagger cosmos", async function () {
    await pipe([
      () => ({
        name: "cosmos-db.json",
      }),
      processSwagger({
        dir: path.resolve(
          process.cwd(),
          specDir,
          "cosmos-db/resource-manager/Microsoft.DocumentDB/preview/2022-02-15-preview"
        ),
        group: "Microsoft.DocumentDB",
        groupDir: "cosmos-db ",
        apiVersion: "2022-02-15-preview",
      }),
      tap((params) => {
        assert(true);
      }),
      get("resources"),
      find(eq(get("type"), "DatabaseAccount")),
      tap((resource) => {
        assert(resource);
      }),
      get("methods.put.parameters"),
      find(eq(get("in"), "body")),
      get("schema"),
      tap((schema) => {
        assert(schema);
      }),
      // tap((schema) =>
      //   pipe([
      //     () => JSON.stringify(schema, null, 4),
      //     (schemaString) =>
      //       fs.writeFile(
      //         path.resolve(
      //           __dirname,
      //           "fixtures",
      //           "DatabaseAccountPutSchema.json"
      //         ),
      //         schemaString
      //       ),
      //   ])()
      // ),
      tap((params) => {
        assert(true);
      }),
      get("properties.properties.properties"),
      buildPickProperties({}),
      tap((params) => {
        assert(true);
      }),
    ])();
  });

  it.only("processSwaggerFiles", async function () {
    await pipe([
      () => SpecGroupDirs,
      map.series((group) =>
        tryCatch(
          pipe([
            tap((params) => {
              console.log(`reading group: ${group}`);
            }),
            () => ({
              directorySpec: path.resolve(process.cwd(), specDir),
              directoryDoc: path.resolve(
                process.cwd(),
                "../../../../docusaurus/docs/azure/resources/"
              ),
              outputSchemaFile: path.resolve(
                process.cwd(),
                "../",
                "schema",
                `AzureSchema-${group}.json`
              ),
              filterDirs: [group],
            }),
            processSwaggerFiles,
          ]),
          (error) => {
            assert(false, `error generating ${group}`);
          }
        )()
      ),
      tap((params) => {
        assert(true);
      }),
    ])();
  });
});
