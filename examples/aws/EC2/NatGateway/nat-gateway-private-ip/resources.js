// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "my-vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "my-nat-gateway" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "my-vpc",
      internetGateway: "my-nat-gateway",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "my-nat-gateway",
    properties: ({}) => ({
      PrivateIpAddressIndex: 826,
    }),
    dependencies: ({}) => ({
      subnet: "my-vpc::subnet-private",
      eip: "my-ip",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-private",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 8,
    }),
    dependencies: ({}) => ({
      vpc: "my-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "rtb-1",
    dependencies: ({}) => ({
      vpc: "my-vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "my-vpc::rtb-1",
      subnet: "my-vpc::subnet-private",
    }),
  },
  { type: "ElasticIpAddress", group: "EC2", name: "my-ip" },
];
