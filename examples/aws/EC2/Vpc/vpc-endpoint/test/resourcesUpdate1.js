// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "VpcEndpoint",
    group: "EC2",
    name: "project-vpce-s3",
    properties: ({ config }) => ({
      PolicyDocument: {
        Version: "2008-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: "*",
            Resource: `arn:aws:s3:::codepipeline-${config.region}-*`,
          },
        ],
      },
      PrivateDnsEnabled: false,
      RequesterManaged: false,
      VpcEndpointType: "Gateway",
      ServiceName: `com.amazonaws.${config.region}.s3`,
    }),
    dependencies: ({ config }) => ({
      vpc: "project-vpc",
      routeTables: [`project-vpc::project-rtb-private1-${config.region}a`],
    }),
  },
];