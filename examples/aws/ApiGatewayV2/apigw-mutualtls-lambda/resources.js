// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    properties: ({}) => ({
      DomainName: "grucloud.org",
      SubjectAlternativeNames: ["grucloud.org", "*.grucloud.org"],
    }),
  },
  {
    type: "Api",
    group: "ApiGatewayV2",
    properties: ({ config }) => ({
      CorsConfiguration: {
        AllowMethods: ["GET", "HEAD", "OPTIONS", "POST"],
        AllowOrigins: ["*"],
      },
      Description:
        "An Amazon API Gateway HTTP API with mutual TLS and an AWS Lambda function.",
      DisableExecuteApiEndpoint: true,
      Name: "apigw-mutualtls-lambda",
      Target: `arn:aws:apigateway:${
        config.region
      }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
        config.region
      }:${config.accountId()}:function:apigw-mutualtls-lambda-function/invocations`,
    }),
  },
  {
    type: "ApiMapping",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ApiMappingKey: "",
    }),
    dependencies: ({}) => ({
      domainName: "grucloud.org",
      stage: "apigw-mutualtls-lambda::$default",
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
      api: "apigw-mutualtls-lambda",
      stage: "apigw-mutualtls-lambda::$default",
    }),
  },
  {
    type: "DomainName",
    group: "ApiGatewayV2",
    properties: ({ getId }) => ({
      DomainName: "grucloud.org",
      DomainNameConfigurations: [
        {
          CertificateArn: `${getId({
            type: "Certificate",
            group: "ACM",
            name: "grucloud.org",
          })}`,
        },
      ],
    }),
    dependencies: ({}) => ({
      certificates: ["grucloud.org"],
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    name: "apigw-mutualtls-lambda::$default",
    readOnly: true,
    properties: ({}) => ({
      AutoDeploy: true,
      StageName: "$default",
    }),
    dependencies: ({}) => ({
      api: "apigw-mutualtls-lambda",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-LambdaFunctionRole-1DN25A5IY6VDT",
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
        FunctionName: "apigw-mutualtls-lambda-function",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
        Timeout: 15,
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-LambdaFunctionRole-1DN25A5IY6VDT",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "apigw-mutualtls-lambda-function",
          Principal: "apigateway.amazonaws.com",
          StatementId: "sam-app-FunctionResourcePermission-10FTBFON2N9UG",
          SourceArn: `${getId({
            type: "Api",
            group: "ApiGatewayV2",
            name: "apigw-mutualtls-lambda",
            path: "live.ArnV2",
          })}/*`,
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "apigw-mutualtls-lambda-function",
      apiGatewayV2Apis: ["apigw-mutualtls-lambda"],
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "grucloud.org.",
    }),
    dependencies: ({}) => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: ({}) => ({
      hostedZone: "grucloud.org.",
      apiGatewayV2DomainName: "grucloud.org",
    }),
  },
  {
    type: "Domain",
    group: "Route53Domains",
    name: "grucloud.org",
    readOnly: true,
  },
];
