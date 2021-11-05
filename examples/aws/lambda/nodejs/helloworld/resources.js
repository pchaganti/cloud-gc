// Generated by 'gc gencode'
const { pipe, tap, get, eq, and } = require("rubico");
const { find } = require("rubico/x");

const createResources = ({ provider }) => {
  provider.IAM.makeRole({
    name: "lambda-role",
    properties: ({ config }) => ({
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({ resources }) => ({
      policies: [resources.IAM.Policy["lambda-policy"]],
    }),
  });

  provider.IAM.makePolicy({
    name: "lambda-policy",
    properties: ({ config }) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["logs:*"],
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
      Path: "/",
      Description: "Allow logs",
    }),
  });

  provider.Lambda.makeLayer({
    name: "lambda-layer",
    properties: ({ config }) => ({
      LayerName: "lambda-layer",
      Description: "My Layer",
      CompatibleRuntimes: ["nodejs"],
    }),
  });

  provider.Lambda.makeFunction({
    name: "lambda-hello-world",
    properties: ({ config }) => ({
      Handler: "helloworld.handler",
      PackageType: "Zip",
      Runtime: "nodejs14.x",
      Description: "",
      Timeout: 3,
      MemorySize: 128,
    }),
    dependencies: ({ resources }) => ({
      layers: [resources.Lambda.Layer["lambda-layer"]],
      role: resources.IAM.Role["lambda-role"],
    }),
  });
};

exports.createResources = createResources;