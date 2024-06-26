// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "DataSource",
    group: "AppSync",
    properties: ({}) => ({
      name: "SamStepFunctionsLambdaDirectResolver",
      type: "AWS_LAMBDA",
    }),
    dependencies: ({}) => ({
      graphqlApi: "SamStepFunctionsApi",
      serviceRole: "sam-app-AppSyncServiceRole-SVRP0GF12393",
      lambdaFunction: "sam-app-SamStepFunctionFunction-Xw0k7kc6dwJe",
    }),
  },
  {
    type: "GraphqlApi",
    group: "AppSync",
    properties: ({}) => ({
      name: "SamStepFunctionsApi",
      authenticationType: "API_KEY",
      xrayEnabled: true,
      logConfig: {
        excludeVerboseContent: false,
        fieldLogLevel: "ALL",
      },
      apiKeys: [{}],
      schemaFile: "SamStepFunctionsApi.graphql",
    }),
    dependencies: ({}) => ({
      cloudWatchLogsRole: "sam-app-RoleAppSyncCloudWatch-1QX3MJWO7NIQ4",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      fieldName: "addStepFunctionExecution",
      kind: "UNIT",
      typeName: "Mutation",
    }),
    dependencies: ({}) => ({
      dataSource: "SamStepFunctionsLambdaDirectResolver",
      graphqlApi: "SamStepFunctionsApi",
    }),
  },
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "sam-app-SamStepFunctionsTable-1O67WMRRPTIDD",
      AttributeDefinitions: [
        {
          AttributeName: "Id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "Id",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-AppSyncServiceRole-SVRP0GF12393",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "appsync.amazonaws.com",
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
                Action: "lambda:invokeFunction",
                Resource: [
                  `arn:aws:lambda:${
                    config.region
                  }:${config.accountId()}:function:sam-app-SamStepFunctionFunction-Xw0k7kc6dwJe`,
                ],
                Effect: "Allow",
              },
              {
                Action: "states:StartExecution",
                Resource: [
                  `arn:aws:states:${
                    config.region
                  }:${config.accountId()}:stateMachine:SamStepFunctionStateMachine-lfaxL8lndjSb`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "DirectAppSyncLambda",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-lambdaStepFunctionRole-1P92ECNW1QOVX",
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
                Action: "lambda:invokeFunction",
                Resource: [
                  `arn:aws:lambda:${
                    config.region
                  }:${config.accountId()}:function:sam-app-SamStepFunctionFunction-Xw0k7kc6dwJe`,
                ],
                Effect: "Allow",
              },
              {
                Action: "states:StartExecution",
                Resource: [
                  `arn:aws:states:${
                    config.region
                  }:${config.accountId()}:stateMachine:SamStepFunctionStateMachine-lfaxL8lndjSb`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "DirectAppSyncLambda",
        },
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["dynamodb:GetItem", "dynamodb:Query"],
                Resource: [
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-SamStepFunctionsTable-1O67WMRRPTIDD`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "DynamoDBReadPolicy",
        },
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "dynamodb:PutItem",
                  "dynamodb:UpdateItem",
                  "dynamodb:ConditionCheckItem",
                  "dynamodb:DeleteItem",
                ],
                Resource: [
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-SamStepFunctionsTable-1O67WMRRPTIDD`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "DynamoDBWritePolicy",
        },
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "xray:PutTraceSegments",
                  "xray:PutTelemetryRecords",
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents",
                ],
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "LambdaXRayPolicy",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-RoleAppSyncCloudWatch-1QX3MJWO7NIQ4",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "appsync.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSAppSyncPushToCloudWatchLogs",
          PolicyName: "AWSAppSyncPushToCloudWatchLogs",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-SamStepFunctionStateMachineRole-15QEGFRVJ5CQ3",
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
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  "dynamodb:PutItem",
                  "dynamodb:UpdateItem",
                  "dynamodb:BatchWriteItem",
                ],
                Resource: [
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-SamStepFunctionsTable-1O67WMRRPTIDD`,
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-SamStepFunctionsTable-1O67WMRRPTIDD/index/*`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "SamStepFunctionStateMachineRolePolicy0",
        },
        {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  "dynamodb:GetItem",
                  "dynamodb:Scan",
                  "dynamodb:Query",
                  "dynamodb:BatchGetItem",
                  "dynamodb:DescribeTable",
                ],
                Resource: [
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-SamStepFunctionsTable-1O67WMRRPTIDD`,
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-SamStepFunctionsTable-1O67WMRRPTIDD/index/*`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "SamStepFunctionStateMachineRolePolicy1",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-WorkflowExecutionRole-WM87YTOPGZ2D",
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
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: "events:PutEvents",
                Resource: `arn:aws:events:${
                  config.region
                }:${config.accountId()}:event-bus/sam-app-EventBus`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "AllowEventBridgePutEvents",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ config }) => ({
      Configuration: {
        Environment: {
          Variables: {
            STATE_MACHINE_ARN: `arn:aws:states:${
              config.region
            }:${config.accountId()}:stateMachine:SamStepFunctionStateMachine-lfaxL8lndjSb`,
          },
        },
        FunctionName: "sam-app-SamStepFunctionFunction-Xw0k7kc6dwJe",
        Handler: "app.lambda_handler",
        Runtime: "python3.8",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-lambdaStepFunctionRole-1P92ECNW1QOVX",
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({}) => ({
      definition: {
        StartAt: "SendCustomEvent",
        States: {
          SendCustomEvent: {
            End: true,
            Parameters: {
              Entries: [
                {
                  Detail: {
                    Message: "Hello from Step Functions!",
                  },
                  DetailType: "MyTestMessage",
                  EventBusName: "sam-app-EventBus",
                  Source: "MyTestApp",
                },
              ],
            },
            Resource: "arn:aws:states:::events:putEvents",
            Type: "Task",
          },
        },
      },
      name: "MyStateMachine-nfd2eDd0064T",
    }),
    dependencies: ({}) => ({
      role: "sam-app-WorkflowExecutionRole-WM87YTOPGZ2D",
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({}) => ({
      definition: {
        Comment:
          "This state machine updates the status of a booked transaction in the DB, waits for payment to be made and then updates again or passes",
        StartAt: "Change Apartment Status",
        States: {
          "Change Apartment Status": {
            Type: "Task",
            Resource: "arn:aws:states:::dynamodb:updateItem",
            Parameters: {
              TableName: "sam-app-SamStepFunctionsTable-1O67WMRRPTIDD",
              Key: {
                Id: {
                  "S.$": "$.details.accountId",
                },
              },
              ConditionExpression: "attribute_exists(Id)",
              UpdateExpression: "SET bookedStatus = :bookedStatus",
              ExpressionAttributeValues: {
                ":bookedStatus": {
                  "S.$": "$.details.bookedStatus",
                },
              },
            },
            Next: "Wait",
            ResultPath: "$.updateResult",
            Catch: [
              {
                ErrorEquals: ["States.ALL"],
                Comment: "Items Doesn't Exist",
                Next: "Fail",
                ResultPath: "$.updateError",
              },
            ],
          },
          Wait: {
            Type: "Wait",
            Seconds: 60,
            Next: "Get Booking Status",
          },
          "Get Booking Status": {
            Type: "Task",
            Resource: "arn:aws:states:::dynamodb:getItem",
            Parameters: {
              TableName: "sam-app-SamStepFunctionsTable-1O67WMRRPTIDD",
              Key: {
                id: {
                  "S.$": "$.details.accountId",
                },
              },
            },
            Next: "Has the Apartment been Paid ?",
            ResultPath: "$.getItem",
            Catch: [
              {
                ErrorEquals: ["States.ALL"],
                Comment: "Couldn't find item",
                Next: "Fail",
              },
            ],
          },
          "Has the Apartment been Paid ?": {
            Type: "Choice",
            Choices: [
              {
                And: [
                  {
                    Variable: "$.getItem.Item.Id.S",
                    StringEquals: "1234567",
                  },
                  {
                    Variable: "$.getItem.Item.bookedStatus.S",
                    StringEquals: "Paid",
                  },
                ],
                Next: "Apartment Paid",
              },
            ],
            Default: "Not Paid(Revert Apartment Status)",
          },
          "Not Paid(Revert Apartment Status)": {
            Type: "Task",
            Resource: "arn:aws:states:::dynamodb:updateItem",
            Parameters: {
              TableName: "sam-app-SamStepFunctionsTable-1O67WMRRPTIDD",
              Key: {
                Id: {
                  "S.$": "$.getItem.Item.Id.S",
                },
              },
              UpdateExpression: "SET bookedStatus = :bookedStatus",
              ExpressionAttributeValues: {
                ":bookedStatus": {
                  S: "PENDING",
                },
              },
            },
            End: true,
            ResultPath: "$.notPaid",
          },
          Fail: {
            Type: "Fail",
          },
          "Apartment Paid": {
            End: true,
            Type: "Pass",
          },
        },
      },
      name: "SamStepFunctionStateMachine-lfaxL8lndjSb",
    }),
    dependencies: ({}) => ({
      role: "sam-app-SamStepFunctionStateMachineRole-15QEGFRVJ5CQ3",
    }),
  },
];
