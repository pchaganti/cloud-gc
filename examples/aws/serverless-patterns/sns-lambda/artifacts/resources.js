// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    name: "sam-app-TopicConsumerFunction1Role-1CWCD3G6QCTG6",
    properties: ({}) => ({
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
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
      Tags: [
        {
          Key: "lambda:createdBy",
          Value: "SAM",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "sam-app-TopicConsumerFunction1-OL7tADpZDByC",
    properties: ({}) => ({
      Configuration: {
        Handler: "app.handler",
        Runtime: "nodejs12.x",
      },
      Tags: {
        "lambda:createdBy": "SAM",
      },
    }),
    dependencies: () => ({
      role: "sam-app-TopicConsumerFunction1Role-1CWCD3G6QCTG6",
    }),
  },
  {
    type: "Topic",
    group: "SNS",
    name: "sam-app-MySnsTopic-1Q2VS8SMOPR20",
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
    type: "Subscription",
    group: "SNS",
    properties: ({}) => ({
      RawMessageDelivery: "false",
      PendingConfirmation: "false",
      ConfirmationWasAuthenticated: "true",
    }),
    dependencies: () => ({
      snsTopic: "sam-app-MySnsTopic-1Q2VS8SMOPR20",
      lambdaFunction: "sam-app-TopicConsumerFunction1-OL7tADpZDByC",
    }),
  },
];
