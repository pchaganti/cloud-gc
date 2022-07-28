// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "GraphqlApi",
    group: "AppSync",
    name: "TriggeredByLambda",
    properties: ({}) => ({
      authenticationType: "AWS_IAM",
      xrayEnabled: false,
      apiKeys: [],
      schemaFile: "TriggeredByLambda.graphql",
    }),
  },
  {
    type: "DataSource",
    group: "AppSync",
    name: "NONE",
    properties: ({}) => ({
      type: "NONE",
    }),
    dependencies: ({}) => ({
      graphqlApi: "TriggeredByLambda",
    }),
  },
  {
    type: "Resolver",
    group: "AppSync",
    properties: ({}) => ({
      typeName: "Mutation",
      fieldName: "createTodo",
      requestMappingTemplate:
        '\n$util.qr($ctx.args.put("id", $util.defaultIfNull($ctx.args.id, $util.autoId())))\n#set( $createdAt = $util.time.nowISO8601() )\n$util.qr($context.args.put("createdAt", $createdAt))\n$util.qr($context.args.put("updatedAt", $createdAt))\n{\n  "version": "2017-02-28",\n  "payload": $util.toJson($ctx.args)\n}',
      responseMappingTemplate: "$util.toJson($context.result)",
      kind: "UNIT",
    }),
    dependencies: ({}) => ({
      graphqlApi: "TriggeredByLambda",
      dataSource: "NONE",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "CdkLambdaCallAppSyncStack-triggerServiceRole07E9AB-5S1U4A7Y9DDX",
    properties: ({ config }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `lambda.amazonaws.com`,
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
                Action: "appsync:GraphQL",
                Resource: `arn:aws:appsync:${
                  config.region
                }:${config.accountId()}:apis/qmb4gkigtva77il5mzwamzxrbe/types/Mutation/*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "triggerServiceRoleDefaultPolicy87FA9B3E",
        },
      ],
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
    properties: ({ getId }) => ({
      Configuration: {
        Environment: {
          Variables: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: `1`,
            GRAPHQL_URL: `${getId({
              type: "GraphqlApi",
              group: "AppSync",
              name: "TriggeredByLambda",
              path: "live.uris.GRAPHQL",
            })}`,
          },
        },
        FunctionName: "CdkLambdaCallAppSyncStack-trigger73DC69F8-Fn5wBU5v76VC",
        Handler: "index.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "CdkLambdaCallAppSyncStack-triggerServiceRole07E9AB-5S1U4A7Y9DDX",
      graphqlApis: ["TriggeredByLambda"],
    }),
  },
];
