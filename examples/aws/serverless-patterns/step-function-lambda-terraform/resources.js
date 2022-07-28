// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Rule",
    group: "CloudWatchEvents",
    name: "stf_trigger_rule",
    properties: ({}) => ({
      ScheduleExpression: "rate(10 minutes)",
      State: "ENABLED",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "terraform-20220421132955317100000002",
    }),
    dependencies: ({}) => ({
      rule: "stf_trigger_rule",
      role: "aws-events-invoke-StepFunction",
      sfnStateMachine: "aws-step-function-workflow",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "/aws/lambda/aws_lambda_example",
  },
  {
    type: "Role",
    group: "IAM",
    name: "aws-events-invoke-StepFunction",
    properties: ({ getId }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: [`events.amazonaws.com`, `states.amazonaws.com`],
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "Stmt1647307985962",
                Action: ["states:StartExecution"],
                Effect: "Allow",
                Resource: `${getId({
                  type: "StateMachine",
                  group: "StepFunctions",
                  name: "aws-step-function-workflow",
                })}`,
              },
            ],
          },
          PolicyName: "state_execution_policy",
        },
      ],
    }),
    dependencies: ({}) => ({
      stateMachines: ["aws-step-function-workflow"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "aws-lambda-role-example",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
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
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "aws-stf-role",
    properties: ({ config }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "StepFunctionAssumeRole",
            Effect: "Allow",
            Principal: {
              Service: `states.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["lambda:InvokeFunction"],
                Effect: "Allow",
                Resource: `arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:aws_lambda_example`,
              },
            ],
          },
          PolicyName: "aws-stf-policy",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "aws_lambda_example",
        Environment: {
          Variables: {
            application_name: `aws_lambda_example`,
            env: `dev`,
          },
        },
        Handler: "lambda.lambda_handler",
        Runtime: "python3.7",
      },
    }),
    dependencies: ({}) => ({
      role: "aws-lambda-role-example",
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    name: "aws-step-function-workflow",
    properties: ({ config }) => ({
      definition: {
        Comment: "A description of my state machine",
        StartAt: "TriggerLambda",
        States: {
          TriggerLambda: {
            Type: "Task",
            Resource: `arn:aws:states:::lambda:invoke`,
            OutputPath: "$.Payload",
            Parameters: {
              "Payload.$": "$",
              FunctionName: `arn:aws:lambda:${
                config.region
              }:${config.accountId()}:function:aws_lambda_example`,
            },
            Retry: [
              {
                ErrorEquals: [
                  "Lambda.ServiceException",
                  "Lambda.AWSLambdaException",
                  "Lambda.SdkClientException",
                ],
                IntervalSeconds: 1,
                MaxAttempts: 6,
                BackoffRate: 2,
              },
            ],
            Next: "Choice",
          },
          Choice: {
            Type: "Choice",
            Choices: [
              {
                Variable: "$.status",
                StringEquals: "Success",
                Next: "Pass",
              },
            ],
            Default: "Fail",
          },
          Pass: {
            Type: "Pass",
            End: true,
          },
          Fail: {
            Type: "Fail",
          },
        },
      },
    }),
    dependencies: ({}) => ({
      role: "aws-stf-role",
      lambdaFunctions: ["aws_lambda_example"],
    }),
  },
];
