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
    type: "Account",
    group: "Organisations",
    name: "test account",
    readOnly: true,
    properties: ({}) => ({
      Email: "test@grucloud.com",
      Name: "test account",
    }),
  },
  {
    type: "Namespace",
    group: "RedshiftServerless",
    properties: ({}) => ({
      adminUsername: process.env.DEFAULT_ADMIN_USERNAME,
      dbName: "dev",
      namespaceName: "default",
      adminUserPassword: process.env.DEFAULT_ADMIN_USER_PASSWORD,
    }),
  },
  {
    type: "Snapshot",
    group: "RedshiftServerless",
    properties: ({}) => ({
      snapshotName: "my-snapshot",
      retentionPeriod: 1,
    }),
    dependencies: ({}) => ({
      namespace: "default",
    }),
  },
  {
    type: "ResourcePolicy",
    group: "RedshiftServerless",
    properties: ({ getId }) => ({
      policy: {
        Statement: [
          {
            Effect: "Allow",
            Action: "redshift-serverless:RestoreFromSnapshot",
            Principal: {
              AWS: [
                `${getId({
                  type: "Account",
                  group: "Organisations",
                  name: "test account",
                })}`,
              ],
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      accounts: ["test account"],
      snapshot: "my-snapshot",
    }),
  },
  {
    type: "Workgroup",
    group: "RedshiftServerless",
    properties: ({}) => ({
      baseCapacity: 128,
      enhancedVpcRouting: false,
      publiclyAccessible: false,
      workgroupName: "default",
    }),
    dependencies: ({}) => ({
      namespace: "default",
      securityGroups: ["sg::vpc-default::default"],
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
