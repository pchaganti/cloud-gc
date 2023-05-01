// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "DataSource",
    group: "AppSync",
    properties: ({}) => ({
      name: "UserLambdaDatasource",
      type: "AWS_LAMBDA",
    }),
    dependencies: ({}) => ({
      graphqlApi: "SampleAppSyncApi",
      serviceRole: "CognitoAuthCdkStack-LambdaRole3A44B857-MJHSGPPL76U9",
      lambdaFunction:
        "CognitoAuthCdkStack-CognitoUserHandler17FBEBDA-ld0mYxp25X7E",
    }),
  },
  {
    type: "GraphqlApi",
    group: "AppSync",
    properties: ({ config, getId }) => ({
      name: "SampleAppSyncApi",
      authenticationType: "API_KEY",
      xrayEnabled: true,
      logConfig: {
        excludeVerboseContent: false,
        fieldLogLevel: "ALL",
      },
      apiKeys: [],
      additionalAuthenticationProviders: [
        {
          authenticationType: "AMAZON_COGNITO_USER_POOLS",
          userPoolConfig: {
            awsRegion: config.region,
            userPoolId: `${getId({
              type: "UserPool",
              group: "CognitoIdentityServiceProvider",
              name: "CognitoUserPool53E37E69-yJSfyZcumKYw",
            })}`,
          },
        },
      ],
      schemaFile: "SampleAppSyncApi.graphql",
    }),
    dependencies: ({}) => ({
      cloudWatchLogsRole:
        "CognitoAuthCdkStack-appSyncCloudWatchLogsFC2B744C-YE1JPF0F3Q77",
      userPools: ["CognitoUserPool53E37E69-yJSfyZcumKYw"],
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      fieldName: "createUserAccount",
      kind: "UNIT",
      typeName: "Mutation",
    }),
    dependencies: ({}) => ({
      dataSource: "UserLambdaDatasource",
      graphqlApi: "SampleAppSyncApi",
    }),
  },
  {
    type: "UserPool",
    group: "CognitoIdentityServiceProvider",
    properties: ({}) => ({
      EmailVerificationMessage:
        "The verification code to your new account is {####}",
      EmailVerificationSubject: "Verify your new account",
      PoolName: "CognitoUserPool53E37E69-yJSfyZcumKYw",
      SmsVerificationMessage:
        "The verification code to your new account is {####}",
      VerificationMessageTemplate: {
        EmailMessage: "The verification code to your new account is {####}",
        EmailSubject: "Verify your new account",
        SmsMessage: "The verification code to your new account is {####}",
      },
    }),
  },
  {
    type: "UserPoolClient",
    group: "CognitoIdentityServiceProvider",
    properties: ({}) => ({
      AllowedOAuthFlows: ["code", "implicit"],
      AllowedOAuthFlowsUserPoolClient: true,
      AllowedOAuthScopes: [
        "aws.cognito.signin.user.admin",
        "email",
        "openid",
        "phone",
        "profile",
      ],
      CallbackURLs: ["https://example.com"],
      ClientName: "UserPoolClient2F5918F7-ZxUwuh502aZt",
      SupportedIdentityProviders: ["COGNITO"],
    }),
    dependencies: ({}) => ({
      userPool: "CognitoUserPool53E37E69-yJSfyZcumKYw",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "CognitoAuthCdkStack-appSyncCloudWatchLogsFC2B744C-YE1JPF0F3Q77",
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
    properties: ({}) => ({
      RoleName:
        "CognitoAuthCdkStack-CognitoUserHandlerServiceRole4-WB6CNO8K84PI",
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
                Action: ["xray:PutTelemetryRecords", "xray:PutTraceSegments"],
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "CognitoUserHandlerServiceRoleDefaultPolicy473A9DAA",
        },
      ],
      AttachedPolicies: [
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSAppSyncPushToCloudWatchLogs",
          PolicyName: "AWSAppSyncPushToCloudWatchLogs",
        },
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
      RoleName: "CognitoAuthCdkStack-LambdaRole3A44B857-MJHSGPPL76U9",
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
          PolicyArn: "arn:aws:iam::aws:policy/AWSLambda_FullAccess",
          PolicyName: "AWSLambda_FullAccess",
        },
      ],
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
          "CognitoAuthCdkStack-CognitoUserHandler17FBEBDA-ld0mYxp25X7E",
        Handler: "index.handler",
        MemorySize: 1024,
        Runtime: "nodejs16.x",
        TracingConfig: {
          Mode: "Active",
        },
      },
    }),
    dependencies: ({}) => ({
      role: "CognitoAuthCdkStack-CognitoUserHandlerServiceRole4-WB6CNO8K84PI",
    }),
  },
];
