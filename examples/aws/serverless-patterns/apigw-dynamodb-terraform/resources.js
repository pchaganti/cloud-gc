// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Account",
    group: "APIGateway",
    dependencies: ({}) => ({
      cloudwatchRole: "terraform-20220714213227147700000003",
    }),
  },
  {
    type: "ApiKey",
    group: "APIGateway",
    properties: ({}) => ({
      description: "Managed by Terraform",
      name: "apigw-dynamodb-terraform-api-key",
    }),
  },
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      name: "APIGW DynamoDB Serverless Pattern Demo",
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      schema: {
        openapi: "3.0.1",
        info: {
          title: "APIGW DynamoDB Serverless Pattern Demo",
          version: "1",
        },
        paths: {
          "/": {},
          "/pets": {
            post: {
              responses: {
                200: {
                  description: "200 response",
                },
              },
              "x-amazon-apigateway-integration": {
                credentials: `arn:aws:iam::${config.accountId()}:role/terraform-20220714213227147500000002`,
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_TEMPLATES",
                requestTemplates: {
                  "application/json":
                    '{"TableName":"Pets","Item":{"id":{"S":"$context.requestId"},"PetType":{"S":"$input.path(\'$.PetType\')"},"PetName":{"S":"$input.path(\'$.PetName\')"},"PetPrice":{"N":"$input.path(\'$.PetPrice\')"}}}',
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
          "/pets/{PetType}": {
            get: {
              parameters: [
                {
                  name: "PetType",
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
                credentials: `arn:aws:iam::${config.accountId()}:role/terraform-20220714213227147500000002`,
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_TEMPLATES",
                requestParameters: {
                  "integration.request.path.PetType":
                    "method.request.path.PetType",
                },
                requestTemplates: {
                  "application/json":
                    '{"TableName":"Pets","IndexName":"PetType-index","KeyConditionExpression":"PetType=:v1","ExpressionAttributeValues":{":v1":{"S":"$util.urlDecode($input.params(\'PetType\'))"}}}',
                },
                type: "AWS",
                uri: `arn:aws:apigateway:${config.region}:dynamodb:action/Query`,
                responses: {
                  default: {
                    responseTemplates: {
                      "application/json": `#set($inputRoot = $input.path('$'))
{
	"pets": [
		#foreach($field in $inputRoot.Items) {
			"id": "$field.id.S",
			"PetType": "$field.PetType.S",
			"PetName": "$field.PetName.S",
			"PetPrice": "$field.PetPrice.N"
		}#if($foreach.hasNext),#end
		#end
	]
}`,
                    },
                    statusCode: "200",
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {},
        },
      },
      deployment: {
        stageName: "v1",
      },
    }),
    dependencies: ({}) => ({
      roles: ["terraform-20220714213227147500000002"],
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "v1",
      methodSettings: {
        "*/*": {
          cacheDataEncrypted: false,
          cacheTtlInSeconds: 300,
          cachingEnabled: false,
          dataTraceEnabled: false,
          loggingLevel: "INFO",
          metricsEnabled: true,
          requireAuthorizationForCacheControl: true,
          throttlingBurstLimit: -1,
          throttlingRateLimit: -1,
          unauthorizedCacheControlHeaderStrategy:
            "SUCCEED_WITH_RESPONSE_HEADER",
        },
      },
    }),
    dependencies: ({}) => ({
      restApi: "APIGW DynamoDB Serverless Pattern Demo",
      account: "default",
    }),
  },
  {
    type: "UsagePlan",
    group: "APIGateway",
    properties: ({ getId }) => ({
      apiStages: [
        {
          apiId: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "APIGW DynamoDB Serverless Pattern Demo",
          })}`,
          stage: "v1",
        },
      ],
      name: "apigw-dynamodb-terraform-usage-plan",
      quota: {
        limit: 1000,
        offset: 0,
        period: "MONTH",
      },
      tags: {
        mykey1: "myvalue",
      },
      throttle: {
        burstLimit: 20,
        rateLimit: 100,
      },
    }),
    dependencies: ({}) => ({
      stages: ["APIGW DynamoDB Serverless Pattern Demo::v1"],
    }),
  },
  {
    type: "UsagePlanKey",
    group: "APIGateway",
    properties: ({}) => ({
      name: "apigw-dynamodb-terraform-api-key",
    }),
    dependencies: ({}) => ({
      usagePlan: "apigw-dynamodb-terraform-usage-plan",
      apiKey: "apigw-dynamodb-terraform-api-key",
    }),
  },
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "Pets",
      AttributeDefinitions: [
        {
          AttributeName: "PetType",
          AttributeType: "S",
        },
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      GlobalSecondaryIndexes: [
        {
          IndexArn:
            "arn:aws:dynamodb:us-east-1:840541460064:table/Pets/index/PetType-index",
          IndexName: "PetType-index",
          IndexSizeBytes: 0,
          IndexStatus: "ACTIVE",
          ItemCount: 0,
          KeySchema: [
            {
              AttributeName: "PetType",
              KeyType: "HASH",
            },
          ],
          Projection: {
            NonKeyAttributes: ["PetPrice", "PetName"],
            ProjectionType: "INCLUDE",
          },
          ProvisionedThroughput: {
            NumberOfDecreasesToday: 0,
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "terraform-20220714213227147500000002",
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
    }),
    dependencies: ({}) => ({
      policies: ["terraform-20220714213245320000000005"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "terraform-20220714213227147700000003",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
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
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: [
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:DescribeLogGroups",
                  "logs:DescribeLogStreams",
                  "logs:PutLogEvents",
                  "logs:GetLogEvents",
                  "logs:FilterLogEvents",
                ],
                Resource: "*",
              },
            ],
          },
          PolicyName: "terraform-20220714213229394700000004",
        },
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ getId }) => ({
      PolicyName: "terraform-20220714213245320000000005",
      PolicyDocument: {
        Statement: [
          {
            Action: ["dynamodb:PutItem", "dynamodb:Query"],
            Effect: "Allow",
            Resource: [
              `${getId({ type: "Table", group: "DynamoDB", name: "Pets" })}`,
              `${getId({
                type: "Table",
                group: "DynamoDB",
                name: "Pets",
              })}/index/*`,
            ],
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
    }),
    dependencies: ({}) => ({
      table: "Pets",
    }),
  },
];
