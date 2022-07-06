const assert = require("assert");
const { pipe, tap, get, omit, pick, map } = require("rubico");
const { defaultsDeep, callProp, last } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
} = require("./Route53RecoveryReadinessCommon");

const ResourceSetDependencies = {
  apiGatewayStage: { type: "Stage", group: "APIGateway" },
  apiGatewayV2Stage: { type: "Stage", group: "ApiGatewayV2" },
  autoScalingGroup: { type: "AutoScalingGroup", group: "AutoScaling" },
  //TODO
  //cloudWatchAlarm: { type: "Alarm", group: "CloudWatch" },
  customerGateway: { type: "CustomerGateway", group: "EC2" },
  dynamoDBTable: { type: "Table", group: "DynamoDB" },
  ec2Volume: { type: "Volume", group: "EC2" },
  elbV2LoadBalancer: { type: "LoadBalancer", group: "ELBv2" },
  lambdaFunction: { type: "Function", group: "Lambda" },
  //TODO
  //mskCluster: { type: "Cluster", group: "MSK" },
  rdsDBCluster: { type: "DBCluster", group: "RDS" },
  //TODO
  route53HealthCheck: { type: "HealthCheck", group: "Route53" },
  sqsQueue: { type: "Queue", group: "SQS" },
  snsTopic: { type: "Topic", group: "SNS" },
  snsSubscription: { type: "Subscription", group: "SNS" },
  vpc: { type: "Vpc", group: "EC2" },
  vpnConnection: { type: "VpnConnection", group: "EC2" },
  vpnGateway: { type: "VpnGateway", group: "EC2" },
  //TODO
  route53RecoveryReadinessDNSTargetResource: {
    type: "DNSTargetResource",
    group: "Route53RecoveryReadiness",
  },
};

exports.ResourceSetDependencies = ResourceSetDependencies;

const pickId = pipe([
  pick(["ResourceSetName"]),
  tap(({ ResourceSetName }) => {
    assert(ResourceSetName);
  }),
]);

const model = ({ config }) => ({
  package: "route53-recovery-readiness",
  client: "Route53RecoveryReadiness",
  region: "us-west-2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#getResourceSet-property
  getById: {
    method: "getResourceSet",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#listResourceSets-property
  getList: {
    method: "listResourceSets",
    getParam: "ResourceSets",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#createResourceSet-property
  create: {
    method: "createResourceSet",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#updateResourceSet-property
  update: {
    method: "updateResourceSet",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#deleteResourceSet-property
  destroy: { method: "deleteResourceSet", pickId },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html
exports.Route53RecoveryReadinessResourceSet = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ResourceSetName")]),
    findId: pipe([get("live.ResourceSetArn")]),
    getByName: ({ getList, endpoint, getById }) =>
      pipe([
        ({ name }) => ({ ResourceSetName: name }),
        getById,
        tap((params) => {
          assert(true);
        }),
      ]),
    findDependencies: ({ live, lives }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => live,
        get("Resources"),
        map(({ ResourceArn }) =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            () =>
              lives.getById({
                id: live.ResourceArn,
                type: pipe([
                  () => live.ResourceSetType,
                  callProp("split", "::"),
                  (arr) => arr[1],
                ])(),
                group: pipe([
                  () => live.ResourceSetType,
                  callProp("split", "::"),
                  last,
                ])(),
                config: config.providerName,
              }),
            get("id"),
          ])()
        ),
      ])(),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependecies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          ResourceSetName: name,
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
      ])(),
  });
