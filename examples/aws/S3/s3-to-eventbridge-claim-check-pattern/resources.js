// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "EventBus",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Name: "InsuranceBus",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Description: "Listen to claim created",
      EventPattern: {
        "detail-type": ["ClaimCreated"],
      },
      Name: "S3ToEventbridgeAutomaticC-ClaimCreatedRule7993777D-1SSTK2RTTBD6D",
    }),
    dependencies: ({}) => ({
      eventBus: "InsuranceBus",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Description: "Listen to claim processed event",
      EventPattern: {
        "detail-type": ["ClaimProcessed"],
      },
      Name: "S3ToEventbridgeAutomaticC-ClaimProcessedRule30BA4E-4FIVENW3KGLN",
    }),
    dependencies: ({}) => ({
      eventBus: "InsuranceBus",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Description: "Transform all s3 events from claims",
      EventPattern: {
        "detail-type": ["Object Created", "Object Deleted"],
        source: ["aws.s3"],
        detail: {
          object: {
            key: [
              {
                prefix: "claims/",
              },
            ],
          },
        },
      },
      Name: "S3ToEventbridgeAutomaticCl-transformerRuleA9C7F670-90MTEUM3NK6N",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "Target0",
    }),
    dependencies: ({}) => ({
      rule: "S3ToEventbridgeAutomaticC-ClaimCreatedRule7993777D-1SSTK2RTTBD6D",
      lambdaFunction:
        "S3ToEventbridgeAutomaticC-claimCreatedConsumerF249-zzvbLLb9J5Jc",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "Target0",
    }),
    dependencies: ({}) => ({
      rule: "S3ToEventbridgeAutomaticC-ClaimProcessedRule30BA4E-4FIVENW3KGLN",
      lambdaFunction:
        "S3ToEventbridgeAutomaticC-claimProcessedConsumer93-mbjgNObJbZRW",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "Target0",
    }),
    dependencies: ({}) => ({
      rule: "S3ToEventbridgeAutomaticCl-transformerRuleA9C7F670-90MTEUM3NK6N",
      lambdaFunction:
        "S3ToEventbridgeAutomaticC-transformerFunction62C75-RE6hsRaDaXFG",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "S3ToEventbridgeAutomaticC-BucketNotificationsHandl-YEDVEE05JW53",
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
            Version: "2012-10-17",
            Statement: [
              {
                Action: "s3:PutBucketNotification",
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName:
            "BucketNotificationsHandler050a0587b7544547bf325f094a3db834RoleDefaultPolicy2CF63D36",
        },
      ],
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
    properties: ({}) => ({
      RoleName:
        "S3ToEventbridgeAutomaticC-claimCreatedConsumerServ-Z6J02F0VON90",
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
    properties: ({}) => ({
      RoleName:
        "S3ToEventbridgeAutomaticC-claimProcessedConsumerSe-WS0DPO267LL",
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
    properties: ({ config }) => ({
      RoleName:
        "S3ToEventbridgeAutomaticC-transformerFunctionServi-1K38IHKSH3X1F",
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
            Version: "2012-10-17",
            Statement: [
              {
                Action: "events:PutEvents",
                Resource: `arn:aws:events:${
                  config.region
                }:${config.accountId()}:event-bus/InsuranceBus`,
                Effect: "Allow",
              },
              {
                Action: ["s3:GetBucket*", "s3:GetObject*", "s3:List*"],
                Resource: [
                  "arn:aws:s3:::s3toeventbridgeautomaticclai-claimsbucket658066ed-3i3cbs1ekbkq",
                  "arn:aws:s3:::s3toeventbridgeautomaticclai-claimsbucket658066ed-3i3cbs1ekbkq/*",
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "transformerFunctionServiceRoleDefaultPolicy279AC676",
        },
      ],
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
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Description:
          'AWS CloudFormation handler for "Custom::S3BucketNotifications" resources (@aws-cdk/aws-s3)',
        FunctionName:
          "S3ToEventbridgeAutomaticC-BucketNotificationsHandl-gXmghdI0jBas",
        Handler: "index.handler",
        Runtime: "python3.7",
        Timeout: 300,
      },
    }),
    dependencies: ({}) => ({
      role: "S3ToEventbridgeAutomaticC-BucketNotificationsHandl-YEDVEE05JW53",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
          },
        },
        FunctionName:
          "S3ToEventbridgeAutomaticC-claimCreatedConsumerF249-zzvbLLb9J5Jc",
        Handler: "index.handler",
        MemorySize: 1024,
        Runtime: "nodejs16.x",
        Timeout: 5,
      },
    }),
    dependencies: ({}) => ({
      role: "S3ToEventbridgeAutomaticC-claimCreatedConsumerServ-Z6J02F0VON90",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
          },
        },
        FunctionName:
          "S3ToEventbridgeAutomaticC-claimProcessedConsumer93-mbjgNObJbZRW",
        Handler: "index.handler",
        MemorySize: 1024,
        Runtime: "nodejs16.x",
        Timeout: 5,
      },
    }),
    dependencies: ({}) => ({
      role: "S3ToEventbridgeAutomaticC-claimProcessedConsumerSe-WS0DPO267LL",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            EVENT_BUS_NAME: "InsuranceBus",
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
          },
        },
        FunctionName:
          "S3ToEventbridgeAutomaticC-transformerFunction62C75-RE6hsRaDaXFG",
        Handler: "index.handler",
        MemorySize: 1024,
        Runtime: "nodejs16.x",
        Timeout: 5,
      },
    }),
    dependencies: ({}) => ({
      role: "S3ToEventbridgeAutomaticC-transformerFunctionServi-1K38IHKSH3X1F",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ config }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName:
            "S3ToEventbridgeAutomaticC-claimCreatedConsumerF249-zzvbLLb9J5Jc",
          Principal: "events.amazonaws.com",
          StatementId:
            "S3ToEventbridgeAutomaticClaimCheckPatternSt-ClaimCreatedRuleAllowEventRuleS3ToEventbri-1EBW31M6A8RXU",
          SourceArn: `arn:aws:events:${
            config.region
          }:${config.accountId()}:rule/InsuranceBus/S3ToEventbridgeAutomaticC-ClaimCreatedRule7993777D-1SSTK2RTTBD6D`,
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction:
        "S3ToEventbridgeAutomaticC-claimCreatedConsumerF249-zzvbLLb9J5Jc",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ config }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName:
            "S3ToEventbridgeAutomaticC-claimProcessedConsumer93-mbjgNObJbZRW",
          Principal: "events.amazonaws.com",
          StatementId:
            "S3ToEventbridgeAutomaticClaimCheckPatternSt-ClaimProcessedRuleAllowEventRuleS3ToEventb-61H4MPRK25HB",
          SourceArn: `arn:aws:events:${
            config.region
          }:${config.accountId()}:rule/InsuranceBus/S3ToEventbridgeAutomaticC-ClaimProcessedRule30BA4E-4FIVENW3KGLN`,
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction:
        "S3ToEventbridgeAutomaticC-claimProcessedConsumer93-mbjgNObJbZRW",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ config }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName:
            "S3ToEventbridgeAutomaticC-transformerFunction62C75-RE6hsRaDaXFG",
          Principal: "events.amazonaws.com",
          StatementId:
            "S3ToEventbridgeAutomaticClaimCheckPatternSt-transformerRuleAllowEventRuleS3ToEventbrid-1AJ0AW7FUBJMJ",
          SourceArn: `arn:aws:events:${
            config.region
          }:${config.accountId()}:rule/S3ToEventbridgeAutomaticCl-transformerRuleA9C7F670-90MTEUM3NK6N`,
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction:
        "S3ToEventbridgeAutomaticC-transformerFunction62C75-RE6hsRaDaXFG",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "s3toeventbridgeautomaticclai-claimsbucket658066ed-3i3cbs1ekbkq",
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
          },
        ],
      },
      NotificationConfiguration: {
        EventBridgeConfiguration: {},
      },
    }),
  },
];
