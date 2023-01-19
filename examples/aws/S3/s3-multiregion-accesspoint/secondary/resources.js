// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: `gc-mutliaregionaccess-${config.region}`,
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
            BucketKeyEnabled: true,
          },
        ],
      },
    }),
  },
  {
    type: "MultiRegionAccessPoint",
    group: "S3Control",
    properties: ({}) => ({
      Name: "my-multiaccesspoint",
      PublicAccessBlock: {
        BlockPublicAcls: true,
        IgnorePublicAcls: true,
        BlockPublicPolicy: true,
        RestrictPublicBuckets: true,
      },
      Regions: [
        {
          Bucket: "gc-mutliaregionaccess",
          Region: "us-east-1",
        },
        {
          Bucket: "gc-mutliaregionaccess-us-west-2",
          Region: "us-west-2",
        },
      ],
    }),
    dependencies: ({ config }) => ({
      s3Bucket: [
        { name: "gc-mutliaregionaccess", provider: "aws-primary" },
        `gc-mutliaregionaccess-${config.region}`,
      ],
    }),
  },
];