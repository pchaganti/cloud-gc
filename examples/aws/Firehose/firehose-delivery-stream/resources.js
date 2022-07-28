// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "/aws/kinesisfirehose/my-deliverrt-stream",
  },
  {
    type: "LogStream",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logStreamName: "BackupDelivery",
    }),
    dependencies: ({}) => ({
      cloudWatchLogGroup: "/aws/kinesisfirehose/my-deliverrt-stream",
    }),
  },
  {
    type: "LogStream",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logStreamName: "DestinationDelivery",
    }),
    dependencies: ({}) => ({
      cloudWatchLogGroup: "/aws/kinesisfirehose/my-deliverrt-stream",
    }),
  },
  {
    type: "DeliveryStream",
    group: "Firehose",
    name: "my-deliverrt-stream",
    properties: ({ config, getId }) => ({
      DeliveryStreamEncryptionConfiguration: {
        Status: "DISABLED",
      },
      DeliveryStreamName: "my-deliverrt-stream",
      DeliveryStreamType: "DirectPut",
      Destinations: [
        {
          DestinationId: "destinationId-000000000001",
          ExtendedS3DestinationDescription: {
            BucketARN: "arn:aws:s3:::gc-firehose-destination",
            BufferingHints: {
              IntervalInSeconds: 300,
              SizeInMBs: 5,
            },
            CloudWatchLoggingOptions: {
              Enabled: true,
              LogGroupName: "/aws/kinesisfirehose/my-deliverrt-stream",
              LogStreamName: "DestinationDelivery",
            },
            CompressionFormat: "UNCOMPRESSED",
            DataFormatConversionConfiguration: {
              Enabled: false,
            },
            EncryptionConfiguration: {
              NoEncryptionConfig: "NoEncryption",
            },
            ErrorOutputPrefix: "",
            Prefix: "",
            ProcessingConfiguration: {
              Enabled: true,
              Processors: [
                {
                  Parameters: [
                    {
                      ParameterName: "LambdaArn",
                      ParameterValue: `${getId({
                        type: "Function",
                        group: "Lambda",
                        name: "my-firehose-transform",
                      })}:$LATEST`,
                    },
                    {
                      ParameterName: "NumberOfRetries",
                      ParameterValue: "3",
                    },
                    {
                      ParameterName: "RoleArn",
                      ParameterValue: `${getId({
                        type: "Role",
                        group: "IAM",
                        name: `KinesisFirehoseServiceRole-my-deliverrt--${config.region}-1658565467200`,
                      })}`,
                    },
                    {
                      ParameterName: "BufferSizeInMBs",
                      ParameterValue: "3",
                    },
                    {
                      ParameterName: "BufferIntervalInSeconds",
                      ParameterValue: "60",
                    },
                  ],
                  Type: "Lambda",
                },
              ],
            },
            RoleARN: `${getId({
              type: "Role",
              group: "IAM",
              name: `KinesisFirehoseServiceRole-my-deliverrt--${config.region}-1658565467200`,
            })}`,
            S3BackupDescription: {
              BucketARN: "arn:aws:s3:::gc-firehose-error",
              BufferingHints: {
                IntervalInSeconds: 300,
                SizeInMBs: 5,
              },
              CloudWatchLoggingOptions: {
                Enabled: true,
                LogGroupName: "/aws/kinesisfirehose/my-deliverrt-stream",
                LogStreamName: "BackupDelivery",
              },
              CompressionFormat: "UNCOMPRESSED",
              EncryptionConfiguration: {
                NoEncryptionConfig: "NoEncryption",
              },
              ErrorOutputPrefix: "!{firehose:error-output-type}",
              Prefix: "",
              RoleARN: `${getId({
                type: "Role",
                group: "IAM",
                name: `KinesisFirehoseServiceRole-my-deliverrt--${config.region}-1658565467200`,
              })}`,
            },
            S3BackupMode: "Enabled",
          },
          S3DestinationDescription: {
            BucketARN: "arn:aws:s3:::gc-firehose-destination",
            BufferingHints: {
              IntervalInSeconds: 300,
              SizeInMBs: 5,
            },
            CloudWatchLoggingOptions: {
              Enabled: true,
              LogGroupName: "/aws/kinesisfirehose/my-deliverrt-stream",
              LogStreamName: "DestinationDelivery",
            },
            CompressionFormat: "UNCOMPRESSED",
            EncryptionConfiguration: {
              NoEncryptionConfig: "NoEncryption",
            },
            ErrorOutputPrefix: "",
            Prefix: "",
            RoleARN: `${getId({
              type: "Role",
              group: "IAM",
              name: `KinesisFirehoseServiceRole-my-deliverrt--${config.region}-1658565467200`,
            })}`,
          },
        },
      ],
    }),
    dependencies: ({ config }) => ({
      s3BucketDestination: "gc-firehose-destination",
      s3BucketBackup: "gc-firehose-error",
      lambdaFunction: "my-firehose-transform",
      cloudWatchLogStreams: [
        "/aws/kinesisfirehose/my-deliverrt-stream::DestinationDelivery",
      ],
      cloudWatchLogStreamLogError:
        "/aws/kinesisfirehose/my-deliverrt-stream::DestinationDelivery",
      roles: [
        `KinesisFirehoseServiceRole-my-deliverrt--${config.region}-1658565467200`,
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: ({ config }) =>
      `KinesisFirehoseServiceRole-my-deliverrt--${config.region}-1658565467200`,
    properties: ({}) => ({
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `firehose.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({ config }) => ({
      policies: [
        `KinesisFirehoseServicePolicy-my-deliverrt-stream-${config.region}`,
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "my-firehose-transform-role-n1caari0",
    properties: ({}) => ({
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
    }),
    dependencies: ({}) => ({
      policies: [
        "AWSLambdaBasicExecutionRole-79ebee5c-0420-46a0-8952-238cfd698bef",
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "AWSLambdaBasicExecutionRole-79ebee5c-0420-46a0-8952-238cfd698bef",
    properties: ({ config }) => ({
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
              }:${config.accountId()}:log-group:/aws/lambda/my-firehose-transform:*`,
            ],
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: ({ config }) =>
      `KinesisFirehoseServicePolicy-my-deliverrt-stream-${config.region}`,
    properties: ({ config, getId }) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Action: [
              "glue:GetTable",
              "glue:GetTableVersion",
              "glue:GetTableVersions",
            ],
            Resource: [
              `arn:aws:glue:${config.region}:${config.accountId()}:catalog`,
              `arn:aws:glue:${
                config.region
              }:${config.accountId()}:database/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
              `arn:aws:glue:${
                config.region
              }:${config.accountId()}:table/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            ],
          },
          {
            Sid: "",
            Effect: "Allow",
            Action: [
              "s3:AbortMultipartUpload",
              "s3:GetBucketLocation",
              "s3:GetObject",
              "s3:ListBucket",
              "s3:ListBucketMultipartUploads",
              "s3:PutObject",
            ],
            Resource: [
              `arn:aws:s3:::gc-firehose-destination`,
              `arn:aws:s3:::gc-firehose-error`,
              `arn:aws:s3:::gc-firehose-destination/*`,
              `arn:aws:s3:::gc-firehose-error/*`,
            ],
          },
          {
            Sid: "",
            Effect: "Allow",
            Action: [
              "lambda:InvokeFunction",
              "lambda:GetFunctionConfiguration",
            ],
            Resource: `arn:aws:lambda:${
              config.region
            }:${config.accountId()}:function:my-firehose-transform:$LATEST`,
          },
          {
            Effect: "Allow",
            Action: ["kms:GenerateDataKey", "kms:Decrypt"],
            Resource: [
              `arn:aws:kms:${
                config.region
              }:${config.accountId()}:key/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            ],
            Condition: {
              StringEquals: {
                "kms:ViaService": `s3.${config.region}.amazonaws.com`,
              },
              StringLike: {
                "kms:EncryptionContext:aws:s3:arn": [
                  "arn:aws:s3:::%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%/*",
                  "arn:aws:s3:::%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%",
                ],
              },
            },
          },
          {
            Sid: "",
            Effect: "Allow",
            Action: ["logs:PutLogEvents"],
            Resource: [
              `${getId({
                type: "LogGroup",
                group: "CloudWatchLogs",
                name: "/aws/kinesisfirehose/my-deliverrt-stream",
              })}:log-stream:*`,
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%:log-stream:*`,
            ],
          },
          {
            Sid: "",
            Effect: "Allow",
            Action: [
              "kinesis:DescribeStream",
              "kinesis:GetShardIterator",
              "kinesis:GetRecords",
              "kinesis:ListShards",
            ],
            Resource: `arn:aws:kinesis:${
              config.region
            }:${config.accountId()}:stream/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
          },
          {
            Effect: "Allow",
            Action: ["kms:Decrypt"],
            Resource: [
              `arn:aws:kms:${
                config.region
              }:${config.accountId()}:key/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            ],
            Condition: {
              StringEquals: {
                "kms:ViaService": `kinesis.${config.region}.amazonaws.com`,
              },
              StringLike: {
                "kms:EncryptionContext:aws:kinesis:arn":
                  "arn:aws:kinesis:us-east-1:840541460064:stream/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%",
              },
            },
          },
        ],
      },
      Path: "/service-role/",
    }),
    dependencies: ({}) => ({
      logGroups: ["/aws/kinesisfirehose/my-deliverrt-stream"],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "my-firehose-transform",
        Description:
          "An Amazon Kinesis Firehose stream processor that accesses the records in the input and returns them with a processing status.",
        Handler: "index.handler",
        Runtime: "nodejs12.x",
      },
      Tags: {
        "lambda-console:blueprint": "kinesis-firehose-process-record",
      },
    }),
    dependencies: ({}) => ({
      role: "my-firehose-transform-role-n1caari0",
    }),
  },
  { type: "Bucket", group: "S3", name: "gc-firehose-destination" },
  { type: "Bucket", group: "S3", name: "gc-firehose-error" },
];
