// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "ApiKey",
    group: "APIGateway",
    properties: ({}) => ({
      name: "sam-ap-ApiKe-kc7iRALKZlqd",
    }),
  },
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      description: "API key REST API demo",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      name: "apigw-api-key",
      schema: {
        openapi: "3.0.1",
        info: {
          description: "API key REST API demo",
          title: "apigw-api-key",
          version: "1",
        },
        paths: {
          "/": {
            get: {
              "x-amazon-apigateway-integration": {
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_MATCH",
                type: "AWS_PROXY",
                uri: `arn:aws:apigateway:${
                  config.region
                }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:sam-app-AppFunction-zawrcFMGZvlZ/invocations`,
              },
            },
          },
        },
        components: {
          schemas: {
            Empty: {
              title: "Empty Schema",
              type: "object",
            },
            Error: {
              title: "Error Schema",
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      deployment: {
        stageName: "Prod",
      },
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "Prod",
    }),
    dependencies: ({}) => ({
      restApi: "apigw-api-key",
    }),
  },
  {
    type: "UsagePlan",
    group: "APIGateway",
    properties: ({ getId }) => ({
      apiStages: [
        {
          apiId: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "apigw-api-key",
          })}`,
          stage: "Prod",
        },
      ],
      name: "sam-ap-Usage-3jS44lYqFsit",
    }),
    dependencies: ({}) => ({
      stages: ["apigw-api-key::Prod"],
    }),
  },
  {
    type: "UsagePlanKey",
    group: "APIGateway",
    properties: ({}) => ({
      name: "sam-ap-ApiKe-kc7iRALKZlqd",
    }),
    dependencies: ({}) => ({
      usagePlan: "sam-ap-Usage-3jS44lYqFsit",
      apiKey: "sam-ap-ApiKe-kc7iRALKZlqd",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-AppFunctionRole-E6MNAT8N8A3G",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
          },
        ],
        Version: "2012-10-17",
      },
      AttachedPolicies: [
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
          PolicyName: "AWSLambdaBasicExecutionRole",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "sam-app-AppFunction-zawrcFMGZvlZ",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-AppFunctionRole-E6MNAT8N8A3G",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-AppFunction-zawrcFMGZvlZ",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "apigw-api-key",
            path: "live.arnv2",
          })}/*/GET/`,
          StatementId: "sam-app-AppFunctionPermission-1V6SLULIFQ42I",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-AppFunction-zawrcFMGZvlZ",
      apiGatewayRestApis: ["apigw-api-key"],
    }),
  },
];
