// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName:
        "Amazon-EventBridge-Scheduler-Execution-Policy-4a8e3a39-7d15-4aa8-82c5-b07d299fea48",
      PolicyDocument: {
        Statement: [
          {
            Action: ["sqs:SendMessage"],
            Effect: "Allow",
            Resource: [
              `arn:aws:sqs:${
                config.region
              }:${config.accountId()}:queue-scheduler`,
            ],
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "Amazon_EventBridge_Scheduler_SQS_faa1b74758",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Condition: {
              StringEquals: {
                "aws:SourceAccount": `${config.accountId()}`,
                "aws:SourceArn": `arn:aws:scheduler:${
                  config.region
                }:${config.accountId()}:schedule/mygroup/schedule-sqs`,
              },
            },
            Effect: "Allow",
            Principal: {
              Service: "scheduler.amazonaws.com",
            },
          },
        ],
        Version: "2012-10-17",
      },
    }),
    dependencies: ({}) => ({
      policies: [
        "Amazon-EventBridge-Scheduler-Execution-Policy-4a8e3a39-7d15-4aa8-82c5-b07d299fea48",
      ],
    }),
  },
  {
    type: "Schedule",
    group: "Scheduler",
    properties: ({ config }) => ({
      Description: "",
      FlexibleTimeWindow: {
        Mode: "OFF",
      },
      GroupName: "mygroup",
      Name: "schedule-sqs",
      ScheduleExpression: "rate(1 hours)",
      ScheduleExpressionTimezone: "America/Fortaleza",
      Target: {
        Arn: `arn:aws:sqs:${
          config.region
        }:${config.accountId()}:queue-scheduler`,
        Input: {},
        RetryPolicy: {
          MaximumEventAgeInSeconds: 86400,
          MaximumRetryAttempts: 185,
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "Amazon_EventBridge_Scheduler_SQS_faa1b74758",
      scheduleGroup: "mygroup",
      sqsQueue: "queue-scheduler",
    }),
  },
  {
    type: "ScheduleGroup",
    group: "Scheduler",
    properties: ({}) => ({
      Name: "mygroup",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "queue-scheduler",
    }),
  },
];
