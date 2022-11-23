const assert = require("assert");
const { tap, pipe, map, get, assign, not, or, eq } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");

const { compareAws, replaceAccountAndRegion } = require("../AwsCommon");

const GROUP = "Batch";
const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

const { BatchComputeEnvironment } = require("./BatchComputeEnvironment");
const { BatchJobDefinition } = require("./BatchJobDefinition");
const { BatchJobQueue } = require("./BatchJobQueue");
const { BatchSchedulingPolicy } = require("./BatchSchedulingPolicy");

module.exports = pipe([
  () => [
    {
      type: "ComputeEnvironment",
      Client: BatchComputeEnvironment,
      propertiesDefault: {
        state: "ENABLED",
      },
      omitProperties: [
        "status",
        "statusReason",
        "ecsClusterArn",
        "eksConfiguration.eksClusterArn",
        "computeEnvironmentArn",
        "computeResources.ec2KeyPair",
        "computeResources.instanceRole",
        "computeResources.launchTemplate",
        "computeResources.placementGroup",
        "computeResources.securityGroupIds",
        "computeResources.subnets",
        "uuid",
      ],
      inferName: () => get("computeEnvironmentName"),
      dependencies: {
        eksCluster: {
          type: "Cluster",
          group: "EKS",
          dependencyId: ({ lives, config }) =>
            pipe([get("eksConfiguration.eksClusterArn")]),
        },
        keyPair: {
          type: "KeyPair",
          group: "EC2",
          dependencyId: ({ lives, config }) =>
            pipe([get("computeResources.ec2KeyPair")]),
        },
        instanceRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) =>
            pipe([get("computeResources.instanceRole")]),
        },
        launchTemplate: {
          type: "LaunchTemplate",
          group: "EC2",
          dependencyId: ({ lives, config }) =>
            pipe([get("computeResources.launchTemplate.launchTemplateId")]),
        },
        placementGroup: {
          type: "PlacementGroup",
          group: "EC2",
          dependencyId: ({ lives, config }) =>
            pipe([get("computeResources.placementGroup")]),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            get("computeResources.securityGroupIds"),
        },
        serviceRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => pipe([get("serviceRole")]),
        },
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("computeResources.subnets"),
        },
      },
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            serviceRole: pipe([
              get("serviceRole"),
              replaceAccountAndRegion({ providerConfig }),
            ]),
          }),
        ]),
    },
    {
      type: "JobDefinition",
      Client: BatchJobDefinition,
      ignoreResource: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          or([not(get("live.latest")), not(eq(get("live.status"), "ACTIVE"))]),
        ]),
      propertiesDefault: {
        propagateTags: false,
        containerOrchestrationType: "ECS",
        containerProperties: {
          networkConfiguration: {
            assignPublicIp: "DISABLED",
          },
        },
      },
      omitProperties: [
        "status",
        "revision",
        "jobDefinitionArn",
        "containerProperties.executionRoleArn",
        "latest",
      ],
      inferName: () => get("jobDefinitionName"),
      dependencies: {
        roleExecution: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) =>
            pipe([get("containerProperties.executionRoleArn")]),
        },
        jobRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => pipe([get("jobRoleArn")]),
        },
      },
    },
    {
      type: "JobQueue",
      Client: BatchJobQueue,
      propertiesDefault: {
        state: "ENABLED",
      },
      omitProperties: [
        "status",
        "statusReason",
        "jobQueueArn",
        "schedulingPolicyArn",
      ],
      inferName: () => get("jobQueueName"),
      dependencies: {
        computeEnvironments: {
          type: "ComputeEnvironment",
          group: GROUP,
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("computeEnvironmentOrder"), pluck("computeEnvironment")]),
        },
        schedulingPolicy: {
          type: "SchedulingPolicy",
          group: GROUP,
          dependencyId: ({ lives, config }) =>
            pipe([get("schedulingPolicyArn")]),
        },
      },
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            computeEnvironmentOrder: pipe([
              get("computeEnvironmentOrder"),
              map(
                assign({
                  computeEnvironment: pipe([
                    get("computeEnvironment"),
                    replaceWithName({
                      groupType: "Batch::ComputeEnvironment",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                })
              ),
            ]),
          }),
        ]),
    },
    {
      type: "SchedulingPolicy",
      Client: BatchSchedulingPolicy,
      omitProperties: ["arn"],
      inferName: () => get("name"),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
