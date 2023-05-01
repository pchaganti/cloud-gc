// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "sqs-pipes-sf/StateMachine",
      retentionInDays: 7,
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-EventBridgePipesRole-E5SRBPCBWT7D",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "pipes.amazonaws.com",
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
                Action: [
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents",
                ],
                Effect: "Allow",
                Resource: "*",
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "CloudWatchLogs",
        },
        {
          PolicyDocument: {
            Statement: [
              {
                Action: ["states:StartExecution"],
                Effect: "Allow",
                Resource: `arn:aws:states:${
                  config.region
                }:${config.accountId()}:stateMachine:TargetStateMachine-3Z5SSzC8L1RN`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "ExecuteSFN",
        },
        {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  "sqs:ReceiveMessage",
                  "sqs:DeleteMessage",
                  "sqs:GetQueueAttributes",
                ],
                Effect: "Allow",
                Resource: `arn:aws:sqs:${
                  config.region
                }:${config.accountId()}:sam-app-SourceQueue-7tNa5vbmnIiP`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "ReadSQS",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-TargetStateMachineRole-RGUSC4UJPHNM",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "states.amazonaws.com",
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
                Action: [
                  "logs:CreateLogDelivery",
                  "logs:GetLogDelivery",
                  "logs:UpdateLogDelivery",
                  "logs:DeleteLogDelivery",
                  "logs:ListLogDeliveries",
                  "logs:PutResourcePolicy",
                  "logs:DescribeResourcePolicies",
                  "logs:DescribeLogGroups",
                ],
                Effect: "Allow",
                Resource: "*",
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "CloudWatchLogs",
        },
      ],
    }),
  },
  {
    type: "Pipe",
    group: "Pipes",
    properties: ({}) => ({
      Name: "SqsToSfnPipe",
      SourceParameters: {
        SqsQueueParameters: {
          BatchSize: 1,
        },
      },
      TargetParameters: {
        StepFunctionStateMachineParameters: {
          InvocationType: "FIRE_AND_FORGET",
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "sam-app-EventBridgePipesRole-E5SRBPCBWT7D",
      sourceSQSQueue: "sam-app-SourceQueue-7tNa5vbmnIiP",
      targetStepFunctionsStateMachine: "TargetStateMachine-3Z5SSzC8L1RN",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "sam-app-SourceQueue-7tNa5vbmnIiP",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "sam-app-SourceQueueDLQ-fcsTvVg05mR3",
    }),
  },
  {
    type: "QueueRedrivePolicy",
    group: "SQS",
    properties: ({}) => ({
      Attributes: {
        RedrivePolicy: {
          maxReceiveCount: 5,
        },
      },
    }),
    dependencies: ({}) => ({
      sqsQueue: "sam-app-SourceQueue-7tNa5vbmnIiP",
      sqsDeadLetterQueue: "sam-app-SourceQueueDLQ-fcsTvVg05mR3",
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({ getId }) => ({
      definition: {
        Comment: "Sample SF to call with SQS throught EventBridge pipes",
        StartAt: "Pass",
        States: {
          Pass: {
            Type: "Pass",
            End: true,
          },
        },
      },
      loggingConfiguration: {
        destinations: [
          {
            cloudWatchLogsLogGroup: {
              logGroupArn: `${getId({
                type: "LogGroup",
                group: "CloudWatchLogs",
                name: "sqs-pipes-sf/StateMachine",
              })}:*`,
            },
          },
        ],
        includeExecutionData: true,
        level: "ALL",
      },
      name: "TargetStateMachine-3Z5SSzC8L1RN",
      type: "EXPRESS",
    }),
    dependencies: ({}) => ({
      role: "sam-app-TargetStateMachineRole-RGUSC4UJPHNM",
      logGroups: ["sqs-pipes-sf/StateMachine"],
    }),
  },
];
