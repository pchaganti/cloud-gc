// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "project-vpc-endpoint-vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "project-vpc-endpoint-subnet-private1-us-east-1a",
    properties: ({ config }) => ({
      CidrBlock: "10.0.128.0/20",
      AvailabilityZone: `${config.region}a`,
    }),
    dependencies: () => ({
      vpc: "project-vpc-endpoint-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "project-vpc-endpoint-rtb-private1-us-east-1a",
    dependencies: () => ({
      vpc: "project-vpc-endpoint-vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "project-vpc-endpoint-rtb-private1-us-east-1a",
      subnet: "project-vpc-endpoint-subnet-private1-us-east-1a",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    dependencies: () => ({
      routeTable: "project-vpc-endpoint-rtb-private1-us-east-1a",
      vpcEndpoint: "project-vpc-endpoint-vpce-s3",
    }),
  },
  {
    type: "VpcEndpoint",
    group: "EC2",
    name: "project-vpc-endpoint-vpce-s3",
    properties: ({}) => ({
      PolicyDocument: {
        Version: "2008-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: "*",
            Resource: `*`,
          },
        ],
      },
      PrivateDnsEnabled: false,
      RequesterManaged: false,
      VpcEndpointType: "Gateway",
    }),
    dependencies: () => ({
      vpc: "project-vpc-endpoint-vpc",
      routeTables: ["project-vpc-endpoint-rtb-private1-us-east-1a"],
    }),
  },
];