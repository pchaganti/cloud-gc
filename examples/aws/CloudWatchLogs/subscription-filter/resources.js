// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "LogGroup", group: "CloudWatchLogs", name: "my-log-group" },
  {
    type: "LogStream",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logStreamName: "my-log-stream",
    }),
    dependencies: ({}) => ({
      cloudWatchLogGroup: "my-log-group",
    }),
  },
  {
    type: "SubscriptionFilter",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      distribution: "ByLogStream",
      filterName: "my-filter",
      filterPattern: '[timestamp=*Z, request_id="*-*", event]',
    }),
    dependencies: ({}) => ({
      cloudWatchLogGroup: "my-log-group",
      lambdaFunction: "receive-cloudwatch-log-group",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "receive-cloudwatch-log-group-role-cv4x40qb",
    properties: ({}) => ({
      Path: "/service-role/",
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
    }),
    dependencies: ({}) => ({
      policies: [
        "AWSLambdaBasicExecutionRole-1bf0f6d5-a5f9-44cf-917b-b5d3085e3c1e",
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "AWSLambdaBasicExecutionRole-1bf0f6d5-a5f9-44cf-917b-b5d3085e3c1e",
    properties: ({ config }) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: "logs:CreateLogGroup",
            Resource: `arn:aws:logs:${config.region}:${config.accountId()}:*`,
          },
          {
            Effect: "Allow",
            Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
            Resource: [
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/lambda/receive-cloudwatch-log-group:*`,
            ],
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ config, getId }) => ({
      FunctionName: "receive-cloudwatch-log-group",
      Configuration: {
        Handler: "index.handler",
        Runtime: "nodejs16.x",
      },
      Policy: {
        Version: "2012-10-17",
        Id: "default",
        Statement: [
          {
            Sid: "InvokePermissionsForCWL9b3c8372cdca158bb90409322a153feb",
            Effect: "Allow",
            Principal: {
              Service: `logs.amazonaws.com`,
            },
            Action: "lambda:InvokeFunction",
            Resource: `arn:aws:lambda:${
              config.region
            }:${config.accountId()}:function:receive-cloudwatch-log-group`,
            Condition: {
              StringEquals: {
                "AWS:SourceAccount": `${config.accountId()}`,
              },
              ArnLike: {
                "AWS:SourceArn": `${getId({
                  type: "LogGroup",
                  group: "CloudWatchLogs",
                  name: "my-log-group",
                })}:*`,
              },
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      role: "receive-cloudwatch-log-group-role-cv4x40qb",
    }),
  },
];
