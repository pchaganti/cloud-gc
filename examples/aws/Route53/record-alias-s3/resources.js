// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "grucloud.org.",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    properties: ({}) => ({
      Name: "site.grucloud.org.",
      Type: "A",
      AliasTarget: {
        HostedZoneId: "Z3AQBSTGFYJSTF",
        DNSName: "s3-website-us-east-1.amazonaws.com.",
        EvaluateTargetHealth: true,
      },
    }),
    dependencies: ({}) => ({
      hostedZone: "grucloud.org.",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "site.grucloud.org",
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
          },
        ],
      },
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: "index.html",
        },
      },
    }),
  },
];
