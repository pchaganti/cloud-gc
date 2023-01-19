// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "/aws/datasync",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "/aws/fsx/lustre",
    }),
  },
  {
    type: "LocationFsxLustre",
    group: "DataSync",
    dependencies: ({}) => ({
      fsxFileSystem: "my-fsx-lustre",
      securityGroups: ["sg::vpc-default::fsx-lustre"],
    }),
  },
  {
    type: "LocationS3",
    group: "DataSync",
    properties: ({}) => ({
      S3StorageClass: "STANDARD",
    }),
    dependencies: ({}) => ({
      iamRole: "AWSDataSyncS3BucketAccess-gc-datasync-fsx-lustre-destination",
      s3Bucket: "gc-datasync-fsx-lustre-destination",
    }),
  },
  {
    type: "Task",
    group: "DataSync",
    properties: ({}) => ({
      Name: "my-datasync-fsx-lustre",
      Options: {
        Gid: "INT_VALUE",
        LogLevel: "BASIC",
        PosixPermissions: "PRESERVE",
        Uid: "INT_VALUE",
      },
    }),
    dependencies: ({}) => ({
      logGroup: "/aws/datasync",
      destinationS3: "gc-datasync-fsx-lustre-destination",
      sourceFsxLustre: "my-fsx-lustre",
    }),
  },
  { type: "Vpc", group: "EC2", name: "vpc-default", isDefault: true },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-f",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "fsx-lustre",
      Description: "fsx lustre",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 988,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      ToPort: 988,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc-default::fsx-lustre",
    }),
  },
  {
    type: "FileSystem",
    group: "FSx",
    name: "my-fsx-lustre",
    properties: ({}) => ({
      FileSystemType: "LUSTRE",
      FileSystemTypeVersion: "2.12",
      LustreConfiguration: {
        AutomaticBackupRetentionDays: 7,
        CopyTagsToBackups: false,
        DailyAutomaticBackupStartTime: "06:00",
        DataCompressionType: "NONE",
        DeploymentType: "PERSISTENT_2",
        LogConfiguration: {
          Destination:
            "arn:aws:logs:us-east-1:840541460064:log-group:/aws/fsx/lustre:log-stream:datarepo_fs-0a23c69b0a349a454",
          Level: "WARN_ERROR",
        },
        PerUnitStorageThroughput: 125,
        WeeklyMaintenanceStartTime: "1:07:30",
      },
      StorageCapacity: 1200,
      StorageType: "SSD",
    }),
    dependencies: ({}) => ({
      logStreamLustre: "/aws/fsx/lustre::datarepo_fs-0a23c69b0a349a454",
      subnets: ["vpc-default::subnet-default-f"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "AWSDataSyncS3BucketAccess-gc-datasync-fsx-lustre-destination",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "datasync.amazonaws.com",
            },
            Action: "sts:AssumeRole",
            Condition: {
              StringEquals: {
                "aws:SourceAccount": `${config.accountId()}`,
              },
              ArnLike: {
                "aws:SourceArn": `arn:aws:datasync:${
                  config.region
                }:${config.accountId()}:*`,
              },
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: [
        "AWSDataSyncS3BucketAccess-gc-datasync-fsx-lustre-destination",
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName:
        "AWSDataSyncS3BucketAccess-gc-datasync-fsx-lustre-destination",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: [
              "s3:GetBucketLocation",
              "s3:ListBucket",
              "s3:ListBucketMultipartUploads",
            ],
            Effect: "Allow",
            Resource: "arn:aws:s3:::gc-datasync-fsx-lustre-destination",
          },
          {
            Action: [
              "s3:AbortMultipartUpload",
              "s3:DeleteObject",
              "s3:GetObject",
              "s3:ListMultipartUploadParts",
              "s3:PutObjectTagging",
              "s3:GetObjectTagging",
              "s3:PutObject",
            ],
            Effect: "Allow",
            Resource: "arn:aws:s3:::gc-datasync-fsx-lustre-destination/*",
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "gc-datasync-fsx-lustre-destination",
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
];