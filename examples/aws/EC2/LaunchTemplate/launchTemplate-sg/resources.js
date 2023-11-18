// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Instance",
    group: "EC2",
    name: "ec2-template-sg",
    properties: ({ config, getId }) => ({
      Placement: {
        AvailabilityZone: `${config.region}a`,
      },
      LaunchTemplate: {
        LaunchTemplateId: `${getId({
          type: "LaunchTemplate",
          group: "EC2",
          name: "lt-ec2-micro",
        })}`,
        Version: "1",
      },
    }),
    dependencies: ({}) => ({
      subnets: ["Vpc::subnet-private"],
      keyPair: "kp-ecs",
      iamInstanceProfile: "role-ecs",
      securityGroups: ["sg::Vpc::EcsSecurityGroup"],
      launchTemplate: "lt-ec2-micro",
    }),
  },
  { type: "KeyPair", group: "EC2", name: "kp-ecs" },
  {
    type: "LaunchTemplate",
    group: "EC2",
    name: "lt-ec2-micro",
    properties: ({}) => ({
      LaunchTemplateData: {
        Image: {
          Description:
            "Amazon Linux 2 LTS Arm64 AMI 2.0.20220606.1 arm64 HVM gp2",
        },
        InstanceType: "t2.micro",
        UserData: `#!/bin/sh
yum update -y
amazon-linux-extras install docker
service docker start
usermod -a -G docker ec2-user
chkconfig docker on`,
      },
    }),
    dependencies: ({}) => ({
      keyPair: "kp-ecs",
      iamInstanceProfile: "role-ecs",
      securityGroups: ["sg::Vpc::EcsSecurityGroup"],
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "EcsSecurityGroup",
      Description: "Managed By GruCloud",
    }),
    dependencies: ({}) => ({
      vpc: "Vpc",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 80,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::Vpc::EcsSecurityGroup",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-private",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 8,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "Vpc",
    }),
  },
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
    dependencies: ({}) => ({
      roles: ["role-ecs"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "role-ecs",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
  },
];
