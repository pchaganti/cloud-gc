// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Instance",
    group: "EC2",
    name: "web-server-ec2-simple",
    properties: ({ config }) => ({
      Image: {
        Description: "Amazon Linux 2 AMI 2.0.20211001.1 x86_64 HVM gp2",
      },
      InstanceType: "t2.micro",
      Placement: {
        AvailabilityZone: `${config.region}d`,
      },
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: ({}) => ({
      subnets: ["vpc-default::subnet-default-d"],
      securityGroups: ["sg::vpc-default::default"],
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
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-d",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  { type: "Vpc", group: "EC2", name: "vpc-default", isDefault: true },
];
