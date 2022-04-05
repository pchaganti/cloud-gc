// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "AutoScalingGroup",
    group: "AutoScaling",
    name: "asg",
    properties: ({}) => ({
      MinSize: 1,
      MaxSize: 1,
      DesiredCapacity: 1,
      Tags: [
        {
          Key: "mykey1",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: () => ({
      subnets: ["PubSubnetAz1", "PubSubnetAz2"],
      launchTemplate: "lt-ec2-micro",
    }),
  },
  { type: "KeyPair", group: "EC2", name: "kp-ecs" },
  {
    type: "Vpc",
    group: "EC2",
    name: "Vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "PubSubnetAz1",
    properties: ({ config }) => ({
      CidrBlock: "10.0.0.0/24",
      AvailabilityZone: `${config.region}a`,
    }),
    dependencies: () => ({
      vpc: "Vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "PubSubnetAz2",
    properties: ({ config }) => ({
      CidrBlock: "10.0.1.0/24",
      AvailabilityZone: `${config.region}b`,
    }),
    dependencies: () => ({
      vpc: "Vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "EcsSecurityGroup",
    properties: ({}) => ({
      Description: "Managed By GruCloud",
    }),
    dependencies: () => ({
      vpc: "Vpc",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 80,
        IpProtocol: "tcp",
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
        ToPort: 80,
      },
    }),
    dependencies: () => ({
      securityGroup: "EcsSecurityGroup",
    }),
  },
  {
    type: "LaunchTemplate",
    group: "EC2",
    name: "lt-ec2-micro",
    properties: ({}) => ({
      LaunchTemplateData: {
        ImageId: "ami-02e136e904f3da870",
        InstanceType: "t2.micro",
      },
      Tags: [
        {
          Key: "mykey1",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: () => ({
      keyPair: "kp-ecs",
      iamInstanceProfile: "role-ecs",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "role-ecs",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `ec2.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "role-ecs",
    dependencies: () => ({
      roles: ["role-ecs"],
    }),
  },
];
