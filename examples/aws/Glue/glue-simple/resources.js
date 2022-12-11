// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Classifier",
    group: "Glue",
    properties: ({}) => ({
      JsonClassifier: {
        JsonPath: "$.key",
        Name: "my-classifier",
      },
    }),
  },
  {
    type: "Crawler",
    group: "Glue",
    properties: ({}) => ({
      Name: "my-crawler",
      Targets: {
        S3Targets: [
          {
            Exclusions: [],
            Path: "s3://gc-glue-database",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      database: "my-database",
      iamRole: "AWSGlueServiceRole-my",
      s3Buckets: ["gc-glue-database"],
    }),
  },
  {
    type: "Database",
    group: "Glue",
    properties: ({}) => ({
      Name: "my-database",
    }),
  },
  {
    type: "Table",
    group: "Glue",
    properties: ({ config }) => ({
      CatalogId: `${config.accountId()}`,
      Name: "my-table",
      Retention: 0,
      StorageDescriptor: {
        Columns: [],
        Compressed: false,
        InputFormat: "org.apache.hadoop.mapred.TextInputFormat",
        Location: "s3://gc-glue-database",
        NumberOfBuckets: 0,
        OutputFormat:
          "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
        SerdeInfo: {
          SerializationLibrary: "org.openx.data.jsonserde.JsonSerDe",
        },
        SortColumns: [],
        StoredAsSubDirectories: false,
      },
    }),
    dependencies: ({}) => ({
      database: "my-database",
      s3Bucket: "gc-glue-database",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "AWSGlueServiceRole-my",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "glue.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AWSGlueServiceRole",
          PolicyArn: "arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole",
        },
      ],
    }),
    dependencies: ({}) => ({
      policies: ["AWSGlueServiceRole-my-EZCRC-s3Policy"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "AWSGlueServiceRole-my-EZCRC-s3Policy",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["s3:GetObject", "s3:PutObject"],
            Resource: ["arn:aws:s3:::gc-glue-database*"],
          },
        ],
      },
      Path: "/service-role/",
      Description:
        "This policy will be used for Glue Crawler and Job execution. Please do NOT delete!",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "gc-glue-database",
    }),
  },
];
