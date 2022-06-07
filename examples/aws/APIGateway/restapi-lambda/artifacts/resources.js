// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Account",
    group: "APIGateway",
    name: "default",
    dependencies: ({}) => ({
      cloudwatchRole: "roleApiGatewayCloudWatch",
    }),
  },
  { type: "ApiKey", group: "APIGateway", name: "my-key" },
  {
    type: "RestApi",
    group: "APIGateway",
    name: "PetStore",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["REGIONAL"],
      },
      schema: {
        openapi: "3.0.1",
        info: {
          description:
            "Your first API with Amazon API Gateway. This is a sample API that integrates via HTTP with our demo Pet Store endpoints",
          title: "PetStore",
          version: "1",
        },
        paths: {
          "/": {
            get: {
              responses: {
                200: {
                  description: "200 response",
                  headers: {
                    "Content-Type": {
                      schema: {
                        type: "string",
                      },
                    },
                  },
                },
              },
              "x-amazon-apigateway-integration": {
                passthroughBehavior: "WHEN_NO_MATCH",
                requestTemplates: {
                  "application/json": '{"statusCode": 200}',
                },
                type: "MOCK",
                responses: {
                  default: {
                    responseParameters: {
                      "method.response.header.Content-Type": "'text/html'",
                    },
                    responseTemplates: {
                      "text/html":
                        '<html>\n    <head>\n        <style>\n        body {\n            color: #333;\n            font-family: Sans-serif;\n            max-width: 800px;\n            margin: auto;\n        }\n        </style>\n    </head>\n    <body>\n        <h1>Welcome to your Pet Store API</h1>\n        <p>\n            You have successfully deployed your first API. You are seeing this HTML page because the <code>GET</code> method to the root resource of your API returns this content as a Mock integration.\n        </p>\n        <p>\n            The Pet Store API contains the <code>/pets</code> and <code>/pets/{petId}</code> resources. By making a <a href="/$context.stage/pets/" target="_blank"><code>GET</code> request</a> to <code>/pets</code> you can retrieve a list of Pets in your API. If you are looking for a specific pet, for example the pet with ID 1, you can make a <a href="/$context.stage/pets/1" target="_blank"><code>GET</code> request</a> to <code>/pets/1</code>.\n        </p>\n        <p>\n            You can use a REST client such as <a href="https://www.getpostman.com/" target="_blank">Postman</a> to test the <code>POST</code> methods in your API to create a new pet. Use the sample body below to send the <code>POST</code> request:\n        </p>\n        <pre>\n{\n    "type" : "cat",\n    "price" : 123.11\n}\n        </pre>\n    </body>\n</html>',
                    },
                    statusCode: "200",
                  },
                },
              },
            },
          },
          "/pets": {
            get: {
              parameters: [
                {
                  name: "page",
                  in: "query",
                  required: true,
                  schema: {
                    type: "string",
                  },
                },
                {
                  name: "type",
                  in: "query",
                  required: true,
                  schema: {
                    type: "string",
                  },
                },
              ],
              responses: {
                200: {
                  description: "200 response",
                  headers: {
                    "Access-Control-Allow-Origin": {
                      schema: {
                        type: "string",
                      },
                    },
                  },
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Pets",
                      },
                    },
                  },
                },
              },
              "x-amazon-apigateway-integration": {
                httpMethod: "GET",
                passthroughBehavior: "WHEN_NO_MATCH",
                requestParameters: {
                  "integration.request.querystring.page":
                    "method.request.querystring.page",
                  "integration.request.querystring.type":
                    "method.request.querystring.type",
                },
                type: "HTTP",
                uri: `http://petstore.execute-api.${config.region}.amazonaws.com/petstore/pets`,
                responses: {
                  default: {
                    responseParameters: {
                      "method.response.header.Access-Control-Allow-Origin":
                        "'*'",
                    },
                    statusCode: "200",
                  },
                },
              },
            },
            options: {
              responses: {
                200: {
                  description: "200 response",
                  headers: {
                    "Access-Control-Allow-Headers": {
                      schema: {
                        type: "string",
                      },
                    },
                    "Access-Control-Allow-Methods": {
                      schema: {
                        type: "string",
                      },
                    },
                    "Access-Control-Allow-Origin": {
                      schema: {
                        type: "string",
                      },
                    },
                  },
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
                passthroughBehavior: "WHEN_NO_MATCH",
                requestTemplates: {
                  "application/json": '{"statusCode": 200}',
                },
                type: "MOCK",
                responses: {
                  default: {
                    responseParameters: {
                      "method.response.header.Access-Control-Allow-Headers":
                        "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'",
                      "method.response.header.Access-Control-Allow-Methods":
                        "'POST,GET,OPTIONS'",
                      "method.response.header.Access-Control-Allow-Origin":
                        "'*'",
                    },
                    statusCode: "200",
                  },
                },
              },
            },
            post: {
              operationId: "CreatePet",
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/NewPet",
                    },
                  },
                },
                required: true,
              },
              responses: {
                200: {
                  description: "200 response",
                  headers: {
                    "Access-Control-Allow-Origin": {
                      schema: {
                        type: "string",
                      },
                    },
                  },
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/NewPetResponse",
                      },
                    },
                  },
                },
              },
              "x-amazon-apigateway-integration": {
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_MATCH",
                type: "HTTP",
                uri: `http://petstore.execute-api.${config.region}.amazonaws.com/petstore/pets`,
                responses: {
                  default: {
                    responseParameters: {
                      "method.response.header.Access-Control-Allow-Origin":
                        "'*'",
                    },
                    statusCode: "200",
                  },
                },
              },
            },
          },
          "/pets/{petId}": {
            get: {
              operationId: "GetPet",
              parameters: [
                {
                  name: "petId",
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
                  headers: {
                    "Access-Control-Allow-Origin": {
                      schema: {
                        type: "string",
                      },
                    },
                  },
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Pet",
                      },
                    },
                  },
                },
              },
              "x-amazon-apigateway-integration": {
                httpMethod: "GET",
                passthroughBehavior: "WHEN_NO_MATCH",
                requestParameters: {
                  "integration.request.path.petId": "method.request.path.petId",
                },
                type: "HTTP",
                uri: `http://petstore.execute-api.${config.region}.amazonaws.com/petstore/pets/{petId}`,
                responses: {
                  default: {
                    responseParameters: {
                      "method.response.header.Access-Control-Allow-Origin":
                        "'*'",
                    },
                    statusCode: "200",
                  },
                },
              },
            },
            options: {
              parameters: [
                {
                  name: "petId",
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
                  headers: {
                    "Access-Control-Allow-Headers": {
                      schema: {
                        type: "string",
                      },
                    },
                    "Access-Control-Allow-Methods": {
                      schema: {
                        type: "string",
                      },
                    },
                    "Access-Control-Allow-Origin": {
                      schema: {
                        type: "string",
                      },
                    },
                  },
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
                passthroughBehavior: "WHEN_NO_MATCH",
                requestTemplates: {
                  "application/json": '{"statusCode": 200}',
                },
                type: "MOCK",
                responses: {
                  default: {
                    responseParameters: {
                      "method.response.header.Access-Control-Allow-Headers":
                        "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'",
                      "method.response.header.Access-Control-Allow-Methods":
                        "'GET,OPTIONS'",
                      "method.response.header.Access-Control-Allow-Origin":
                        "'*'",
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
              type: "object",
            },
            NewPet: {
              type: "object",
              properties: {
                type: {
                  $ref: "#/components/schemas/PetType",
                },
                price: {
                  type: "number",
                },
              },
            },
            NewPetResponse: {
              type: "object",
              properties: {
                pet: {
                  $ref: "#/components/schemas/Pet",
                },
                message: {
                  type: "string",
                },
              },
            },
            Pet: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  format: "int32",
                },
                type: {
                  type: "string",
                },
                price: {
                  type: "number",
                },
              },
            },
            Pets: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Pet",
              },
            },
            PetType: {
              type: "string",
              enum: ["dog", "cat", "fish", "bird", "gecko"],
            },
          },
        },
      },
      deployment: {
        stageName: "dev",
      },
      tags: {
        mykey: "myvalue",
      },
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    name: "dev",
    properties: ({}) => ({
      description: "dev",
      methodSettings: {
        "*/*": {
          cacheDataEncrypted: false,
          cacheTtlInSeconds: 300,
          cachingEnabled: false,
          dataTraceEnabled: false,
          metricsEnabled: false,
          requireAuthorizationForCacheControl: true,
          throttlingBurstLimit: 5000,
          throttlingRateLimit: 10000,
          unauthorizedCacheControlHeaderStrategy:
            "SUCCEED_WITH_RESPONSE_HEADER",
        },
      },
      cacheClusterSize: "0.5",
      tags: {
        mykey: "myvalue3",
      },
    }),
    dependencies: ({}) => ({
      restApi: "PetStore",
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    name: "prod",
    properties: ({}) => ({
      description: "prod",
    }),
    dependencies: ({}) => ({
      restApi: "PetStore",
    }),
  },
  { type: "LogGroup", group: "CloudWatchLogs", name: "restapi" },
  {
    type: "Role",
    group: "IAM",
    name: "roleApiGatewayCloudWatch",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
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
];
