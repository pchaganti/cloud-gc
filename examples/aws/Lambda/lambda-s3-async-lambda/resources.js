// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-AsynchronousFunctionRole-4JYGEMGOVCR2",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
          },
        ],
        Version: "2012-10-17",
      },
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  "s3:GetObject",
                  "s3:ListBucket",
                  "s3:GetBucketLocation",
                  "s3:GetObjectVersion",
                  "s3:GetLifecycleConfiguration",
                ],
                Effect: "Allow",
                Resource: [
                  "arn:aws:s3:::gc-lambda-s3-async-lambda",
                  "arn:aws:s3:::gc-lambda-s3-async-lambda/*",
                ],
              },
            ],
          },
          PolicyName: "AsynchronousFunctionRolePolicy0",
        },
      ],
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
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-SendPayloadFunctionRole-1NVFRO3D7YZAT",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
          },
        ],
        Version: "2012-10-17",
      },
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: ["lambda:InvokeFunction"],
                Effect: "Allow",
                Resource: `arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:MyAsynchronousFunction*`,
              },
            ],
          },
          PolicyName: "SendPayloadFunctionRolePolicy0",
        },
        {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  "s3:PutObject",
                  "s3:PutObjectAcl",
                  "s3:PutLifecycleConfiguration",
                ],
                Effect: "Allow",
                Resource: [
                  "arn:aws:s3:::gc-lambda-s3-async-lambda",
                  "arn:aws:s3:::gc-lambda-s3-async-lambda/*",
                ],
              },
            ],
          },
          PolicyName: "SendPayloadFunctionRolePolicy1",
        },
      ],
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
        FunctionName: "MyAsynchronousFunction",
        Handler: "app.lambda_handler",
        Runtime: "python3.9",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-AsynchronousFunctionRole-4JYGEMGOVCR2",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            AsyncLambdaFunctionName: "MyAsynchronousFunction",
            PayloadBucketName: "gc-lambda-s3-async-lambda",
            PayloadPrefix: "MyPayload_",
          },
        },
        FunctionName: "SendPayloadFunction",
        Handler: "app.lambda_handler",
        Runtime: "python3.9",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-SendPayloadFunctionRole-1NVFRO3D7YZAT",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({}) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "MyAsynchronousFunction",
          Principal: "s3.amazonaws.com",
          StatementId:
            "sam-app-AsynchronousFunctionPayloadCreationEventPermission-1U4VIKEFLMHW5",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "MyAsynchronousFunction",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: "gc-lambda-s3-async-lambda",
      NotificationConfiguration: {
        LambdaFunctionConfigurations: [
          {
            LambdaFunctionArn: `arn:aws:lambda:${
              config.region
            }:${config.accountId()}:function:MyAsynchronousFunction`,
            Events: ["s3:ObjectCreated:*"],
            Filter: {
              Key: {
                FilterRules: [
                  {
                    Name: "Prefix",
                    Value: "MyPayload_",
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  },
];
