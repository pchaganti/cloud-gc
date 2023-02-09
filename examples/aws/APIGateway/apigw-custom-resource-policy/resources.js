// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      name: "sam-app",
      policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: "execute-api:Invoke",
            Resource: `arn:aws:execute-api:${
              config.region
            }:${config.accountId()}:r4eavsgkmb/Prod/*/*`,
            Condition: {
              DateGreaterThan: {
                "aws:CurrentTime": "2022-09-01T00:00:00Z",
              },
              DateLessThan: {
                "aws:CurrentTime": "2022-09-30T23:59:59Z",
              },
            },
          },
        ],
      },
      schema: {
        openapi: "3.0.1",
        info: {
          title: "sam-app",
          version: "1",
        },
        paths: {
          "/": {
            get: {
              responses: {},
              "x-amazon-apigateway-integration": {
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_MATCH",
                type: "AWS_PROXY",
                uri: `arn:aws:apigateway:${
                  config.region
                }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:sam-app-HelloWorldFunction-lw4XCITD06t5/invocations`,
              },
            },
          },
        },
        components: {
          schemas: {},
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
      restApi: "sam-app",
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "Stage",
    }),
    dependencies: ({}) => ({
      restApi: "sam-app",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-HelloWorldFunctionRole-1UXSAQ9500WJX",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
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
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Architectures: ["arm64"],
        FunctionName: "sam-app-HelloWorldFunction-lw4XCITD06t5",
        Handler: "app.lambda_handler",
        Runtime: "python3.9",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-HelloWorldFunctionRole-1UXSAQ9500WJX",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-HelloWorldFunction-lw4XCITD06t5",
          Principal: "apigateway.amazonaws.com",
          StatementId:
            "sam-app-HelloWorldFunctionHelloWorldPermissionProd-1GPIFHZBBXBH1",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "sam-app",
            path: "live.arnv2",
          })}/*/GET/`,
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-HelloWorldFunction-lw4XCITD06t5",
      apiGatewayRestApis: ["sam-app"],
    }),
  },
];
