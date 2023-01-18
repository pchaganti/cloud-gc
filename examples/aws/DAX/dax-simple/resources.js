// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Cluster",
    group: "DAX",
    properties: ({}) => ({
      SSESpecification: {
        Enabled: true,
      },
      ReplicationFactor: 2,
      ClusterEndpointEncryptionType: "TLS",
      ClusterName: "my-dax-cluster",
      NodeType: "dax.t2.small",
      PreferredMaintenanceWindow: "mon:06:30-mon:07:30",
    }),
    dependencies: ({}) => ({
      subnetGroup: "my-subnetgroup",
      iamRole: "daxdynamodb",
      securityGroups: ["sg::vpc-default::default"],
    }),
  },
  {
    type: "ParameterGroup",
    group: "DAX",
    properties: ({}) => ({
      Description: " ",
      ParameterGroupName: "my-parameter-group",
      ParameterNameValues: [
        {
          ParameterName: "query-ttl-millis",
          ParameterValue: "18000001",
        },
        {
          ParameterName: "record-ttl-millis",
          ParameterValue: "18000001",
        },
      ],
    }),
  },
  {
    type: "SubnetGroup",
    group: "DAX",
    properties: ({}) => ({
      SubnetGroupName: "my-subnetgroup",
    }),
    dependencies: ({}) => ({
      subnets: [
        "vpc-default::subnet-default-a",
        "vpc-default::subnet-default-b",
      ],
    }),
  },
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
      RoleName: "daxdynamodb",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "dax.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: ["DAXFullAccess-daxdynamodb"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "DAXFullAccess-daxdynamodb",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:BatchGetItem",
              "dynamodb:GetItem",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:BatchWriteItem",
              "dynamodb:DeleteItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DescribeLimits",
              "dynamodb:DescribeTimeToLive",
              "dynamodb:DescribeTable",
              "dynamodb:ListTables",
            ],
            Resource: [
              `arn:aws:dynamodb:${config.region}:${config.accountId()}:table/*`,
            ],
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
];
