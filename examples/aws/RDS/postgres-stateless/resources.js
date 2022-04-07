// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "/aws/rds/cluster/cluster-postgres-stateless/postgresql",
  },
  { type: "KeyPair", group: "EC2", name: "kp-postgres-stateless" },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "192.168.0.0/16",
    }),
  },
  {
    type: "InternetGateway",
    group: "EC2",
    name: "internet-gateway",
    dependencies: () => ({
      vpc: "vpc",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "nat-gateway",
    dependencies: () => ({
      subnet: "subnet-public-a",
      eip: "iep",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-private-a",
    properties: ({ config }) => ({
      CidrBlock: "192.168.96.0/19",
      AvailabilityZone: `${config.region}a`,
    }),
    dependencies: () => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-private-b",
    properties: ({ config }) => ({
      CidrBlock: "192.168.128.0/19",
      AvailabilityZone: `${config.region}b`,
    }),
    dependencies: () => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-public-a",
    properties: ({ config }) => ({
      CidrBlock: "192.168.0.0/19",
      AvailabilityZone: `${config.region}a`,
    }),
    dependencies: () => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-public-b",
    properties: ({ config }) => ({
      CidrBlock: "192.168.32.0/19",
      AvailabilityZone: `${config.region}b`,
    }),
    dependencies: () => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "route-table-private-a",
    dependencies: () => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "route-table-private-b",
    dependencies: () => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "route-table-public",
    dependencies: () => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "route-table-private-a",
      subnet: "subnet-private-a",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "route-table-private-b",
      subnet: "subnet-private-b",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "route-table-public",
      subnet: "subnet-public-a",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "route-table-public",
      subnet: "subnet-public-b",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "route-table-private-a",
      natGateway: "nat-gateway",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "route-table-private-b",
      natGateway: "nat-gateway",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "route-table-public",
      ig: "internet-gateway",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "security-group-postgres",
    properties: ({}) => ({
      Description: "Managed By GruCloud",
    }),
    dependencies: () => ({
      vpc: "vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "security-group-public",
    properties: ({}) => ({
      Description: "Managed By GruCloud",
    }),
    dependencies: () => ({
      vpc: "vpc",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 5432,
        IpProtocol: "tcp",
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
        Ipv6Ranges: [
          {
            CidrIpv6: "::/0",
          },
        ],
        ToPort: 5432,
      },
    }),
    dependencies: () => ({
      securityGroup: "security-group-postgres",
      securityGroupFrom: ["security-group-public"],
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 22,
        IpProtocol: "tcp",
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
        Ipv6Ranges: [
          {
            CidrIpv6: "::/0",
          },
        ],
        ToPort: 22,
      },
    }),
    dependencies: () => ({
      securityGroup: "security-group-public",
    }),
  },
  { type: "ElasticIpAddress", group: "EC2", name: "eip-bastion" },
  { type: "ElasticIpAddress", group: "EC2", name: "iep" },
  {
    type: "Instance",
    group: "EC2",
    name: "bastion",
    properties: ({ config }) => ({
      InstanceType: "t2.micro",
      ImageId: "ami-02e136e904f3da870",
      Placement: {
        AvailabilityZone: `${config.region}a`,
      },
    }),
    dependencies: () => ({
      subnet: "subnet-public-a",
      keyPair: "kp-postgres-stateless",
      eip: "eip-bastion",
      securityGroups: ["security-group-public"],
    }),
  },
  {
    type: "DBSubnetGroup",
    group: "RDS",
    name: "subnet-group-postgres-stateless",
    properties: ({}) => ({
      DBSubnetGroupDescription: "db subnet group",
    }),
    dependencies: () => ({
      subnets: ["subnet-private-a", "subnet-private-b"],
    }),
  },
  {
    type: "DBCluster",
    group: "RDS",
    name: "cluster-postgres-stateless",
    properties: ({}) => ({
      DatabaseName: "dev",
      Engine: "aurora-postgresql",
      EngineVersion: "10.14",
      MasterUsername: process.env.CLUSTER_POSTGRES_STATELESS_MASTER_USERNAME,
      PreferredBackupWindow: "01:39-02:09",
      PreferredMaintenanceWindow: "sun:00:47-sun:01:17",
      IAMDatabaseAuthenticationEnabled: false,
      EngineMode: "serverless",
      Tags: [
        {
          Key: "mykey1",
          Value: "myvalue",
        },
      ],
      ScalingConfiguration: {
        MinCapacity: 2,
        MaxCapacity: 4,
      },
      MasterUserPassword:
        process.env.CLUSTER_POSTGRES_STATELESS_MASTER_USER_PASSWORD,
    }),
    dependencies: () => ({
      dbSubnetGroup: "subnet-group-postgres-stateless",
      securityGroups: ["security-group-postgres"],
    }),
  },
];
