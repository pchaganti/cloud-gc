// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `memorydb-rtb-private1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "memorydb-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `memorydb-rtb-private2-${config.region}b`,
    dependencies: ({}) => ({
      vpc: "memorydb-vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `memorydb-vpc::memorydb-rtb-private1-${config.region}a`,
      subnet: `memorydb-vpc::memorydb-subnet-private1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `memorydb-vpc::memorydb-rtb-private2-${config.region}b`,
      subnet: `memorydb-vpc::memorydb-subnet-private2-${config.region}b`,
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "sg::memorydb-vpc::default",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "memorydb-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `memorydb-subnet-private1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 8,
    }),
    dependencies: ({}) => ({
      vpc: "memorydb-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `memorydb-subnet-private2-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 4,
      NetworkNumber: 9,
    }),
    dependencies: ({}) => ({
      vpc: "memorydb-vpc",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "memorydb-vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Cluster",
    group: "MemoryDB",
    properties: ({}) => ({
      ACLName: "open-access",
      EngineVersion: "6.2",
      MaintenanceWindow: "wed:06:30-wed:07:30",
      Name: "my-memorydb",
      NodeType: "db.t4g.small",
      NumShards: 1,
      ParameterGroupName: "default.memorydb-redis6",
      SnapshotWindow: "10:00-11:00",
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: ({}) => ({
      securityGroups: ["sg::memorydb-vpc::default"],
      subnetGroup: "subnet-group",
    }),
  },
  {
    type: "SubnetGroup",
    group: "MemoryDB",
    properties: ({}) => ({
      Name: "subnet-group",
    }),
    dependencies: ({ config }) => ({
      subnets: [
        `memorydb-vpc::memorydb-subnet-private1-${config.region}a`,
        `memorydb-vpc::memorydb-subnet-private2-${config.region}b`,
      ],
    }),
  },
];
