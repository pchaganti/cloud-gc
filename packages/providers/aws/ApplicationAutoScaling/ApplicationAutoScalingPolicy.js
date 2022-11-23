const assert = require("assert");
const { pipe, tap, get, flatMap, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const pickId = pipe([
  pick(["PolicyName", "ResourceId", "ScalableDimension", "ServiceNamespace"]),
  tap(({ PolicyName, ResourceId, ScalableDimension, ServiceNamespace }) => {
    assert(PolicyName);
    assert(ServiceNamespace);
    assert(ResourceId);
    assert(ScalableDimension);
  }),
]);

const model = ({ config }) => ({
  package: "application-auto-scaling",
  client: "ApplicationAutoScaling",
  ignoreErrorCodes: ["ObjectNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#describeScalingPolicies-property
  getById: {
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      ({ ServiceNamespace, ScalableDimension, ResourceId, PolicyName }) => ({
        ServiceNamespace,
        ScalableDimension,
        ResourceId,
        PolicyNames: [PolicyName],
      }),
    ]),
    method: "describeScalingPolicies",
    getField: "ScalingPolicies",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#putScalingPolicy-property
  create: {
    method: "putScalingPolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  update: {
    method: "putScalingPolicy",
    filterParams: ({ payload }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#deleteScalingPolicy-property
  destroy: {
    method: "deleteScalingPolicy",
    pickId,
  },
});

exports.ApplicationAutoScalingPolicy = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () =>
      pipe([
        ({ ResourceId, ScalableDimension, PolicyName }) =>
          `${ResourceId}::${ScalableDimension}::${PolicyName}`,
      ]),
    findId: () => pipe([get("PolicyARN")]),
    getByName: getByNameCore,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationAutoScaling.html#describeScalingPolicies-property
    getList: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        //TODO
        () => [
          "appstream",
          "dynamodb",
          "ecs",
          "ec2",
          "elasticache",
          "elasticmapreduce",
          "kafka",
          "lambda",
          "neptune",
          "rds",
          //"sagemaker",
          //"custom-resource",
          //"comprehend",
          //"cassandra",
        ],
        flatMap(
          pipe([
            (ServiceNamespace) => ({ ServiceNamespace }),
            endpoint().describeScalingPolicies,
            get("ScalingPolicies"),
          ])
        ),
      ]),
    // TODO Tag
    configDefault: ({
      name,
      namespace,
      properties: { tags, ...otherProps },
      dependencies: {},
    }) => pipe([() => otherProps, defaultsDeep({})])(),
  });
