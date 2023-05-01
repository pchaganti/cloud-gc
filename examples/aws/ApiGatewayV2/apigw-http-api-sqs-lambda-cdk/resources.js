// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      CorsConfiguration: {
        AllowCredentials: false,
        AllowHeaders: ["*"],
        AllowMethods: ["GET", "POST", "PUT", "DELETE"],
        AllowOrigins: ["*"],
        MaxAge: 43200,
      },
      Name: "HttpToSqs",
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Description:
        "Automatic deployment triggered by changes to the Api configuration",
      AutoDeployed: true,
    }),
    dependencies: ({}) => ({
      api: "HttpToSqs",
      stage: "HttpToSqs::$default",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({ config }) => ({
      ConnectionType: "INTERNET",
      IntegrationSubtype: "SQS-SendMessage",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "1.0",
      RequestParameters: {
        MessageBody: "$request.body.MessageBody",
        QueueUrl: `https://sqs.${
          config.region
        }.amazonaws.com/${config.accountId()}/ApigwHttpApiSqsLambdaStack-ApigwV2SqsLambdaQueue60DA20A7-u0KdXdwrt4es`,
      },
    }),
    dependencies: ({}) => ({
      api: "HttpToSqs",
      role: "ApigwHttpApiSqsLambdaStac-ApiGwV2ToSqsRole230A72FB-DSMDY5EKTBRF",
      sqsQueue:
        "ApigwHttpApiSqsLambdaStack-ApigwV2SqsLambdaQueue60DA20A7-u0KdXdwrt4es",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteKey: "POST /send",
    }),
    dependencies: ({}) => ({
      api: "HttpToSqs",
      integration:
        "integration::HttpToSqs::ApigwHttpApiSqsLambdaStack-ApigwV2SqsLambdaQueue60DA20A7-u0KdXdwrt4es",
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      AutoDeploy: true,
      StageName: "$default",
    }),
    dependencies: ({}) => ({
      api: "HttpToSqs",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName:
        "ApigwHttpApiSqsLambdaStac-ApiGwV2ToSqsRole230A72FB-DSMDY5EKTBRF",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "apigateway.amazonaws.com",
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
                  "sqs:SendMessage",
                  "sqs:ReceiveMessage",
                  "sqs:PurgeQueue",
                  "sqs:DeleteMessage",
                ],
                Effect: "Allow",
                Resource: `arn:aws:sqs:${
                  config.region
                }:${config.accountId()}:ApigwHttpApiSqsLambdaStack-ApigwV2SqsLambdaQueue60DA20A7-u0KdXdwrt4es`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "ApiGwV2ToSqsInlinePolicyED3DFF22",
        },
      ],
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
        "ApigwHttpApiSqsLambdaStac-SqsMessageHandlerService-H5VSPLLD36UB",
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
                }:${config.accountId()}:ApigwHttpApiSqsLambdaStack-ApigwV2SqsLambdaQueue60DA20A7-u0KdXdwrt4es`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "SqsMessageHandlerServiceRoleDefaultPolicyBA193A36",
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
        "ApigwHttpApiSqsLambdaStac-SqsMessageHandlerE373F75-y85OnXm16stq",
      sqsQueue:
        "ApigwHttpApiSqsLambdaStack-ApigwV2SqsLambdaQueue60DA20A7-u0KdXdwrt4es",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ config }) => ({
      Configuration: {
        Environment: {
          Variables: {
            ACCOUNT_ID: `${config.accountId()}`,
            REGION: `${config.region}`,
          },
        },
        FunctionName:
          "ApigwHttpApiSqsLambdaStac-SqsMessageHandlerE373F75-y85OnXm16stq",
        Handler: "app.handler",
        Runtime: "python3.8",
        Timeout: 180,
      },
    }),
    dependencies: ({}) => ({
      role: "ApigwHttpApiSqsLambdaStac-SqsMessageHandlerService-H5VSPLLD36UB",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      Attributes: {
        VisibilityTimeout: "300",
      },
      QueueName:
        "ApigwHttpApiSqsLambdaStack-ApigwV2SqsLambdaQueue60DA20A7-u0KdXdwrt4es",
    }),
  },
];
