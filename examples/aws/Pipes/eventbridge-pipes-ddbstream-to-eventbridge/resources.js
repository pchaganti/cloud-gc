// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "EventBus",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Name: "MyPipesEventBus",
    }),
  },
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "Users",
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      StreamSpecification: {
        StreamEnabled: true,
        StreamViewType: "NEW_AND_OLD_IMAGES",
      },
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config, getId }) => ({
      RoleName: "sam-app-PipeRole-W0IDLUZJUHHT",
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
                  "dynamodb:DescribeStream",
                  "dynamodb:GetRecords",
                  "dynamodb:GetShardIterator",
                  "dynamodb:ListStreams",
                ],
                Effect: "Allow",
                Resource: `${getId({
                  type: "Table",
                  group: "DynamoDB",
                  name: "Users",
                  path: "live.LatestStreamArn",
                })}`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "SourcePolicy",
        },
        {
          PolicyDocument: {
            Statement: [
              {
                Action: ["events:PutEvents"],
                Effect: "Allow",
                Resource: `arn:aws:events:${
                  config.region
                }:${config.accountId()}:event-bus/MyPipesEventBus`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "TargetPolicy",
        },
      ],
    }),
    dependencies: ({}) => ({
      dynamoDbTables: ["Users"],
    }),
  },
  {
    type: "Pipe",
    group: "Pipes",
    properties: ({ config }) => ({
      Description: "Pipe to connect DDB stream to EventBridge event bus",
      Name: "ddb-to-eventbridge",
      SourceParameters: {
        DynamoDBStreamParameters: {
          BatchSize: 1,
          DeadLetterConfig: {
            Arn: `arn:aws:sqs:${
              config.region
            }:${config.accountId()}:sam-app-PipeDLQueue-BobTOkbMXDso`,
          },
          StartingPosition: "LATEST",
        },
      },
      TargetParameters: {
        EventBridgeEventBusParameters: {
          DetailType: "UserDetailsChanged",
          Source: "myapp.users",
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "sam-app-PipeRole-W0IDLUZJUHHT",
      sourceDynamoDB: "Users",
      sqsQueueDeadLetter: "sam-app-PipeDLQueue-BobTOkbMXDso",
      targetCloudWatchEventsEventBus: "MyPipesEventBus",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "sam-app-PipeDLQueue-BobTOkbMXDso",
    }),
  },
];
