// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "ClusterSharedNode",
      Description: "Communication between all nodes in the cluster",
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpProtocol: "-1",
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::VPC::ClusterSharedNode",
      securityGroupFrom: ["sg::VPC::ClusterSharedNode"],
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "VPC",
    properties: ({}) => ({
      CidrBlock: "192.168.0.0/16",
      DnsHostnames: true,
    }),
  },
];
