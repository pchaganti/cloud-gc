// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "Vpc", group: "EC2", name: "vpc-default", isDefault: true },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-a",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-b",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-c",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-d",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-e",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
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
    name: "sg::vpc-default::default",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "rds-monitoring-role",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "monitoring.rds.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonRDSEnhancedMonitoringRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole",
        },
      ],
    }),
  },
  {
    type: "DBCluster",
    group: "RDS",
    properties: ({}) => ({
      AllocatedStorage: 100,
      BackupRetentionPeriod: 7,
      DBClusterIdentifier: "database-1",
      MultiAZ: true,
      Engine: "postgres",
      EngineVersion: "13.7",
      MasterUsername: process.env.DATABASE_1_MASTER_USERNAME,
      PreferredBackupWindow: "04:08-04:38",
      PreferredMaintenanceWindow: "wed:10:12-wed:10:42",
      IAMDatabaseAuthenticationEnabled: false,
      EngineMode: "provisioned",
      DeletionProtection: false,
      HttpEndpointEnabled: false,
      DBClusterInstanceClass: "db.m5d.large",
      StorageType: "io1",
      Iops: 2999,
      PubliclyAccessible: false,
      MonitoringInterval: 0,
      PerformanceInsightsEnabled: false,
      MasterUserPassword: process.env.DATABASE_1_MASTER_USER_PASSWORD,
    }),
    dependencies: ({}) => ({
      dbSubnetGroup: "default-vpc-faff3987",
    }),
  },
  // {
  //   type: "DBInstance",
  //   group: "RDS",
  //   properties: ({}) => ({
  //     DBInstanceIdentifier: "database-1-instance-1",
  //     DBInstanceClass: "db.m5d.large",
  //     Engine: "postgres",
  //     PreferredMaintenanceWindow: "wed:10:12-wed:10:42",
  //     EngineVersion: "13.7",
  //     AutoMinorVersionUpgrade: false,
  //     Iops: 2999,
  //     PubliclyAccessible: false,
  //     StorageType: "io1",
  //     DBClusterIdentifier: "database-1",
  //     StorageEncrypted: true,
  //   }),
  //   dependencies: ({}) => ({
  //     dbSubnetGroup: "default-vpc-faff3987",
  //     securityGroups: ["sg::vpc-default::default"],
  //     dbCluster: "database-1",
  //   }),
  // },
  // {
  //   type: "DBInstance",
  //   group: "RDS",
  //   properties: ({}) => ({
  //     DBInstanceIdentifier: "database-1-instance-2",
  //     DBInstanceClass: "db.m5d.large",
  //     Engine: "postgres",
  //     PreferredMaintenanceWindow: "wed:10:12-wed:10:42",
  //     EngineVersion: "13.7",
  //     AutoMinorVersionUpgrade: false,
  //     Iops: 2999,
  //     PubliclyAccessible: false,
  //     StorageType: "io1",
  //     DBClusterIdentifier: "database-1",
  //     StorageEncrypted: true,
  //   }),
  //   dependencies: ({}) => ({
  //     dbSubnetGroup: "default-vpc-faff3987",
  //     securityGroups: ["sg::vpc-default::default"],
  //     dbCluster: "database-1",
  //   }),
  // },
  // {
  //   type: "DBInstance",
  //   group: "RDS",
  //   properties: ({}) => ({
  //     DBInstanceIdentifier: "database-1-instance-3",
  //     DBInstanceClass: "db.m5d.large",
  //     Engine: "postgres",
  //     PreferredMaintenanceWindow: "wed:10:12-wed:10:42",
  //     EngineVersion: "13.7",
  //     AutoMinorVersionUpgrade: false,
  //     Iops: 2999,
  //     PubliclyAccessible: false,
  //     StorageType: "io1",
  //     DBClusterIdentifier: "database-1",
  //     StorageEncrypted: true,
  //   }),
  //   dependencies: ({}) => ({
  //     dbSubnetGroup: "default-vpc-faff3987",
  //     securityGroups: ["sg::vpc-default::default"],
  //     dbCluster: "database-1",
  //   }),
  // },
  {
    type: "DBSubnetGroup",
    group: "RDS",
    properties: ({}) => ({
      DBSubnetGroupName: "default-vpc-faff3987",
      DBSubnetGroupDescription: "Created from the RDS Management Console",
    }),
    dependencies: ({}) => ({
      subnets: [
        "vpc-default::subnet-default-a",
        "vpc-default::subnet-default-b",
        "vpc-default::subnet-default-c",
        "vpc-default::subnet-default-d",
        "vpc-default::subnet-default-e",
        "vpc-default::subnet-default-f",
      ],
    }),
  },
];
