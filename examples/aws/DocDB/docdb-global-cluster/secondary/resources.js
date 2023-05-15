// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "DBCluster",
    group: "DocDB",
    properties: ({}) => ({
      DBClusterIdentifier: "docdb-secondary",
      DBClusterParameterGroupName: "default.docdb5.0",
      DBSubnetGroupName: "my-subnet-group-secondary",
      DeletionProtection: false,
      EngineVersion: "5.0.0",
      PreferredBackupWindow: "00:00-00:30",
      PreferredMaintenanceWindow: "sun:09:41-sun:10:11",
      StorageEncrypted: true,
    }),
    dependencies: ({}) => ({
      kmsKey: "alias/aws/rds",
      dbSubnetGroup: "my-subnet-group-secondary",
      globalCluster: { name: "global-cluster", provider: "aws-primary" },
    }),
  },
  {
    type: "DBInstance",
    group: "DocDB",
    properties: ({ config }) => ({
      AutoMinorVersionUpgrade: true,
      AvailabilityZone: `${config.region}b`,
      CopyTagsToSnapshot: false,
      DBInstanceClass: "db.r6g.large",
      DBInstanceIdentifier: "docdb-secondary",
      EngineVersion: "5.0.0",
      PreferredBackupWindow: "00:00-00:30",
      PreferredMaintenanceWindow: "wed:07:46-wed:08:16",
      PromotionTier: 1,
      StorageEncrypted: true,
    }),
    dependencies: ({}) => ({
      dbCluster: "docdb-secondary",
    }),
  },
  {
    type: "DBInstance",
    group: "DocDB",
    properties: ({ config }) => ({
      AutoMinorVersionUpgrade: true,
      AvailabilityZone: `${config.region}a`,
      CopyTagsToSnapshot: false,
      DBInstanceClass: "db.r6g.large",
      DBInstanceIdentifier: "docdb-secondary2",
      EngineVersion: "5.0.0",
      PreferredBackupWindow: "00:00-00:30",
      PreferredMaintenanceWindow: "wed:07:46-wed:08:16",
      PromotionTier: 1,
      StorageEncrypted: true,
    }),
    dependencies: ({}) => ({
      dbCluster: "docdb-secondary",
    }),
  },
  {
    type: "DBSubnetGroup",
    group: "DocDB",
    properties: ({}) => ({
      DBSubnetGroupDescription: "my-subnet-group-secondary",
      DBSubnetGroupName: "my-subnet-group-secondary",
    }),
    dependencies: ({ config }) => ({
      subnets: [
        `docdb-vpc::docdb-subnet-private1-${config.region}a`,
        `docdb-vpc::docdb-subnet-private2-${config.region}b`,
      ],
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `docdb-rtb-private1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "docdb-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `docdb-rtb-private2-${config.region}b`,
    dependencies: ({}) => ({
      vpc: "docdb-vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `docdb-vpc::docdb-rtb-private1-${config.region}a`,
      subnet: `docdb-vpc::docdb-subnet-private1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `docdb-vpc::docdb-rtb-private2-${config.region}b`,
      subnet: `docdb-vpc::docdb-subnet-private2-${config.region}b`,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `docdb-subnet-private1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 8,
    }),
    dependencies: ({}) => ({
      vpc: "docdb-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `docdb-subnet-private2-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 4,
      NetworkNumber: 9,
    }),
    dependencies: ({}) => ({
      vpc: "docdb-vpc",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "docdb-vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Key",
    group: "KMS",
    name: "alias/aws/rds",
    readOnly: true,
    properties: ({ config }) => ({
      Description:
        "Default key that protects my RDS database volumes when no other key is defined",
      Policy: {
        Version: "2012-10-17",
        Id: "auto-rds-2",
        Statement: [
          {
            Sid: "Allow access through RDS for all principals in the account that are authorized to use RDS",
            Effect: "Allow",
            Principal: {
              AWS: "*",
            },
            Action: [
              "kms:Encrypt",
              "kms:Decrypt",
              "kms:ReEncrypt*",
              "kms:GenerateDataKey*",
              "kms:CreateGrant",
              "kms:ListGrants",
              "kms:DescribeKey",
            ],
            Resource: "*",
            Condition: {
              StringEquals: {
                "kms:CallerAccount": `${config.accountId()}`,
                "kms:ViaService": `rds.${config.region}.amazonaws.com`,
              },
            },
          },
          {
            Sid: "Allow direct access to key metadata to the account",
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::${config.accountId()}:root`,
            },
            Action: [
              "kms:Describe*",
              "kms:Get*",
              "kms:List*",
              "kms:RevokeGrant",
            ],
            Resource: "*",
          },
        ],
      },
    }),
  },
];
