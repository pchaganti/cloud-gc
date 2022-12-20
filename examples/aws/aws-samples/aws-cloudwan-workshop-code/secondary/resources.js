// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: ({ config }) => `inspection-${config.region}`,
    properties: ({}) => ({
      CidrBlock: "100.64.0.0/16",
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
      DnsHostnames: true,
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "non-prod",
    properties: ({}) => ({
      CidrBlock: "10.1.0.0/16",
      Tags: [
        {
          Key: "Environment",
          Value: "nonprod",
        },
      ],
      DnsHostnames: true,
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "prod",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      Tags: [
        {
          Key: "Environment",
          Value: "prod",
        },
      ],
      DnsHostnames: true,
    }),
  },
  {
    type: "InternetGateway",
    group: "EC2",
    name: ({ config }) => `inspection-${config.region}`,
    properties: ({}) => ({
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
    }),
  },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({ config }) => ({
      vpc: `inspection-${config.region}`,
      internetGateway: `inspection-${config.region}`,
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: ({ config }) => `nat-public-${config.region}a`,
    properties: ({}) => ({
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
      PrivateIpAddressIndex: 17,
    }),
    dependencies: ({ config }) => ({
      subnet: `inspection-${config.region}::public-${config.region}a`,
      eip: `nat-public-${config.region}a`,
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: ({ config }) => `nat-public-${config.region}b`,
    properties: ({}) => ({
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
      PrivateIpAddressIndex: 165,
    }),
    dependencies: ({ config }) => ({
      subnet: `inspection-${config.region}::public-${config.region}b`,
      eip: `nat-public-${config.region}b`,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `inspection-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
      NewBits: 8,
      NetworkNumber: 0,
    }),
    dependencies: ({ config }) => ({
      vpc: `inspection-${config.region}`,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `inspection-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
      NewBits: 8,
      NetworkNumber: 2,
    }),
    dependencies: ({ config }) => ({
      vpc: `inspection-${config.region}`,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `public-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
      NewBits: 8,
      NetworkNumber: 1,
    }),
    dependencies: ({ config }) => ({
      vpc: `inspection-${config.region}`,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `public-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
      NewBits: 8,
      NetworkNumber: 3,
    }),
    dependencies: ({ config }) => ({
      vpc: `inspection-${config.region}`,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `private-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      Tags: [
        {
          Key: "Environment",
          Value: "nonprod",
        },
      ],
      NewBits: 8,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "non-prod",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `private-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      Tags: [
        {
          Key: "Environment",
          Value: "nonprod",
        },
      ],
      NewBits: 8,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "non-prod",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `private-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      Tags: [
        {
          Key: "Environment",
          Value: "prod",
        },
      ],
      NewBits: 8,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "prod",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `private-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      Tags: [
        {
          Key: "Environment",
          Value: "prod",
        },
      ],
      NewBits: 8,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "prod",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `inspection-${config.region}a`,
    properties: ({}) => ({
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
    }),
    dependencies: ({ config }) => ({
      vpc: `inspection-${config.region}`,
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `inspection-${config.region}b`,
    properties: ({}) => ({
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
    }),
    dependencies: ({ config }) => ({
      vpc: `inspection-${config.region}`,
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `public-${config.region}a`,
    properties: ({}) => ({
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
    }),
    dependencies: ({ config }) => ({
      vpc: `inspection-${config.region}`,
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `public-${config.region}b`,
    properties: ({}) => ({
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
    }),
    dependencies: ({ config }) => ({
      vpc: `inspection-${config.region}`,
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `private-${config.region}a`,
    properties: ({}) => ({
      Tags: [
        {
          Key: "Environment",
          Value: "nonprod",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "non-prod",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `private-${config.region}b`,
    properties: ({}) => ({
      Tags: [
        {
          Key: "Environment",
          Value: "nonprod",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "non-prod",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `private-${config.region}a`,
    properties: ({}) => ({
      Tags: [
        {
          Key: "Environment",
          Value: "prod",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "prod",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `private-${config.region}b`,
    properties: ({}) => ({
      Tags: [
        {
          Key: "Environment",
          Value: "prod",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "prod",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `inspection-${config.region}::inspection-${config.region}a`,
      subnet: `inspection-${config.region}::inspection-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `inspection-${config.region}::inspection-${config.region}b`,
      subnet: `inspection-${config.region}::inspection-${config.region}b`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `inspection-${config.region}::public-${config.region}a`,
      subnet: `inspection-${config.region}::public-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `inspection-${config.region}::public-${config.region}b`,
      subnet: `inspection-${config.region}::public-${config.region}b`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `non-prod::private-${config.region}a`,
      subnet: `non-prod::private-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `non-prod::private-${config.region}b`,
      subnet: `non-prod::private-${config.region}b`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `prod::private-${config.region}a`,
      subnet: `prod::private-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `prod::private-${config.region}b`,
      subnet: `prod::private-${config.region}b`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      natGateway: `nat-public-${config.region}a`,
      routeTable: `inspection-${config.region}::inspection-${config.region}a`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      natGateway: `nat-public-${config.region}b`,
      routeTable: `inspection-${config.region}::inspection-${config.region}b`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      ig: `inspection-${config.region}`,
      routeTable: `inspection-${config.region}::public-${config.region}a`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      ig: `inspection-${config.region}`,
      routeTable: `inspection-${config.region}::public-${config.region}b`,
    }),
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: ({ config }) => `nat-public-${config.region}a`,
    properties: ({}) => ({
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
    }),
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: ({ config }) => `nat-public-${config.region}b`,
    properties: ({}) => ({
      Tags: [
        {
          Key: "Environment",
          Value: "inspection",
        },
      ],
    }),
  },
];
