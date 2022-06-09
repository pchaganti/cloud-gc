// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Account",
    group: "APIGateway",
    name: "default",
    dependencies: ({}) => ({
      cloudwatchRole:
        "ApiDynamoStack-ApiDynamoRestApiCloudWatchRole8BD3C-1HLKDWM5HWYRZ",
    }),
  },
  {
    type: "RestApi",
    group: "APIGateway",
    name: "ApiDynamoRestApi",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      schema: {
        openapi: "3.0.1",
        info: {
          title: "ApiDynamoRestApi",
          version: "1",
        },
        paths: {
          "/": {},
          "/{id}": {
            get: {
              parameters: [
                {
                  name: "id",
                  in: "path",
                  required: true,
                  schema: {
                    type: "string",
                  },
                },
              ],
              responses: {
                200: {
                  description: "200 response",
                },
              },
              "x-amazon-apigateway-integration": {
                credentials: `arn:aws:iam::${config.accountId()}:role/ApiDynamoStack-IntegrationRole35EAE287-X92O12RZGAJX`,
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_TEMPLATES",
                requestParameters: {
                  "integration.request.path.id": "method.request.path.id",
                },
                requestTemplates: {
                  "application/json":
                    '{"TableName":"ApiDynamoStack-ApiDynamoTable66095DD3-1B90VIOP8H5XN","KeyConditionExpression":"pk = :v1","ExpressionAttributeValues":{":v1":{"S":"$input.params(\'id\')"}}}',
                },
                type: "AWS",
                uri: `arn:aws:apigateway:${config.region}:dynamodb:action/Query`,
                responses: {
                  default: {
                    statusCode: "200",
                  },
                },
              },
            },
            post: {
              parameters: [
                {
                  name: "id",
                  in: "path",
                  required: true,
                  schema: {
                    type: "string",
                  },
                },
              ],
              responses: {
                200: {
                  description: "200 response",
                },
              },
              "x-amazon-apigateway-integration": {
                credentials: `arn:aws:iam::${config.accountId()}:role/ApiDynamoStack-IntegrationRole35EAE287-X92O12RZGAJX`,
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_TEMPLATES",
                requestTemplates: {
                  "application/json":
                    '{"TableName":"ApiDynamoStack-ApiDynamoTable66095DD3-1B90VIOP8H5XN","Item":{"pk":{"S":"$input.path(\'$.pk\')"},"data":{"S":"$input.path(\'$.data\')"}}}',
                },
                type: "AWS",
                uri: `arn:aws:apigateway:${config.region}:dynamodb:action/PutItem`,
                responses: {
                  default: {
                    responseTemplates: {
                      "application/json": "{}",
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
            Error: {
              title: "Error Schema",
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      deployment: {
        stageName: "prod",
      },
    }),
    dependencies: ({}) => ({
      roles: ["ApiDynamoStack-IntegrationRole35EAE287-X92O12RZGAJX"],
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    name: "prod",
    dependencies: ({}) => ({
      restApi: "ApiDynamoRestApi",
    }),
  },
  {
    type: "Table",
    group: "DynamoDB",
    name: "ApiDynamoStack-ApiDynamoTable66095DD3-1B90VIOP8H5XN",
    properties: ({}) => ({
      AttributeDefinitions: [
        {
          AttributeName: "pk",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "pk",
          KeyType: "HASH",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "ApiDynamoStack-ApiDynamoRestApiCloudWatchRole8BD3C-1HLKDWM5HWYRZ",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `apigateway.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonAPIGatewayPushToCloudWatchLogs",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "ApiDynamoStack-IntegrationRole35EAE287-X92O12RZGAJX",
    properties: ({ getId }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `apigateway.amazonaws.com`,
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
                Action: [
                  "dynamodb:BatchGetItem",
                  "dynamodb:GetRecords",
                  "dynamodb:GetShardIterator",
                  "dynamodb:Query",
                  "dynamodb:GetItem",
                  "dynamodb:Scan",
                  "dynamodb:ConditionCheckItem",
                  "dynamodb:BatchWriteItem",
                  "dynamodb:PutItem",
                  "dynamodb:UpdateItem",
                  "dynamodb:DeleteItem",
                ],
                Resource: [
                  `${getId({
                    type: "Table",
                    group: "DynamoDB",
                    name: "ApiDynamoStack-ApiDynamoTable66095DD3-1B90VIOP8H5XN",
                  })}`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "IntegrationRoleDefaultPolicy99182A66",
        },
      ],
    }),
    dependencies: ({}) => ({
      table: "ApiDynamoStack-ApiDynamoTable66095DD3-1B90VIOP8H5XN",
    }),
  },
];
