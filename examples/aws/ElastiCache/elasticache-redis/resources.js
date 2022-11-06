// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "elasticache/redis",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `subnet-private1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 8,
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `subnet-private2-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 4,
      NetworkNumber: 9,
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `rtb-private1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `rtb-private2-${config.region}b`,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpc::rtb-private1-${config.region}a`,
      subnet: `vpc::subnet-private1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpc::rtb-private2-${config.region}b`,
      subnet: `vpc::subnet-private2-${config.region}b`,
    }),
  },
  {
    type: "CacheSubnetGroup",
    group: "ElastiCache",
    properties: ({}) => ({
      CacheSubnetGroupName: "my-sutnet-group",
      CacheSubnetGroupDescription: " ",
    }),
    dependencies: ({ config }) => ({
      subnets: [
        `vpc::subnet-private1-${config.region}a`,
        `vpc::subnet-private2-${config.region}b`,
      ],
    }),
  },
  {
    type: "ReplicationGroup",
    group: "ElastiCache",
    properties: ({}) => ({
      ReplicationGroupDescription: " ",
      ReplicationGroupId: "my-simple-redis-cluster-3",
      SnapshotRetentionLimit: 1,
      SnapshotWindow: "06:30-07:30",
      ClusterEnabled: false,
      CacheNodeType: "cache.t2.micro",
      LogDeliveryConfigurations: [],
      CacheParameterGroupName: "default.redis6.x",
      CacheSubnetGroupName: "my-sutnet-group",
      NumCacheClusters: 2,
    }),
    dependencies: ({}) => ({
      subnetGroup: "my-sutnet-group",
    }),
  },
];
