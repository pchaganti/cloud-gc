// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Description:
        "An Amazon API Gateway WebSocket API and an AWS Lambda function.",
      Name: "sam-app",
      ProtocolType: "WEBSOCKET",
      RouteSelectionExpression: "$request.body.action",
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    dependencies: ({}) => ({
      api: "sam-app",
      stage: "sam-app::prod",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      Description: "OnConnect Integration",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PassthroughBehavior: "WHEN_NO_MATCH",
      PayloadFormatVersion: "1.0",
      TimeoutInMillis: 29000,
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      lambdaFunction: "sam-app-onconnect-function",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      Description: "OnDisconnect Integration",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PassthroughBehavior: "WHEN_NO_MATCH",
      PayloadFormatVersion: "1.0",
      TimeoutInMillis: 29000,
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      lambdaFunction: "sam-app-ondisconnect-function",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      Description: "Post Integration",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PassthroughBehavior: "WHEN_NO_MATCH",
      PayloadFormatVersion: "1.0",
      TimeoutInMillis: 29000,
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      lambdaFunction: "sam-app-post-function",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      OperationName: "OnConnectRoute",
      RouteKey: "$connect",
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      integration: "integration::sam-app::sam-app-onconnect-function",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      OperationName: "OnDisconnectRoute",
      RouteKey: "$disconnect",
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      integration: "integration::sam-app::sam-app-ondisconnect-function",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      OperationName: "PostRoute",
      RouteKey: "post",
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      integration: "integration::sam-app::sam-app-post-function",
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      DefaultRouteSettings: {
        DataTraceEnabled: false,
        LoggingLevel: "OFF",
      },
      Description: "Prod Stage",
      StageName: "prod",
    }),
    dependencies: ({}) => ({
      api: "sam-app",
    }),
  },
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "sam-app-websocket_connections",
      AttributeDefinitions: [
        {
          AttributeName: "connectionId",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "connectionId",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-OnConnectLambdaFunctionRole-JVP4H9R01OWU",
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
                  "dynamodb:GetItem",
                  "dynamodb:DeleteItem",
                  "dynamodb:PutItem",
                  "dynamodb:Scan",
                  "dynamodb:Query",
                  "dynamodb:UpdateItem",
                  "dynamodb:BatchWriteItem",
                  "dynamodb:BatchGetItem",
                  "dynamodb:DescribeTable",
                  "dynamodb:ConditionCheckItem",
                ],
                Effect: "Allow",
                Resource: [
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-websocket_connections`,
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-websocket_connections/index/*`,
                ],
              },
            ],
          },
          PolicyName: "OnConnectLambdaFunctionRolePolicy0",
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
      RoleName: "sam-app-OnDisconnectLambdaFunctionRole-1MKK06XQ6QZWM",
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
                  "dynamodb:GetItem",
                  "dynamodb:DeleteItem",
                  "dynamodb:PutItem",
                  "dynamodb:Scan",
                  "dynamodb:Query",
                  "dynamodb:UpdateItem",
                  "dynamodb:BatchWriteItem",
                  "dynamodb:BatchGetItem",
                  "dynamodb:DescribeTable",
                  "dynamodb:ConditionCheckItem",
                ],
                Effect: "Allow",
                Resource: [
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-websocket_connections`,
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-websocket_connections/index/*`,
                ],
              },
            ],
          },
          PolicyName: "OnDisconnectLambdaFunctionRolePolicy0",
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
    properties: ({ config, getId }) => ({
      RoleName: "sam-app-PostLambdaFunctionRole-1K0THTSGHQ5HT",
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
                  "dynamodb:GetItem",
                  "dynamodb:DeleteItem",
                  "dynamodb:PutItem",
                  "dynamodb:Scan",
                  "dynamodb:Query",
                  "dynamodb:UpdateItem",
                  "dynamodb:BatchWriteItem",
                  "dynamodb:BatchGetItem",
                  "dynamodb:DescribeTable",
                  "dynamodb:ConditionCheckItem",
                ],
                Effect: "Allow",
                Resource: [
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-websocket_connections`,
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-websocket_connections/index/*`,
                ],
              },
            ],
          },
          PolicyName: "PostLambdaFunctionRolePolicy0",
        },
        {
          PolicyDocument: {
            Statement: [
              {
                Action: ["execute-api:ManageConnections"],
                Effect: "Allow",
                Resource: [
                  `${getId({
                    type: "Api",
                    group: "ApiGatewayV2",
                    name: "sam-app",
                    path: "live.ArnV2",
                  })}/*`,
                ],
              },
            ],
          },
          PolicyName: "PostLambdaFunctionRolePolicy1",
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
    dependencies: ({}) => ({
      apiGatewayV2Apis: ["sam-app"],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            TABLE_NAME: "sam-app-websocket_connections",
          },
        },
        FunctionName: "sam-app-onconnect-function",
        Handler: "onconnect.handler",
        MemorySize: 256,
        Runtime: "nodejs14.x",
        Timeout: 15,
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-OnConnectLambdaFunctionRole-JVP4H9R01OWU",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            TABLE_NAME: "sam-app-websocket_connections",
          },
        },
        FunctionName: "sam-app-ondisconnect-function",
        Handler: "ondisconnect.handler",
        MemorySize: 256,
        Runtime: "nodejs14.x",
        Timeout: 15,
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-OnDisconnectLambdaFunctionRole-1MKK06XQ6QZWM",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            TABLE_NAME: "sam-app-websocket_connections",
          },
        },
        FunctionName: "sam-app-post-function",
        Handler: "post.handler",
        MemorySize: 256,
        Runtime: "nodejs14.x",
        Timeout: 15,
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-PostLambdaFunctionRole-1K0THTSGHQ5HT",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-onconnect-function",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "Api",
            group: "ApiGatewayV2",
            name: "sam-app",
            path: "live.ArnV2",
          })}/*`,
          StatementId:
            "sam-app-OnConnectFunctionResourcePermission-R1AMDRNUZVVW",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-onconnect-function",
      apiGatewayV2Apis: ["sam-app"],
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-ondisconnect-function",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "Api",
            group: "ApiGatewayV2",
            name: "sam-app",
            path: "live.ArnV2",
          })}/*`,
          StatementId:
            "sam-app-OnDisconnectFunctionResourcePermission-XCAB2M1W299T",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-ondisconnect-function",
      apiGatewayV2Apis: ["sam-app"],
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-post-function",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "Api",
            group: "ApiGatewayV2",
            name: "sam-app",
            path: "live.ArnV2",
          })}/*`,
          StatementId: "sam-app-PostFunctionResourcePermission-NHMFH7IDB7JO",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-post-function",
      apiGatewayV2Apis: ["sam-app"],
    }),
  },
];
