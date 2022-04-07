// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
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
    }),
    dependencies: () => ({
      keyPair: "kp-ecs",
      iamInstanceProfile: "role-ecs",
      securityGroups: ["EcsSecurityGroup"],
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
    properties: ({}) => ({
      Tags: [
        {
          Key: "mykey",
          Value: "value",
        },
      ],
    }),
    dependencies: () => ({
      roles: ["role-ecs"],
    }),
  },
];