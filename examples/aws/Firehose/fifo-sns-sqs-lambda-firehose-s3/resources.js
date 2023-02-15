// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "DeliveryStream",
    group: "Firehose",
    properties: ({ getId }) => ({
      DeliveryStreamName: "fifo-sns-sqs-lambda-firehose-s3-stream-5d62e6b5",
      DeliveryStreamType: "DirectPut",
      ExtendedS3DestinationConfiguration: {
        BucketARN:
          "arn:aws:s3:::fifo-sns-sqs-lambda-firehose-s3-bucket-5d62e6b5",
        BufferingHints: {
          IntervalInSeconds: 60,
          SizeInMBs: 1,
        },
        CloudWatchLoggingOptions: {
          Enabled: false,
        },
        CompressionFormat: "UNCOMPRESSED",
        DataFormatConversionConfiguration: {
          Enabled: false,
        },
        EncryptionConfiguration: {
          NoEncryptionConfig: "NoEncryption",
        },
        Prefix: "",
        ProcessingConfiguration: {
          Enabled: false,
          Processors: [],
        },
        RoleARN: `${getId({
          type: "Role",
          group: "IAM",
          name: "fifo-sns-sqs-lambda-firehose-s3-firehose-role-5d62e6b5",
        })}`,
        S3BackupMode: "Disabled",
      },
    }),
    dependencies: ({}) => ({
      s3BucketDestination: "fifo-sns-sqs-lambda-firehose-s3-bucket-5d62e6b5",
      roles: ["fifo-sns-sqs-lambda-firehose-s3-firehose-role-5d62e6b5"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "fifo-sns-sqs-lambda-firehose-s3-firehose-role-5d62e6b5",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "firehose.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: ["fifo-sns-sqs-lambda-firehose-s3-firehose-policy-5d62e6b5"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "fifo-sns-sqs-lambda-firehose-s3-lambda-role-5d62e6b5",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: ["fifo-sns-sqs-lambda-firehose-s3-lambda-policy-5d62e6b5"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "fifo-sns-sqs-lambda-firehose-s3-firehose-policy-5d62e6b5",
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "s3:PutObject",
              "s3:ListBucketMultipartUploads",
              "s3:ListBucket",
              "s3:GetObject",
              "s3:GetBucketLocation",
              "s3:AbortMultipartUpload",
            ],
            Effect: "Allow",
            Resource: [
              "arn:aws:s3:::fifo-sns-sqs-lambda-firehose-s3-bucket-5d62e6b5/*",
              "arn:aws:s3:::fifo-sns-sqs-lambda-firehose-s3-bucket-5d62e6b5",
            ],
            Sid: "",
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "fifo-sns-sqs-lambda-firehose-s3-lambda-policy-5d62e6b5",
      PolicyDocument: {
        Statement: [
          {
            Action: ["firehose:PutRecordBatch", "firehose:PutRecord"],
            Effect: "Allow",
            Resource: `arn:aws:firehose:${
              config.region
            }:${config.accountId()}:deliverystream/fifo-sns-sqs-lambda-firehose-s3-stream-5d62e6b5`,
            Sid: "",
          },
          {
            Action: [
              "sqs:ReceiveMessage",
              "sqs:GetQueueAttributes",
              "sqs:DeleteMessage",
            ],
            Effect: "Allow",
            Resource: `arn:aws:sqs:${
              config.region
            }:${config.accountId()}:fifo-sns-sqs-lambda-firehose-s3-queue-5d62e6b5.fifo`,
            Sid: "",
          },
          {
            Action: [
              "logs:PutLogEvents",
              "logs:CreateLogStream",
              "logs:CreateLogGroup",
            ],
            Effect: "Allow",
            Resource: `arn:aws:logs:${
              config.region
            }:${config.accountId()}:log-group:/aws/lambda/fifo-sns-sqs-lambda-firehose-s3-lambda-5d62e6b5:*`,
            Sid: "",
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
    }),
  },
  {
    type: "EventSourceMapping",
    group: "Lambda",
    dependencies: ({}) => ({
      lambdaFunction: "fifo-sns-sqs-lambda-firehose-s3-lambda-5d62e6b5",
      sqsQueue: "fifo-sns-sqs-lambda-firehose-s3-queue-5d62e6b5.fifo",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            FIREHOSE_STREAM_NAME:
              "fifo-sns-sqs-lambda-firehose-s3-stream-5d62e6b5",
          },
        },
        FunctionName: "fifo-sns-sqs-lambda-firehose-s3-lambda-5d62e6b5",
        Handler: "lambdaFirehoseLogger.lambdaFirehoseLogger",
        Runtime: "python3.8",
      },
    }),
    dependencies: ({}) => ({
      role: "fifo-sns-sqs-lambda-firehose-s3-lambda-role-5d62e6b5",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "fifo-sns-sqs-lambda-firehose-s3-bucket-5d62e6b5",
    }),
  },
  {
    type: "Topic",
    group: "SNS",
    name: "fifo-sns-sqs-lambda-firehose-s3-topic-5d62e6b5.fifo",
    properties: ({ config }) => ({
      Attributes: {
        Policy: {
          Version: "2012-10-17",
          Statement: [
            {
              Sid: "",
              Effect: "Allow",
              Principal: {
                AWS: "*",
              },
              Action: [
                "SNS:Subscribe",
                "SNS:SetTopicAttributes",
                "SNS:RemovePermission",
                "SNS:Publish",
                "SNS:ListSubscriptionsByTopic",
                "SNS:GetTopicAttributes",
                "SNS:DeleteTopic",
                "SNS:AddPermission",
              ],
              Resource: `arn:aws:sns:${
                config.region
              }:${config.accountId()}:fifo-sns-sqs-lambda-firehose-s3-topic-5d62e6b5.fifo`,
              Condition: {
                StringEquals: {
                  "AWS:SourceOwner": `${config.accountId()}`,
                },
              },
            },
          ],
        },
        FifoTopic: "true",
        DisplayName: "fifo-sns-sqs-lambda-firehose-s3-topic-5d62e6b5",
        ContentBasedDeduplication: "false",
      },
    }),
  },
  {
    type: "Subscription",
    group: "SNS",
    properties: ({}) => ({
      Attributes: {},
    }),
    dependencies: ({}) => ({
      snsTopic: "fifo-sns-sqs-lambda-firehose-s3-topic-5d62e6b5.fifo",
      sqsQueue: "fifo-sns-sqs-lambda-firehose-s3-queue-5d62e6b5.fifo",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({ config }) => ({
      Attributes: {
        Policy: {
          Version: "2012-10-17",
          Statement: [
            {
              Sid: "",
              Effect: "Allow",
              Principal: {
                AWS: `arn:aws:iam::${config.accountId()}:root`,
              },
              Action: "sqs:*",
              Resource: `arn:aws:sqs:${
                config.region
              }:${config.accountId()}:fifo-sns-sqs-lambda-firehose-s3-queue-5d62e6b5.fifo`,
            },
            {
              Sid: "",
              Effect: "Allow",
              Principal: {
                AWS: "*",
              },
              Action: "sqs:SendMessage",
              Resource: `arn:aws:sqs:${
                config.region
              }:${config.accountId()}:fifo-sns-sqs-lambda-firehose-s3-queue-5d62e6b5.fifo`,
              Condition: {
                ArnEquals: {
                  "aws:SourceArn": `arn:aws:sns:${
                    config.region
                  }:${config.accountId()}:fifo-sns-sqs-lambda-firehose-s3-topic-5d62e6b5.fifo`,
                },
              },
            },
          ],
        },
        FifoQueue: "true",
        DeduplicationScope: "queue",
        FifoThroughputLimit: "perQueue",
        ContentBasedDeduplication: "false",
      },
      QueueName: "fifo-sns-sqs-lambda-firehose-s3-queue-5d62e6b5.fifo",
    }),
    dependencies: ({}) => ({
      snsTopics: ["fifo-sns-sqs-lambda-firehose-s3-topic-5d62e6b5.fifo"],
    }),
  },
];
