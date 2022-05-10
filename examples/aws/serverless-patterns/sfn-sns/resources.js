// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    name: "sam-app-StatesExecutionRole-NOZF6W7MEIVB",
    properties: ({ config }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `states.${config.region}.amazonaws.com`,
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
                Action: ["sns:Publish"],
                Resource: [
                  `arn:aws:sns:${
                    config.region
                  }:${config.accountId()}:sam-app-StateMachineSNSTopic-C6WGCI64MKY2`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "SNSAccess",
        },
      ],
    }),
    dependencies: ({}) => ({
      snsTopic: "sam-app-StateMachineSNSTopic-C6WGCI64MKY2",
    }),
  },
  {
    type: "Topic",
    group: "SNS",
    name: "sam-app-StateMachineSNSTopic-C6WGCI64MKY2",
    properties: ({}) => ({
      Attributes: {
        DisplayName: "",
        DeliveryPolicy: {
          http: {
            defaultHealthyRetryPolicy: {
              minDelayTarget: 20,
              maxDelayTarget: 20,
              numRetries: 3,
              numMaxDelayRetries: 0,
              numNoDelayRetries: 0,
              numMinDelayRetries: 0,
              backoffFunction: "linear",
            },
            disableSubscriptionOverrides: false,
          },
        },
      },
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    name: "StateMachineExpressSynctoSNS-s4flfbpCO2tF",
    properties: ({ config }) => ({
      definition: {
        Comment: "An example of the Amazon States Language using AWS SNS",
        StartAt: "SendSNSMessage",
        States: {
          SendSNSMessage: {
            Type: "Task",
            Resource: `arn:aws:states:::sns:publish`,
            Parameters: {
              Message: {
                Input: "You just received a message from the state machine!",
                "Message.$": "$.message",
              },
              TopicArn: `arn:aws:sns:${
                config.region
              }:${config.accountId()}:sam-app-StateMachineSNSTopic-C6WGCI64MKY2`,
            },
            End: true,
          },
        },
      },
      type: "EXPRESS",
      tags: [
        {
          key: "stateMachine:createdBy",
          value: "SAM",
        },
      ],
    }),
    dependencies: ({}) => ({
      role: "sam-app-StatesExecutionRole-NOZF6W7MEIVB",
    }),
  },
];
