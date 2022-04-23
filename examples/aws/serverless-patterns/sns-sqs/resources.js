// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Topic",
    group: "SNS",
    name: "sam-app-MySnsTopic-7ZOEL49PL4BA",
    properties: ({ config }) => ({
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
    type: "Queue",
    group: "SQS",
    name: "sam-app-MySqsQueue-KMqXSqHYypds",
    properties: ({ config }) => ({
      Attributes: {
        Policy: {
          Version: "2012-10-17",
          Statement: [
            {
              Sid: "Allow SNS publish to SQS",
              Effect: "Allow",
              Principal: {
                Service: `sns.amazonaws.com`,
              },
              Action: "SQS:SendMessage",
              Resource: `arn:aws:sqs:${
                config.region
              }:${config.accountId()}:sam-app-MySqsQueue-KMqXSqHYypds`,
              Condition: {
                ArnEquals: {
                  "aws:SourceArn": `arn:aws:sns:${
                    config.region
                  }:${config.accountId()}:sam-app-MySnsTopic-7ZOEL49PL4BA`,
                },
              },
            },
          ],
        },
      },
    }),
    dependencies: () => ({
      snsTopics: ["sam-app-MySnsTopic-7ZOEL49PL4BA"],
    }),
  },
];
