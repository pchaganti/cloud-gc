// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-QueueConsumerFunctionRole-171YRTH8TJ509",
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
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole",
          PolicyName: "AWSLambdaSQSQueueExecutionRole",
        },
      ],
    }),
  },
  {
    type: "EventSourceMapping",
    group: "Lambda",
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-QueueConsumerFunction-iSlzL49MinOi",
      sqsQueue: "sam-app-MySqsQueue-uHf2h8Lf7bQc",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "sam-app-QueueConsumerFunction-iSlzL49MinOi",
        Handler: "app.handler",
        Runtime: "nodejs18.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-QueueConsumerFunctionRole-171YRTH8TJ509",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "sam-app-MySqsQueue-uHf2h8Lf7bQc",
    }),
  },
];
