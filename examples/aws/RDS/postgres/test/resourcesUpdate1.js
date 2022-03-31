// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "DBSubnetGroup",
    group: "RDS",
    name: "subnet-group-postgres",
    properties: ({}) => ({
      DBSubnetGroupDescription: "db subnet group",
      Tags: [
        {
          Key: "mykey1",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: () => ({
      subnets: ["subnet-1", "subnet-2"],
    }),
  },
  {
    type: "DBInstance",
    group: "RDS",
    name: "db-instance",
    properties: ({ config }) => ({
      DBInstanceClass: "db.t3.micro",
      Engine: "postgres",
      EngineVersion: "14.2",
      AllocatedStorage: 20,
      MaxAllocatedStorage: 1000,
      PubliclyAccessible: true,
      PreferredBackupWindow: "22:10-22:40",
      PreferredMaintenanceWindow: "fri:23:40-sat:00:10",
      BackupRetentionPeriod: 1,
      MasterUsername: process.env.DB_INSTANCE_MASTER_USERNAME,
      MasterUserPassword: process.env.DB_INSTANCE_MASTER_USER_PASSWORD,
      Tags: [
        {
          Key: "mykey1",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: () => ({
      dbSubnetGroup: "subnet-group-postgres",
      securityGroups: ["security-group"],
    }),
  },
];
