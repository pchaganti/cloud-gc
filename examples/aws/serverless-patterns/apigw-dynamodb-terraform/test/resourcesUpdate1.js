// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
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
      tags: { mykeynew: "myvalue" },
      throttle: {
        burstLimit: 20,
        rateLimit: 100,
      },
    }),
    dependencies: ({}) => ({
      stages: ["APIGW DynamoDB Serverless Pattern Demo::v1"],
    }),
  },
];
