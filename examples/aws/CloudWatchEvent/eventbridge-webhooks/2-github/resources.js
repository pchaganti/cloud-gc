// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "MetricAlarm",
    group: "CloudWatch",
    properties: ({}) => ({
      AlarmName: "InboundWebhook-Lambda-Invocation-Alarm-sam-app",
      AlarmDescription:
        "Alarm for sam-app - InboundWebhook Lambda for traffic spikes",
      MetricName: "Invocations",
      Namespace: "AWS/Lambda",
      Statistic: "Sum",
      Dimensions: [
        {
          Value: "InboundWebhook-Lambda-cb9166b0-ac6d-11ed-9aac-0a4580dc23a9",
          Name: "FunctionName",
        },
      ],
      Period: 300,
      EvaluationPeriods: 2,
      Threshold: 2000,
      ComparisonOperator: "GreaterThanThreshold",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config, getId }) => ({
      RoleName: "sam-app-WebhookFunctionRole-1QD1BF9DJZ6WC",
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
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: "events:PutEvents",
                Resource: `arn:aws:events:${
                  config.region
                }:${config.accountId()}:event-bus/default`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "WebhookFunctionRolePolicy0",
        },
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "secretsmanager:DescribeSecret",
                  "secretsmanager:GetSecretValue",
                ],
                Resource: `${getId({
                  type: "Secret",
                  group: "SecretsManager",
                  name: "WebhookSecret-sam-app",
                  path: "live.ARN",
                })}`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "WebhookFunctionRolePolicy1",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
    }),
    dependencies: ({}) => ({
      secretsManagerSecrets: ["WebhookSecret-sam-app"],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ getId }) => ({
      Configuration: {
        Environment: {
          Variables: {
            EVENT_BUS_NAME: "default",
            GITHUB_WEBHOOK_SECRET_ARN: `${getId({
              type: "Secret",
              group: "SecretsManager",
              name: "WebhookSecret-sam-app",
              path: "live.ARN",
            })}`,
          },
        },
        FunctionName:
          "InboundWebhook-Lambda-cb9166b0-ac6d-11ed-9aac-0a4580dc23a9",
        Handler: "app.lambda_handler",
        Runtime: "python3.7",
        Timeout: 100,
      },
      FunctionUrlConfig: {
        AuthType: "NONE",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-WebhookFunctionRole-1QD1BF9DJZ6WC",
      secretsManagerSecrets: ["WebhookSecret-sam-app"],
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({}) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName:
            "InboundWebhook-Lambda-cb9166b0-ac6d-11ed-9aac-0a4580dc23a9",
          Principal: "*",
          StatementId:
            "sam-app-WebhookFunctionUrlPublicPermissions-1MY08SVNVLXZ0",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction:
        "InboundWebhook-Lambda-cb9166b0-ac6d-11ed-9aac-0a4580dc23a9",
    }),
  },
  {
    type: "Secret",
    group: "SecretsManager",
    properties: ({}) => ({
      Name: "WebhookSecret-sam-app",
      SecretString: process.env.WEBHOOK_SECRET_SAM_APP_SECRET_STRING,
      Description: "Secrets Manager for storing Webhook Secret",
    }),
  },
];