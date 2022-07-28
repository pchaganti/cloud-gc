// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "my-function-url",
        Handler: "index.handler",
        Runtime: "nodejs14.x",
      },
      FunctionUrlConfig: {
        AuthType: "AWS_IAM",
        Cors: {
          AllowOrigins: ["*"],
        },
      },
    }),
    dependencies: () => ({
      role: "my-function-url-role-t2xxsa8e",
    }),
  },
];
