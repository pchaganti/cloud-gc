// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "my-log-group",
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
    properties: ({}) => ({
      RoleName: "receive-cloudwatch-log-group-role-cv4x40qb",
      Path: "/service-role/",
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
    properties: ({ config }) => ({
      PolicyName:
        "AWSLambdaBasicExecutionRole-1bf0f6d5-a5f9-44cf-917b-b5d3085e3c1e",
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
    properties: ({}) => ({
      Configuration: {
        FunctionName: "receive-cloudwatch-log-group",
        Handler: "index.handler",
        Runtime: "nodejs16.x",
      },
    }),
    dependencies: ({}) => ({
      role: "receive-cloudwatch-log-group-role-cv4x40qb",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ config }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "receive-cloudwatch-log-group",
          Principal: "logs.amazonaws.com",
          StatementId:
            "InvokePermissionsForCWL9b3c8372cdca158bb90409322a153feb",
          SourceArn: `arn:aws:logs:${
            config.region
          }:${config.accountId()}:log-group:my-log-group:*`,
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "receive-cloudwatch-log-group",
    }),
  },
];
