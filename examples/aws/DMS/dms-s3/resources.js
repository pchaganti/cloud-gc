// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Endpoint",
    group: "DMS",
    properties: ({}) => ({
      EndpointIdentifier: "endpoint-s3",
      EndpointType: "source",
      EngineDisplayName: "Amazon S3",
      EngineName: "s3",
      ExternalTableDefinition: '{"key":"a"}',
      S3Settings: {
        AddColumnName: true,
        BucketFolder: "csv",
        BucketName: "gc-dms-s3",
        CsvDelimiter: ",",
        CsvRowDelimiter: "\\n",
        EnableStatistics: true,
        ExternalTableDefinition: '{"key":"a"}',
      },
    }),
    dependencies: ({}) => ({
      iamRoleServiceAccess: "role-s3-rw",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "role-s3-rw",
      Description:
        "Allows Database Migration Service to call AWS services on your behalf.",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "dms.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyArn: "arn:aws:iam::aws:policy/AmazonS3FullAccess",
          PolicyName: "AmazonS3FullAccess",
        },
      ],
    }),
  },
];
