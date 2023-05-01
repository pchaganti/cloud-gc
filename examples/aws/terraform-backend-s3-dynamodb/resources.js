// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = (xxx) => [
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "terraform-state-locking",
      AttributeDefinitions: [
        {
          AttributeName: "LockID",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "LockID",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: config.s3BucketName,
    }),
  },
];
