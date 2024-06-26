// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-PutMetricFunctionRole-1KQOW6MUXF48I",
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
                Action: ["cloudwatch:PutMetricData"],
                Effect: "Allow",
                Resource: "*",
              },
            ],
          },
          PolicyName: "PutMetricFunctionRolePolicy0",
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
        FunctionName: "sam-app-PutMetricFunction-IRljDZikgnoj",
        Handler: "app.lambdaHandler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-PutMetricFunctionRole-1KQOW6MUXF48I",
    }),
  },
];
