// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "read-kinesis-stream-role-wmuwr9bv",
      Path: "/service-role/",
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
          PolicyName: "AmazonKinesisFullAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonKinesisFullAccess",
        },
      ],
    }),
    dependencies: ({}) => ({
      policies: [
        "AWSLambdaBasicExecutionRole-a76cddca-78ae-48ce-9719-4222f782af1b",
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName:
        "AWSLambdaBasicExecutionRole-a76cddca-78ae-48ce-9719-4222f782af1b",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: "logs:CreateLogGroup",
            Resource: `arn:aws:logs:${config.region}:${config.accountId()}:*`,
          },
          {
            Effect: "Allow",
            Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
            Resource: [
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/lambda/read-kinesis-stream:*`,
            ],
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Stream",
    group: "Kinesis",
    properties: ({}) => ({
      StreamModeDetails: {
        StreamMode: "ON_DEMAND",
      },
      StreamName: "my-stream",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "read-kinesis-stream",
        Handler: "index.handler",
        Runtime: "nodejs16.x",
      },
    }),
    dependencies: ({}) => ({
      role: "read-kinesis-stream-role-wmuwr9bv",
    }),
  },
  {
    type: "EventSourceMapping",
    group: "Lambda",
    name: "mapping-read-kinesis-stream-stream/my-stream",
    properties: ({}) => ({
      StartingPosition: "LATEST",
      BatchSize: 100,
      MaximumBatchingWindowInSeconds: 0,
      ParallelizationFactor: 1,
      MaximumRecordAgeInSeconds: -1,
      BisectBatchOnFunctionError: false,
      MaximumRetryAttempts: -1,
      TumblingWindowInSeconds: 0,
    }),
    dependencies: ({}) => ({
      lambdaFunction: "read-kinesis-stream",
      kinesisStream: "my-stream",
    }),
  },
];
