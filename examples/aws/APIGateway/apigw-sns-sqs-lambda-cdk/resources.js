// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Account",
    group: "APIGateway",
    dependencies: ({}) => ({
      cloudwatchRole:
        "CdkApigwSnsSqsLambdaStack-RestApiCloudWatchRoleE3E-16T4PBS8JC1QB",
    }),
  },
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      name: "RestApi",
      schema: {
        openapi: "3.0.1",
        info: {
          title: "RestApi",
          version: "1",
        },
        paths: {
          "/": {
            post: {
              parameters: [
                {
                  name: "Content-Type",
                  in: "header",
                  required: true,
                  schema: {
                    type: "string",
                  },
                },
              ],
              responses: {
                200: {
                  description: "200 response",
                },
                400: {
                  description: "400 response",
                },
              },
              "x-amazon-apigateway-integration": {
                credentials: `arn:aws:iam::${config.accountId()}:role/CdkApigwSnsSqsLambdaStack-GatewayExecutionRole16B5-1SKXUSE3EULAH`,
                httpMethod: "POST",
                passthroughBehavior: "NEVER",
                requestParameters: {
                  "integration.request.header.Content-Type":
                    "'application/x-www-form-urlencoded'",
                },
                requestTemplates: {
                  "application/json": `Action=Publish&TopicArn=$util.urlEncode('arn:aws:sns:${
                    config.region
                  }:${config.accountId()}:CdkApigwSnsSqsLambdaStack-topic69831491-vgMzreNVdE37')&Message=$util.urlEncode($input.body)`,
                },
                type: "AWS",
                uri: `arn:aws:apigateway:${
                  config.region
                }:sns:path/${config.accountId()}/CdkApigwSnsSqsLambdaStack-topic69831491-vgMzreNVdE37`,
                responses: {
                  default: {
                    responseTemplates: {
                      "application/json":
                        '{"status": "message added to topic"}',
                    },
                    statusCode: "200",
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            Empty: {
              title: "Empty Schema",
              type: "object",
            },
            Error: {
              title: "Error Schema",
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      deployment: {
        stageName: "prod",
      },
    }),
    dependencies: ({}) => ({
      roles: [
        "CdkApigwSnsSqsLambdaStack-GatewayExecutionRole16B5-1SKXUSE3EULAH",
      ],
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "prod",
    }),
    dependencies: ({}) => ({
      restApi: "RestApi",
      account: "default",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName:
        "CdkApigwSnsSqsLambdaStack-GatewayExecutionRole16B5-1SKXUSE3EULAH",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "apigateway.amazonaws.com",
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
                Action: "sns:Publish",
                Effect: "Allow",
                Resource: `arn:aws:sns:${
                  config.region
                }:${config.accountId()}:CdkApigwSnsSqsLambdaStack-topic69831491-vgMzreNVdE37`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "PublishMessagePolicy",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "CdkApigwSnsSqsLambdaStack-RestApiCloudWatchRoleE3E-16T4PBS8JC1QB",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "apigateway.amazonaws.com",
            },
          },
        ],
        Version: "2012-10-17",
      },
      AttachedPolicies: [
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs",
          PolicyName: "AmazonAPIGatewayPushToCloudWatchLogs",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName:
        "CdkApigwSnsSqsLambdaStack-workerLambdaTypeOneHandl-1PCFAO2SNO4HO",
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
                  "sqs:ReceiveMessage",
                  "sqs:ChangeMessageVisibility",
                  "sqs:GetQueueUrl",
                  "sqs:DeleteMessage",
                  "sqs:GetQueueAttributes",
                ],
                Effect: "Allow",
                Resource: `arn:aws:sqs:${
                  config.region
                }:${config.accountId()}:CdkApigwSnsSqsLambdaStack-SubscriberQueueOne2F3DD46E-6C5ZXYtstbZx`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName:
            "workerLambdaTypeOneHandlerServiceRoleDefaultPolicy78D488E3",
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
      RoleName:
        "CdkApigwSnsSqsLambdaStack-workerLambdaTypeTwoHandl-19SGRUJJBHV9C",
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
                  "sqs:ReceiveMessage",
                  "sqs:ChangeMessageVisibility",
                  "sqs:GetQueueUrl",
                  "sqs:DeleteMessage",
                  "sqs:GetQueueAttributes",
                ],
                Effect: "Allow",
                Resource: `arn:aws:sqs:${
                  config.region
                }:${config.accountId()}:CdkApigwSnsSqsLambdaStack-SubscriberQueueTwo43B9D9F1-KiJCjrQeHx5a`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName:
            "workerLambdaTypeTwoHandlerServiceRoleDefaultPolicy2CED2609",
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
    type: "EventSourceMapping",
    group: "Lambda",
    dependencies: ({}) => ({
      lambdaFunction:
        "CdkApigwSnsSqsLambdaStack-workerLambdaTypeOneHandl-xcfkwdjaVe3q",
      sqsQueue:
        "CdkApigwSnsSqsLambdaStack-SubscriberQueueOne2F3DD46E-6C5ZXYtstbZx",
    }),
  },
  {
    type: "EventSourceMapping",
    group: "Lambda",
    dependencies: ({}) => ({
      lambdaFunction:
        "CdkApigwSnsSqsLambdaStack-workerLambdaTypeTwoHandl-GW4XepS4cqU6",
      sqsQueue:
        "CdkApigwSnsSqsLambdaStack-SubscriberQueueTwo43B9D9F1-KiJCjrQeHx5a",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName:
          "CdkApigwSnsSqsLambdaStack-workerLambdaTypeOneHandl-xcfkwdjaVe3q",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "CdkApigwSnsSqsLambdaStack-workerLambdaTypeOneHandl-1PCFAO2SNO4HO",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName:
          "CdkApigwSnsSqsLambdaStack-workerLambdaTypeTwoHandl-GW4XepS4cqU6",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "CdkApigwSnsSqsLambdaStack-workerLambdaTypeTwoHandl-19SGRUJJBHV9C",
    }),
  },
  {
    type: "Topic",
    group: "SNS",
    name: "CdkApigwSnsSqsLambdaStack-topic69831491-vgMzreNVdE37",
  },
  {
    type: "Subscription",
    group: "SNS",
    properties: ({}) => ({
      Attributes: {},
    }),
    dependencies: ({}) => ({
      snsTopic: "CdkApigwSnsSqsLambdaStack-topic69831491-vgMzreNVdE37",
      sqsQueue:
        "CdkApigwSnsSqsLambdaStack-SubscriberQueueOne2F3DD46E-6C5ZXYtstbZx",
    }),
  },
  {
    type: "Subscription",
    group: "SNS",
    properties: ({}) => ({
      Attributes: {},
    }),
    dependencies: ({}) => ({
      snsTopic: "CdkApigwSnsSqsLambdaStack-topic69831491-vgMzreNVdE37",
      sqsQueue:
        "CdkApigwSnsSqsLambdaStack-SubscriberQueueTwo43B9D9F1-KiJCjrQeHx5a",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({ config }) => ({
      Attributes: {
        Policy: {
          Statement: [
            {
              Action: "sqs:SendMessage",
              Condition: {
                ArnEquals: {
                  "aws:SourceArn": `arn:aws:sns:${
                    config.region
                  }:${config.accountId()}:CdkApigwSnsSqsLambdaStack-topic69831491-vgMzreNVdE37`,
                },
              },
              Effect: "Allow",
              Principal: {
                Service: "sns.amazonaws.com",
              },
              Resource: `arn:aws:sqs:${
                config.region
              }:${config.accountId()}:CdkApigwSnsSqsLambdaStack-SubscriberQueueOne2F3DD46E-6C5ZXYtstbZx`,
            },
          ],
          Version: "2012-10-17",
        },
      },
      QueueName:
        "CdkApigwSnsSqsLambdaStack-SubscriberQueueOne2F3DD46E-6C5ZXYtstbZx",
    }),
    dependencies: ({}) => ({
      snsTopics: ["CdkApigwSnsSqsLambdaStack-topic69831491-vgMzreNVdE37"],
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({ config }) => ({
      Attributes: {
        Policy: {
          Statement: [
            {
              Action: "sqs:SendMessage",
              Condition: {
                ArnEquals: {
                  "aws:SourceArn": `arn:aws:sns:${
                    config.region
                  }:${config.accountId()}:CdkApigwSnsSqsLambdaStack-topic69831491-vgMzreNVdE37`,
                },
              },
              Effect: "Allow",
              Principal: {
                Service: "sns.amazonaws.com",
              },
              Resource: `arn:aws:sqs:${
                config.region
              }:${config.accountId()}:CdkApigwSnsSqsLambdaStack-SubscriberQueueTwo43B9D9F1-KiJCjrQeHx5a`,
            },
          ],
          Version: "2012-10-17",
        },
      },
      QueueName:
        "CdkApigwSnsSqsLambdaStack-SubscriberQueueTwo43B9D9F1-KiJCjrQeHx5a",
    }),
    dependencies: ({}) => ({
      snsTopics: ["CdkApigwSnsSqsLambdaStack-topic69831491-vgMzreNVdE37"],
    }),
  },
];
