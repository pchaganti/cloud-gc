// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    name: "grucloud.org",
    properties: ({}) => ({
      SubjectAlternativeNames: ["grucloud.org", "*.grucloud.org"],
    }),
  },
  {
    type: "DomainName",
    group: "ApiGatewayV2",
    name: "grucloud.org",
    properties: ({}) => ({
      Tags: {
        mykey1: "value",
      },
    }),
    dependencies: () => ({
      certificate: "grucloud.org",
    }),
  },
  {
    type: "Api",
    group: "ApiGatewayV2",
    name: "my-api",
    properties: ({}) => ({
      Tags: {
        mykey1: "value",
      },
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    name: "my-api-stage-dev",
    properties: ({}) => ({
      AccessLogSettings: {
        Format:
          '$context.identity.sourceIp - - [$context.requestTime] "$context.httpMethod $context.routeKey $context.protocol" $context.status $context.responseLength $context.requestId',
      },
      Tags: {
        mykey1: "value",
      },
    }),
    dependencies: () => ({
      api: "my-api",
      logGroup: "lg-http-test",
    }),
  },
  {
    type: "ApiMapping",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ApiMappingKey: "",
    }),
    dependencies: () => ({
      api: "my-api",
      domainName: "grucloud.org",
      stage: "my-api-stage-dev",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "2.0",
    }),
    dependencies: () => ({
      api: "my-api",
      lambdaFunction: "my-function",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteKey: "ANY /my-function",
    }),
    dependencies: () => ({
      api: "my-api",
      integration: "integration::my-api::my-function",
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    dependencies: () => ({
      api: "my-api",
      stage: "my-api-stage-dev",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "/aws/lambda/my-function",
  },
  { type: "LogGroup", group: "CloudWatchLogs", name: "lg-http-test" },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "RDSOSMetrics",
    properties: ({}) => ({
      retentionInDays: 30,
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "lambda-role",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: `lambda.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: () => ({
      policies: ["lambda-policy"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "lambda-policy",
    properties: ({}) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["logs:*"],
            Effect: "Allow",
            Resource: `*`,
          },
        ],
      },
      Path: "/",
      Description: "Allow logs",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "my-function",
    properties: ({ config, getId }) => ({
      Configuration: {
        Handler: "my-function.handler",
        Runtime: "nodejs14.x",
      },
      Policy: {
        Version: "2012-10-17",
        Id: "default",
        Statement: [
          {
            Sid: "lambda-f9a2e0dc-5300-469d-8bc9-25daea82056c",
            Effect: "Allow",
            Principal: {
              Service: `apigateway.amazonaws.com`,
            },
            Action: "lambda:InvokeFunction",
            Resource: `arn:aws:lambda:${
              config.region
            }:${config.accountId()}:function:my-function`,
            Condition: {
              ArnLike: {
                "AWS:SourceArn": `${getId({
                  type: "Api",
                  group: "ApiGatewayV2",
                  name: "my-api",
                })}/*/*/my-function`,
              },
            },
          },
        ],
      },
    }),
    dependencies: () => ({
      role: "lambda-role",
      apiGatewayV2s: ["my-api"],
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    name: "grucloud.org.",
    dependencies: () => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: () => ({
      hostedZone: "grucloud.org.",
      certificate: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: () => ({
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
