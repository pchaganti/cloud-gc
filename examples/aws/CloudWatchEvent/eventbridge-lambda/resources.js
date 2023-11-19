// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      EventPattern: {
        detail: {
          location: [
            {
              prefix: "EUR-",
            },
          ],
        },
        "detail-type": ["transaction"],
        source: ["custom.myApp"],
      },
      Name: "sam-app-ConsumerFunctionTrigger-1DTESABB4TRY7",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "ConsumerFunctionTriggerLambdaTarget",
    }),
    dependencies: ({}) => ({
      rule: "sam-app-ConsumerFunctionTrigger-1DTESABB4TRY7",
      lambdaFunction: "sam-app-ConsumerFunction-oP2n9mZPow7c",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-ConsumerFunctionRole-MEMVENRRHA0C",
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
        FunctionName: "sam-app-ConsumerFunction-oP2n9mZPow7c",
        Handler: "app.handler",
        Runtime: "nodejs18.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-ConsumerFunctionRole-MEMVENRRHA0C",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ config }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-ConsumerFunction-oP2n9mZPow7c",
          Principal: "events.amazonaws.com",
          SourceArn: `arn:aws:events:${
            config.region
          }:${config.accountId()}:rule/sam-app-ConsumerFunctionTrigger-1DTESABB4TRY7`,
          StatementId:
            "sam-app-ConsumerFunctionTriggerPermission-1JE0JMWA7NDJM",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-ConsumerFunction-oP2n9mZPow7c",
    }),
  },
];
