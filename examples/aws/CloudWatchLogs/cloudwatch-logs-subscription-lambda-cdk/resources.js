// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName:
        "CloudwatchLogsSubscriptionLambdaCdkStack-MyLogGroup5C0DAD85-Ffl0gig55aic",
      retentionInDays: 731,
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName:
        "CloudwatchLogsSubscriptionLambdaCdkStack-MyLogGroup5C0DAD85-oN2p3oG3Q9MY",
      retentionInDays: 731,
    }),
  },
  {
    type: "SubscriptionFilter",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      distribution: "ByLogStream",
      filterName:
        "CloudwatchLogsSubscriptionLambdaCdkStack-LogGroupLambdaSubscriptionB223D2CD-OmANny1TkWKs",
      filterPattern: '?"ERROR" ?"WARNING"',
    }),
    dependencies: ({}) => ({
      cloudWatchLogGroup:
        "CloudwatchLogsSubscriptionLambdaCdkStack-MyLogGroup5C0DAD85-oN2p3oG3Q9MY",
      lambdaFunction:
        "CloudwatchLogsSubscriptio-LogReceivingLambdaFuncti-ZsyPTW89DooL",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "CloudwatchLogsSubscriptio-LogReceivingLambdaFuncti-1SYYGEIBX7VRG",
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
          "CloudwatchLogsSubscriptio-LogReceivingLambdaFuncti-ZsyPTW89DooL",
        Handler: "index.handler",
        Runtime: "nodejs14.x",
        Timeout: 30,
      },
    }),
    dependencies: ({}) => ({
      role: "CloudwatchLogsSubscriptio-LogReceivingLambdaFuncti-1SYYGEIBX7VRG",
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
            "CloudwatchLogsSubscriptio-LogReceivingLambdaFuncti-ZsyPTW89DooL",
          Principal: "logs.amazonaws.com",
          StatementId:
            "CloudwatchLogsSubscriptionLambdaCdkStack-LogGroupLambdaSubscriptionCanInvokeLambdaFBD2-1JZ6A8EGZ0J86",
          SourceArn: `arn:aws:logs:${
            config.region
          }:${config.accountId()}:log-group:CloudwatchLogsSubscriptionLambdaCdkStack-MyLogGroup5C0DAD85-oN2p3oG3Q9MY:*`,
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction:
        "CloudwatchLogsSubscriptio-LogReceivingLambdaFuncti-ZsyPTW89DooL",
    }),
  },
];
