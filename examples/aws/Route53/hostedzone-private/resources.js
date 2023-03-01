// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc-1",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc-2",
    properties: ({}) => ({
      CidrBlock: "10.1.0.0/16",
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "test.grucloud.org.",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-1",
    }),
  },
  {
    type: "ZoneVpcAssociation",
    group: "Route53",
    dependencies: ({}) => ({
      hostedZone: "test.grucloud.org.",
      vpc: "vpc-2",
    }),
  },
];
