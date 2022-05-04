// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    name: "API Gateway HTTP API to EventBridge",
    properties: ({}) => ({
      Tags: {
        "httpapi:createdBy": "SAM",
      },
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    name: "$default",
    properties: ({}) => ({
      AutoDeploy: true,
      Tags: {
        "httpapi:createdBy": "SAM",
      },
    }),
    dependencies: ({}) => ({
      api: "API Gateway HTTP API to EventBridge",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      IntegrationSubtype: "EventBridge-PutEvents",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "1.0",
      RequestParameters: {
        DetailType: "MyDetailType",
        Detail: "$request.body.Detail",
        Source: "WebApp",
      },
    }),
    dependencies: ({}) => ({
      api: "API Gateway HTTP API to EventBridge",
      role: "sam-app-MyHttpApiRole-KV1DOMSBSRDO",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RequestParameters: {},
      RouteKey: "POST /",
    }),
    dependencies: ({}) => ({
      api: "API Gateway HTTP API to EventBridge",
      integration:
        "integration::API Gateway HTTP API to EventBridge::NO-INTEGRATION",
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Description:
        "Automatic deployment triggered by changes to the Api configuration",
      AutoDeployed: true,
    }),
    dependencies: ({}) => ({
      api: "API Gateway HTTP API to EventBridge",
      stage: "$default",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    name: "sam-app-MyTriggeredLambdaEventBridgeTrigger-1CZB0M0XR00UH",
    properties: ({}) => ({
      EventPattern: {
        source: ["WebApp"],
      },
      State: "ENABLED",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "MyTriggeredLambdaEventBridgeTriggerLambdaTarget",
    }),
    dependencies: ({}) => ({
      rule: "sam-app-MyTriggeredLambdaEventBridgeTrigger-1CZB0M0XR00UH",
      lambdaFunction: "sam-app-MyTriggeredLambda-QtqMTZc89naA",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "sam-app-MyHttpApiRole-KV1DOMSBSRDO",
    properties: ({ getId }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `apigateway.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: {
              Action: ["events:PutEvents"],
              Resource: [
                `${getId({
                  type: "EventBus",
                  group: "CloudWatchEvents",
                  name: "default",
                })}`,
              ],
              Effect: "Allow",
            },
          },
          PolicyName: "ApiDirectWriteEventBridge",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "sam-app-MyTriggeredLambdaRole-PFCAXLPPKQG8",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `lambda.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
      Tags: [
        {
          Key: "lambda:createdBy",
          Value: "SAM",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "sam-app-MyTriggeredLambda-QtqMTZc89naA",
    properties: ({}) => ({
      Configuration: {
        Handler: "app.lambdaHandler",
        Runtime: "nodejs14.x",
      },
      Tags: {
        "lambda:createdBy": "SAM",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-MyTriggeredLambdaRole-PFCAXLPPKQG8",
    }),
  },
];
