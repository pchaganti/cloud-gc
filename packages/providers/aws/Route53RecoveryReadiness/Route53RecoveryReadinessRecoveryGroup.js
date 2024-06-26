const assert = require("assert");
const { pipe, tap, get, omit, pick, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger } = require("./Route53RecoveryReadinessCommon");

const pickId = pipe([
  pick(["RecoveryGroupName"]),
  tap(({ RecoveryGroupName }) => {
    assert(RecoveryGroupName);
  }),
]);

const buildArn = () =>
  pipe([
    get("RecoveryGroupArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html
exports.Route53RecoveryReadinessRecoveryGroup = ({ spec, config }) => ({
  type: "RecoveryGroup",
  package: "route53-recovery-readiness",
  client: "Route53RecoveryReadiness",
  region: "us-west-2",
  inferName: () => get("RecoveryGroupName"),
  findName: () => pipe([get("RecoveryGroupName")]),
  findId: () => pipe([get("RecoveryGroupArn")]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    cells: {
      type: "Cell",
      group: "Route53RecoveryReadiness",
      list: true,
      dependencyIds: ({ lives, config }) => get("Cells"),
    },
  },
  omitProperties: ["RecoveryGroupArn", "Cells"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#getRecoveryGroup-property
  getById: {
    method: "getRecoveryGroup",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#listRecoveryGroups-property
  getList: {
    method: "listRecoveryGroups",
    getParam: "RecoveryGroups",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#createRecoveryGroup-property
  create: {
    method: "createRecoveryGroup",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#updateRecoveryGroup-property
  update: {
    method: "updateRecoveryGroup",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#deleteRecoveryGroup-property
  destroy: { method: "deleteRecoveryGroup", pickId },
  getByName: ({ getList, endpoint, getById }) =>
    pipe([({ name }) => ({ RecoveryGroupName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { cells },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        Cells: pipe([() => cells, map((cell) => getField(cell, "CellArn"))])(),
      }),
    ])(),
});
