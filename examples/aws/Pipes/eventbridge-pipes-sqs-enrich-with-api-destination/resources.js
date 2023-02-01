// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "ApiDestination",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      HttpMethod: "GET",
      InvocationEndpoint: "https://api.zippopotam.us/us/*",
      InvocationRateLimitPerSecond: 10,
      Name: "MyWebhookTest",
    }),
    dependencies: ({}) => ({
      connection: "MyConnection-v2tEYU29RuDM",
    }),
  },
  {
    type: "Connection",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      AuthParameters: {
        ApiKeyAuthParameters: {
          ApiKeyName: "MyWebhook",
          ApiKeyValue: process.env.MY_CONNECTION_V2T_EYU29_RU_DM_API_KEY_VALUE,
        },
      },
      AuthorizationType: "API_KEY",
      Description: "My connection with an API key",
      Name: "MyConnection-v2tEYU29RuDM",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "sqs-pipes-api-logs",
      retentionInDays: 7,
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config, getId }) => ({
      RoleName: "sam-app-EventBridgePipesRole-11Q90EJXBH31D",
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
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents",
                ],
                Resource: `arn:aws:logs:${
                  config.region
                }:${config.accountId()}:log-group:sqs-pipes-api-logs:*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "CloudWatchLogs",
        },
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["events:InvokeApiDestination"],
                Resource: `${getId({
                  type: "ApiDestination",
                  group: "CloudWatchEvents",
                  name: "MyWebhookTest",
                })}`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "InvokeApiDest",
        },
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "sqs:ReceiveMessage",
                  "sqs:DeleteMessage",
                  "sqs:GetQueueAttributes",
                ],
                Resource: `arn:aws:sqs:${
                  config.region
                }:${config.accountId()}:sam-app-SourceQueue-ncHASMZwgjNq`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "ReadSQS",
        },
      ],
    }),
  },
  {
    type: "Pipe",
    group: "Pipes",
    properties: ({}) => ({
      EnrichmentParameters: {
        HttpParameters: {
          PathParameterValues: ["$.body.zip"],
        },
      },
      Name: "SqsToApiDestination",
      SourceParameters: {
        SqsQueueParameters: {
          BatchSize: 1,
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "sam-app-EventBridgePipesRole-11Q90EJXBH31D",
      sourceSQSQueue: "sam-app-SourceQueue-ncHASMZwgjNq",
      enrichmentCloudWatchEventsApiDestination: "MyWebhookTest",
      destinationCloudWatchLogGroup: "sqs-pipes-api-logs",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "sam-app-SourceQueue-ncHASMZwgjNq",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "sam-app-SourceQueueDLQ-ub8Wm1f28Dha",
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
      sqsQueue: "sam-app-SourceQueue-ncHASMZwgjNq",
      sqsDeadLetterQueue: "sam-app-SourceQueueDLQ-ub8Wm1f28Dha",
    }),
  },
];
