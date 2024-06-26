// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Name: "sam-app-WebSocketApi",
      ProtocolType: "WEBSOCKET",
      RouteSelectionExpression: "$request.body.action",
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    dependencies: ({}) => ({
      api: "sam-app-WebSocketApi",
      stage: "sam-app-WebSocketApi::api",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({ config }) => ({
      ConnectionType: "INTERNET",
      IntegrationMethod: "POST",
      IntegrationResponseSelectionExpression:
        "${integration.response.statuscode}",
      IntegrationType: "AWS",
      IntegrationUri: `arn:aws:apigateway:${config.region}:dynamodb:action/DeleteItem`,
      PassthroughBehavior: "WHEN_NO_MATCH",
      PayloadFormatVersion: "1.0",
      RequestTemplates: {
        $default: `{ 
    "TableName": "sam-app-Sessions",
    "Key": {
  "connectionid": {
            "S": "$context.connectionId"
            }
    }
}
`,
      },
      TemplateSelectionExpression: "\\$default",
      TimeoutInMillis: 29000,
    }),
    dependencies: ({}) => ({
      api: "sam-app-WebSocketApi",
      role: "sam-app-SessionsTableAccessRole-RKP6XCC4WDQN",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({ config }) => ({
      ConnectionType: "INTERNET",
      IntegrationMethod: "POST",
      IntegrationResponseSelectionExpression:
        "${integration.response.statuscode}",
      IntegrationType: "AWS",
      IntegrationUri: `arn:aws:apigateway:${config.region}:dynamodb:action/PutItem`,
      PassthroughBehavior: "WHEN_NO_MATCH",
      PayloadFormatVersion: "1.0",
      RequestTemplates: {
        $default: `#set($ttl = $context.requestTimeEpoch + 86400) { 
    "TableName": "sam-app-Sessions",
    "Item": {
  "connectionid": {
            "S": "$context.connectionId"
            },
  "headers": {
            "S": "$input.params().get('header')"
            },
  "querystring": {
            "S": "$input.params().get('querystring')"
            },
  "ttl": {
            "N": "$ttl"
            }
    }
}
`,
      },
      TemplateSelectionExpression: "\\$default",
      TimeoutInMillis: 29000,
    }),
    dependencies: ({}) => ({
      api: "sam-app-WebSocketApi",
      role: "sam-app-SessionsTableAccessRole-RKP6XCC4WDQN",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PassthroughBehavior: "WHEN_NO_MATCH",
      PayloadFormatVersion: "1.0",
      TimeoutInMillis: 29000,
    }),
    dependencies: ({}) => ({
      api: "sam-app-WebSocketApi",
      lambdaFunction: "sam-app-DefaultRouteFunction-7n6DEEQGucp4",
    }),
  },
  {
    type: "IntegrationResponse",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      IntegrationResponseKey: "/200/",
      TemplateSelectionExpression: "\\$default",
    }),
    dependencies: ({ config }) => ({
      integration: `integration::sam-app-WebSocketApi::arn:aws:apigateway:${config.region}:dynamodb:action/DeleteItem`,
    }),
  },
  {
    type: "IntegrationResponse",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      IntegrationResponseKey: "/200/",
      TemplateSelectionExpression: "\\$default",
    }),
    dependencies: ({ config }) => ({
      integration: `integration::sam-app-WebSocketApi::arn:aws:apigateway:${config.region}:dynamodb:action/PutItem`,
    }),
  },
  {
    type: "IntegrationResponse",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      IntegrationResponseKey: "$default",
    }),
    dependencies: ({}) => ({
      integration:
        "integration::sam-app-WebSocketApi::sam-app-DefaultRouteFunction-7n6DEEQGucp4",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      OperationName: "ConnectRoute",
      RouteKey: "$connect",
    }),
    dependencies: ({ config }) => ({
      api: "sam-app-WebSocketApi",
      integration: `integration::sam-app-WebSocketApi::arn:aws:apigateway:${config.region}:dynamodb:action/PutItem`,
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      OperationName: "DefaultRoute",
      RouteKey: "$default",
    }),
    dependencies: ({}) => ({
      api: "sam-app-WebSocketApi",
      integration:
        "integration::sam-app-WebSocketApi::sam-app-DefaultRouteFunction-7n6DEEQGucp4",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      OperationName: "DisconnectRoute",
      RouteKey: "$disconnect",
    }),
    dependencies: ({ config }) => ({
      api: "sam-app-WebSocketApi",
      integration: `integration::sam-app-WebSocketApi::arn:aws:apigateway:${config.region}:dynamodb:action/DeleteItem`,
    }),
  },
  {
    type: "RouteResponse",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteResponseKey: "$default",
    }),
    dependencies: ({}) => ({
      route: "route::sam-app-WebSocketApi::$connect",
    }),
  },
  {
    type: "RouteResponse",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteResponseKey: "$default",
    }),
    dependencies: ({}) => ({
      route: "route::sam-app-WebSocketApi::$default",
    }),
  },
  {
    type: "RouteResponse",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteResponseKey: "$default",
    }),
    dependencies: ({}) => ({
      route: "route::sam-app-WebSocketApi::$disconnect",
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
      StageName: "api",
    }),
    dependencies: ({}) => ({
      api: "sam-app-WebSocketApi",
    }),
  },
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "sam-app-Sessions",
      AttributeDefinitions: [
        {
          AttributeName: "connectionid",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "connectionid",
          KeyType: "HASH",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-DefaultRouteFunctionRole-1RNBIXEOE8DGH",
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
      RoleName: "sam-app-SessionsTableAccessRole-RKP6XCC4WDQN",
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
                Action: ["dynamodb:DeleteItem", "dynamodb:PutItem"],
                Effect: "Allow",
                Resource: [
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-Sessions`,
                ],
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "DynamoDBAccess",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "sam-app-DefaultRouteFunction-7n6DEEQGucp4",
        Handler: "index.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-DefaultRouteFunctionRole-1RNBIXEOE8DGH",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({}) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-DefaultRouteFunction-7n6DEEQGucp4",
          Principal: "apigateway.amazonaws.com",
          StatementId: "sam-app-DefaultRouteFunctionPermission-1OG3BQQ43QDFF",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-DefaultRouteFunction-7n6DEEQGucp4",
    }),
  },
];
