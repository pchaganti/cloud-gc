// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "project-vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "project-igw" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "project-vpc",
      internetGateway: "project-igw",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: ({ config }) => `project-nat-public1-${config.region}a`,
    dependencies: ({ config }) => ({
      subnet: `project-vpc::project-subnet-public1-${config.region}a`,
      eip: `project-eip-${config.region}a`,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) =>
      `project-vpc::project-subnet-private1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      CidrBlock: "10.0.128.0/20",
    }),
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) =>
      `project-vpc::project-subnet-private2-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      CidrBlock: "10.0.144.0/20",
    }),
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) =>
      `project-vpc::project-subnet-public1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      CidrBlock: "10.0.0.0/20",
    }),
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) =>
      `project-vpc::project-subnet-public2-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      CidrBlock: "10.0.16.0/20",
    }),
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `project-vpc::project-rtb-private1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `project-vpc::project-rtb-private2-${config.region}b`,
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "project-vpc::project-rtb-public",
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `project-vpc::project-rtb-private1-${config.region}a`,
      subnet: `project-vpc::project-subnet-private1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `project-vpc::project-rtb-private2-${config.region}b`,
      subnet: `project-vpc::project-subnet-private2-${config.region}b`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: "project-vpc::project-rtb-public",
      subnet: `project-vpc::project-subnet-public1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: "project-vpc::project-rtb-public",
      subnet: `project-vpc::project-subnet-public2-${config.region}b`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      routeTable: `project-vpc::project-rtb-private1-${config.region}a`,
      natGateway: `project-nat-public1-${config.region}a`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      routeTable: `project-vpc::project-rtb-private2-${config.region}b`,
      natGateway: `project-nat-public1-${config.region}a`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "project-vpc::project-rtb-public",
      ig: "project-igw",
    }),
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: ({ config }) => `project-eip-${config.region}a`,
  },
];
