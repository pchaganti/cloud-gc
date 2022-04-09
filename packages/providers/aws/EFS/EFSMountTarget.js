const assert = require("assert");
const { pipe, tap, get, assign, pick, map, eq } = require("rubico");
const { defaultsDeep, when, prepend, append, last } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EFSCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const model = {
  package: "efs",
  client: "EFS",
  ignoreErrorCodes: ["MountTargetNotFound"],
  getById: { method: "describeMountTargets", getField: "MountTargets" },
  create: { method: "createMountTarget" },
  update: { method: "updateMountTarget" },
  destroy: { method: "deleteMountTarget" },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html
exports.EFSMountTarget = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: ({ live, lives }) =>
      pipe([
        tap(() => {
          assert(live.FileSystemId);
        }),
        () =>
          lives.getById({
            id: live.FileSystemId,
            type: "FileSystem",
            group: "EFS",
            providerName: config.providerName,
          }),
        get("name"),
        prepend("mount-target::"),
        append("::"),
        append(pipe([() => live.AvailabilityZoneName, last])()),
      ])(),
    pickId: pipe([
      tap(({ MountTargetId }) => {
        assert(MountTargetId);
      }),
      pick(["MountTargetId"]),
    ]),
    findId: pipe([get("live.MountTargetId")]),
    isInstanceUp: eq(get("LifeCycleState"), "available"),
    findDependencies: ({ live }) => [
      { type: "FileSystem", group: "EFS", ids: [live.FileSystemId] },
      { type: "Subnet", group: "EC2", ids: [live.SubnetId] },
      { type: "SecurityGroup", group: "EC2", ids: live.SecurityGroups },
    ],
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        tap((params) => {
          assert(client);
          assert(endpoint);
          assert(getById);
          assert(config);
        }),
        () =>
          client.getListWithParent({
            parent: { type: "FileSystem", group: "EFS" },
            pickKey: pipe([
              tap(({ FileSystemId }) => {
                assert(FileSystemId);
              }),
              pick(["FileSystemId"]),
            ]),
            method: "describeMountTargets",
            getParam: "MountTargets",
            decorate: ({ lives, parent }) =>
              pipe([
                assign({
                  SecurityGroups: pipe([
                    pick(["MountTargetId"]),
                    endpoint().describeMountTargetSecurityGroups,
                    get("SecurityGroups"),
                  ]),
                }),
              ]),
            config,
          }),
        tap((params) => {
          assert(true);
        }),
      ])(),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { fileSystem, subnet, securityGroups },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          FileSystemId: getField(fileSystem, "FileSystemId"),
          SubnetId: getField(subnet, "SubnetId"),
        }),
        when(
          () => securityGroups,
          defaultsDeep({
            SecurityGroups: pipe([
              () => securityGroups,
              map((securityGroup) => getField(securityGroup, "GroupId")),
            ])(),
          })
        ),
      ])(),
    //updateFilterParams: ({ payload }) => pipe([() => payload]),
  });
