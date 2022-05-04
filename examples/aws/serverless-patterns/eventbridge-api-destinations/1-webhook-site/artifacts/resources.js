// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "ApiDestination",
    group: "CloudWatchEvents",
    name: "my-api",
    properties: ({}) => ({
      HttpMethod: "POST",
      InvocationEndpoint: "https://grucloud.com",
      InvocationRateLimitPerSecond: 300,
    }),
    dependencies: ({}) => ({
      connection: "MyConnection-dvMVGg2stExz",
    }),
  },
  {
    type: "Connection",
    group: "CloudWatchEvents",
    name: "MyConnection-dvMVGg2stExz",
    properties: ({}) => ({
      AuthParameters: {
        ApiKeyAuthParameters: {
          ApiKeyName: "MyWebhook",
          ApiKeyValue: process.env.MY_CONNECTION_DV_MV_GG2ST_EXZ_API_KEY_VALUE,
        },
      },
      AuthorizationType: "API_KEY",
      Description: "My connection with an API key",
    }),
  },
  { type: "EventBus", group: "CloudWatchEvents", name: "MyEventBus" },
];
