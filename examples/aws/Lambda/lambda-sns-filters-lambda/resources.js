// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "LambdaSNSFiltersLambdaSta-ConsumerAllFunctionServi-BFMF3HZQSVS4",
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
    properties: ({}) => ({
      RoleName:
        "LambdaSNSFiltersLambdaSta-ConsumerRedFunctionServi-1XWOHDWSDOTBO",
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
        "LambdaSNSFiltersLambdaSta-SenderFunctionServiceRol-4MUE5FV98RX",
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
                Action: "sns:Publish",
                Effect: "Allow",
                Resource: `arn:aws:sns:${
                  config.region
                }:${config.accountId()}:LambdaSNSFiltersLambdaStack-SNSTopicBCCC5DD8-UaEWb1UkFPpL`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "SenderFunctionServiceRoleDefaultPolicy06C14206",
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
        FunctionName:
          "LambdaSNSFiltersLambdaSta-ConsumerAllFunctionE7B9A-OCRphOAW6tVQ",
        Handler: "consumer.handler",
        Runtime: "nodejs16.x",
      },
    }),
    dependencies: ({}) => ({
      role: "LambdaSNSFiltersLambdaSta-ConsumerAllFunctionServi-BFMF3HZQSVS4",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName:
          "LambdaSNSFiltersLambdaSta-ConsumerRedFunction02912-5MU7iT8MlodZ",
        Handler: "consumerRed.handler",
        Runtime: "nodejs16.x",
      },
    }),
    dependencies: ({}) => ({
      role: "LambdaSNSFiltersLambdaSta-ConsumerRedFunctionServi-1XWOHDWSDOTBO",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ config }) => ({
      Configuration: {
        Environment: {
          Variables: {
            TOPIC_ARN: `arn:aws:sns:${
              config.region
            }:${config.accountId()}:LambdaSNSFiltersLambdaStack-SNSTopicBCCC5DD8-UaEWb1UkFPpL`,
          },
        },
        FunctionName:
          "LambdaSNSFiltersLambdaStack-SenderFunction5DD1AB71-WGFXHhVyVLi7",
        Handler: "senderFilter.handler",
        Runtime: "nodejs16.x",
      },
    }),
    dependencies: ({}) => ({
      role: "LambdaSNSFiltersLambdaSta-SenderFunctionServiceRol-4MUE5FV98RX",
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
            "LambdaSNSFiltersLambdaSta-ConsumerAllFunctionE7B9A-OCRphOAW6tVQ",
          Principal: "sns.amazonaws.com",
          SourceArn: `arn:aws:sns:${
            config.region
          }:${config.accountId()}:LambdaSNSFiltersLambdaStack-SNSTopicBCCC5DD8-UaEWb1UkFPpL`,
          StatementId:
            "LambdaSNSFiltersLambdaStack-ConsumerAllFunctionAllowInvokeLambdaSNSFiltersLambdaStackS-ZUN0SBMZP1TA",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction:
        "LambdaSNSFiltersLambdaSta-ConsumerAllFunctionE7B9A-OCRphOAW6tVQ",
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
            "LambdaSNSFiltersLambdaSta-ConsumerRedFunction02912-5MU7iT8MlodZ",
          Principal: "sns.amazonaws.com",
          SourceArn: `arn:aws:sns:${
            config.region
          }:${config.accountId()}:LambdaSNSFiltersLambdaStack-SNSTopicBCCC5DD8-UaEWb1UkFPpL`,
          StatementId:
            "LambdaSNSFiltersLambdaStack-ConsumerRedFunctionAllowInvokeLambdaSNSFiltersLambdaStackS-114DRKOGP9U8Y",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction:
        "LambdaSNSFiltersLambdaSta-ConsumerRedFunction02912-5MU7iT8MlodZ",
    }),
  },
  {
    type: "Topic",
    group: "SNS",
    name: "LambdaSNSFiltersLambdaStack-SNSTopicBCCC5DD8-UaEWb1UkFPpL",
    properties: ({}) => ({
      Attributes: {
        DisplayName: "Lambda subscription topic",
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
      snsTopic: "LambdaSNSFiltersLambdaStack-SNSTopicBCCC5DD8-UaEWb1UkFPpL",
      lambdaFunction:
        "LambdaSNSFiltersLambdaSta-ConsumerAllFunctionE7B9A-OCRphOAW6tVQ",
    }),
  },
  {
    type: "Subscription",
    group: "SNS",
    properties: ({}) => ({
      Attributes: {
        FilterPolicy: {
          color: ["red"],
        },
        FilterPolicyScope: "MessageAttributes",
      },
    }),
    dependencies: ({}) => ({
      snsTopic: "LambdaSNSFiltersLambdaStack-SNSTopicBCCC5DD8-UaEWb1UkFPpL",
      lambdaFunction:
        "LambdaSNSFiltersLambdaSta-ConsumerRedFunction02912-5MU7iT8MlodZ",
    }),
  },
];
