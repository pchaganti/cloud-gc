// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-LambdaFunctionRole-QMWSR32TPZLQ",
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
                Action: ["ssm:GetParameter", "ssm:PutParameter"],
                Effect: "Allow",
                Resource: `arn:aws:ssm:${
                  config.region
                }:${config.accountId()}:parameter/ExampleParameterName`,
              },
            ],
          },
          PolicyName: "LambdaFunctionRolePolicy0",
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
        Environment: {
          Variables: {
            SSMParameterName: "ExampleParameterName",
          },
        },
        FunctionName: "sam-app-LambdaFunction-X4hNZs6zzhip",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
        Timeout: 15,
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-LambdaFunctionRole-QMWSR32TPZLQ",
    }),
  },
  {
    type: "Parameter",
    group: "SSM",
    properties: ({}) => ({
      Name: "ExampleParameterName",
      Type: "String",
      Value: '{"key1":"value1"}',
      DataType: "text",
    }),
  },
];
