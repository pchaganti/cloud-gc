// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      description: "Resource Policy REST API demo",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      name: "sam-app",
      schema: {
        openapi: "3.0.1",
        info: {
          description: "Resource Policy REST API demo",
          title: "sam-app",
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
                }:${config.accountId()}:function:sam-app-AppFunction-x2DoUhn0V0QZ/invocations`,
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
    type: "RestApiPolicy",
    group: "APIGateway",
    properties: ({ getId }) => ({
      policy: {
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Principal: "*",
            Resource: `${getId({
              type: "RestApi",
              group: "APIGateway",
              name: "sam-app",
              path: "live.arnv2",
            })}/Prod/GET/`,
          },
          {
            Action: "execute-api:Invoke",
            Condition: {
              IpAddress: {
                "aws:SourceIp": ["10.20.30.40", "1.0.0.0/16"],
              },
            },
            Effect: "Deny",
            Principal: "*",
            Resource: `${getId({
              type: "RestApi",
              group: "APIGateway",
              name: "sam-app",
              path: "live.arnv2",
            })}/Prod/GET/`,
          },
        ],
        Version: "2012-10-17",
      },
    }),
    dependencies: ({}) => ({
      restApi: "sam-app",
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
      RoleName: "sam-app-AppFunctionRole-E6391TA1JUHZ",
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
        FunctionName: "sam-app-AppFunction-x2DoUhn0V0QZ",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-AppFunctionRole-E6391TA1JUHZ",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-AppFunction-x2DoUhn0V0QZ",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "sam-app",
            path: "live.arnv2",
          })}/*/GET/`,
          StatementId:
            "sam-app-AppFunctionApiEventPermissionProd-12TQQGF5JXRK2",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-AppFunction-x2DoUhn0V0QZ",
      apiGatewayRestApis: ["sam-app"],
    }),
  },
];
