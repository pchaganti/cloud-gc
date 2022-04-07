// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "VPC",
    properties: ({}) => ({
      CidrBlock: "192.168.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "ClusterSharedNode",
    properties: ({}) => ({
      Description: "Communication between all nodes in the cluster",
    }),
    dependencies: () => ({
      vpc: "VPC",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "eks-cluster-sg-my-cluster",
    properties: ({}) => ({
      Description:
        "EKS created security group applied to ENI that is attached to EKS Control Plane master nodes, as well as any managed workloads.",
      Tags: [
        {
          Key: "kubernetes.io/cluster/my-cluster",
          Value: "owned",
        },
      ],
    }),
    dependencies: () => ({
      vpc: "VPC",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        IpProtocol: "-1",
      },
    }),
    dependencies: () => ({
      securityGroup: "ClusterSharedNode",
      securityGroupFrom: ["eks-cluster-sg-my-cluster"],
    }),
  },
];