// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["REGIONAL"],
      },
      name: "testquery",
      schema: {
        openapi: "3.0.1",
        info: {
          title: "testquery",
          version: "1",
        },
        paths: {
          "/": {
            "x-amazon-apigateway-any-method": {
              responses: {
                200: {
                  description: "200 response",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Empty",
                      },
                    },
                  },
                },
              },
              "x-amazon-apigateway-integration": {
                contentHandling: "CONVERT_TO_TEXT",
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_TEMPLATES",
                type: "AWS",
                uri: `arn:aws:apigateway:${
                  config.region
                }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:sam-app-APIFunction-2STg887QFKzr/invocations`,
                responses: {
                  default: {
                    responseTemplates: {
                      "application/json": `#set($inputRoot = $input.path('$'))
#if($inputRoot.toString().contains("error"))
#set($context.responseOverride.status = 400)
#set($inputRoot.statuscode = 650)
#set($inputRoot.body = "changed")
#end
$input.json("$")`,
                    },
                    statusCode: "200",
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            Empty: {
              title: "Empty Schema",
              type: "object",
            },
          },
        },
      },
      deployment: {
        stageName: "dev",
      },
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "dev",
    }),
    dependencies: ({}) => ({
      restApi: "testquery",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-APIFunctionRole-1CR0X6ERT3PFJ",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
          },
        ],
        Version: "2012-10-17",
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
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "sam-app-APIFunction-2STg887QFKzr",
        Handler: "lambda_function4.lambda_handler",
        Runtime: "python3.9",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-APIFunctionRole-1CR0X6ERT3PFJ",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-APIFunction-2STg887QFKzr",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "testquery",
            path: "live.arnv2",
          })}/*/*/`,
          StatementId: "sam-app-APIFunctionApiEventPermissiondev-1GV695BU5N439",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-APIFunction-2STg887QFKzr",
      apiGatewayRestApis: ["testquery"],
    }),
  },
];
