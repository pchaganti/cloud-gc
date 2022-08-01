// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc-test-sg",
    properties: ({}) => ({
      CidrBlock: "10.1.0.0/16",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "security-group-cluster-test",
      Description: "Managed By GruCloud",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-test-sg",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "security-group-node-group-test",
      Description: "Managed By GruCloud",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-test-sg",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 22,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      Ipv6Ranges: [
        {
          CidrIpv6: "::/0",
        },
      ],
      ToPort: 22,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc-test-sg::security-group-cluster-test",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 0,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      Ipv6Ranges: [
        {
          CidrIpv6: "::/0",
        },
      ],
      ToPort: 65535,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc-test-sg::security-group-node-group-test",
      securityGroupFrom: ["sg::vpc-test-sg::security-group-cluster-test"],
    }),
  },
  {
    type: "SecurityGroupRuleEgress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 1024,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      Ipv6Ranges: [
        {
          CidrIpv6: "::/0",
        },
      ],
      ToPort: 65535,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc-test-sg::security-group-cluster-test",
    }),
  },
];
