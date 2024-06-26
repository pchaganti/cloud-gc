// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "/aws/route53/grucloud.org",
    }),
  },
  {
    type: "ResourcePolicy",
    group: "CloudWatchLogs",
    properties: ({ config }) => ({
      policyDocument: {
        Statement: [
          {
            Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
            Effect: "Allow",
            Principal: {
              Service: "route53.amazonaws.com",
            },
            Resource: `arn:aws:logs:${
              config.region
            }:${config.accountId()}:log-group:*`,
            Sid: "Route53LogsToCloudWatchLogs",
          },
        ],
        Version: "2012-10-17",
      },
      policyName: "AWSServiceRoleForRoute53",
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "grucloud.org.",
    }),
  },
  {
    type: "QueryLog",
    group: "Route53",
    properties: ({ config }) => ({
      CloudWatchLogsLogGroupArn: `arn:aws:logs:${
        config.region
      }:${config.accountId()}:log-group:/aws/route53/grucloud.org:*`,
    }),
    dependencies: ({}) => ({
      cloudWatchLogGroup: "/aws/route53/grucloud.org",
      hostedZone: "grucloud.org.",
    }),
  },
];
