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
      IntegrationUri: `arn:aws:apigateway:${config.region}:states:action/StartSyncExecution`,
      PassthroughBehavior: "WHEN_NO_MATCH",
      PayloadFormatVersion: "1.0",
      RequestTemplates: {
        $default: `#set($sfn_input=$util.escapeJavaScript($input.body).replaceAll("'","'")) { 
  "input": "$sfn_input",
  "stateMachineArn": "arn:aws:states:${
    config.region
  }:${config.accountId()}:stateMachine:SyncSFn-pN3JqWwqQJ60"
}
`,
      },
      TemplateSelectionExpression: "\\$default",
      TimeoutInMillis: 29000,
    }),
    dependencies: ({}) => ({
      api: "sam-app-WebSocketApi",
      role: "sam-app-StepFunctionsSyncExecutionRole-196375L2OVLO7",
    }),
  },
  {
    type: "IntegrationResponse",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      IntegrationResponseKey: "$default",
    }),
    dependencies: ({ config }) => ({
      integration: `integration::sam-app-WebSocketApi::arn:aws:apigateway:${config.region}:states:action/StartSyncExecution`,
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      OperationName: "DefaultRoute",
      RouteKey: "$default",
    }),
    dependencies: ({ config }) => ({
      api: "sam-app-WebSocketApi",
      integration: `integration::sam-app-WebSocketApi::arn:aws:apigateway:${config.region}:states:action/StartSyncExecution`,
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
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-StepFunctionsSyncExecutionRole-196375L2OVLO7",
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
                Action: ["states:StartSyncExecution"],
                Effect: "Allow",
                Resource: `arn:aws:states:${
                  config.region
                }:${config.accountId()}:stateMachine:SyncSFn-pN3JqWwqQJ60`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "StepFunctionsSyncExecution",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-SyncSFnRole-1QD6CF0EHAZNE",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "states.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({}) => ({
      definition: {
        Comment:
          "Sample Expess Workflow for Synchronous Execution by API Gateway",
        StartAt: "Wait for 3 Seconds",
        States: {
          "Wait for 3 Seconds": {
            End: true,
            Seconds: 3,
            Type: "Wait",
          },
        },
      },
      name: "SyncSFn-pN3JqWwqQJ60",
      tracingConfiguration: {
        enabled: true,
      },
      type: "EXPRESS",
    }),
    dependencies: ({}) => ({
      role: "sam-app-SyncSFnRole-1QD6CF0EHAZNE",
    }),
  },
];
