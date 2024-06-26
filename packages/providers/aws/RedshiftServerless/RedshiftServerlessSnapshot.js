const assert = require("assert");
const { pipe, tap, get, pick, eq, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { assignTags } = require("./RedshiftServerlessCommon");

const pickId = pipe([
  tap(({ snapshotName }) => {
    assert(snapshotName);
  }),
  pick(["snapshotName"]),
]);

const buildArn = () =>
  pipe([
    get("snapshotArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ endpoint, buildArn }),
    ({ snapshotRetentionPeriod, ...other }) => ({
      ...other,
      retentionPeriod: snapshotRetentionPeriod,
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html
exports.RedshiftServerlessSnapshot = () => ({
  type: "Snapshot",
  package: "redshift-serverless",
  client: "RedshiftServerless",
  propertiesDefault: {},
  omitProperties: [
    "actualIncrementalBackupSizeInMegaBytes",
    "adminUsername",
    "backupProgressInMegaBytes",
    "currentBackupRateInMegaBytesPerSecond",
    "elapsedTimeInSeconds",
    "kmsKeyId",
    "namespaceArn",
    "namespaceName",
    "ownerAccount",
    "snapshotArn",
    "snapshotRemainingDays",
    "snapshotRetentionStartTime",
    "snapshotCreateTime",
    "status",
    "totalBackupSizeInMegaBytes",
    "estimatedSecondsToCompletion",
  ],
  inferName: () =>
    pipe([
      get("snapshotName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("snapshotName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("snapshotArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    namespace: {
      type: "Namespace",
      group: "RedshiftServerless",
      dependencyId: ({ lives, config }) => pipe([get("namespaceName")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) => pipe([get("kmsKeyId")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#getSnapshot-property
  getById: {
    method: "getSnapshot",
    getField: "snapshot",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#listSnapshots-property
  getList: {
    method: "listSnapshots",
    getParam: "snapshots",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#createSnapshot-property
  create: {
    method: "createSnapshot",
    pickCreated: ({ payload }) => pipe([get("snapshot")]),
    isInstanceUp: pipe([eq(get("status"), "AVAILABLE")]),
    shouldRetryOnExceptionMessages: [
      "Cannot create a snapshot because database is not in available status, try again later",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#updateSnapshot-property
  update: {
    method: "updateSnapshot",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#deleteSnapshot-property
  destroy: {
    method: "deleteSnapshot",
    pickId,
    shouldRetryOnExceptionMessages: ["Cannot delete the snapshot"],
    configIsDown: { retryCount: 90 * 12, retryDelay: 5e3 },
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ snapshotName: name }), getById({})]),
  configDefault: ({
    name,
    properties: { ...otherProps },
    dependencies: { namespace, kmsKey },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(namespace);
      }),
      () => otherProps,
      defaultsDeep({
        namespaceName: getField(namespace, "namespaceName"),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          kmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
