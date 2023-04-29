// Generated by 'gc gencode'
const { pipe, get, eq, and } = require("rubico");
const { find } = require("rubico/x");

exports.createResources = () => [
  { type: "ElasticIpAddress", group: "EC2", name: "NATIP" },
  { type: "InternetGateway", group: "EC2", name: "InternetGateway" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "VPC",
      internetGateway: "InternetGateway",
    }),
  },
  {
    type: "LaunchTemplate",
    group: "EC2",
    name: "eksctl-my-cluster-nodegroup-ng-1",
    properties: ({}) => ({
      LaunchTemplateData: {
        BlockDeviceMappings: [
          {
            DeviceName: "/dev/xvda",
            Ebs: {
              Iops: 3000,
              Throughput: 125,
              VolumeSize: 80,
              VolumeType: "gp3",
            },
          },
        ],
        MetadataOptions: {
          HttpPutResponseHopLimit: 2,
          HttpTokens: "optional",
        },
      },
    }),
    dependencies: ({}) => ({
      securityGroups: ["sg::VPC::eks-cluster-sg-my-cluster-1909614887"],
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "NATGateway",
    properties: ({}) => ({
      PrivateIpAddressIndex: 6429,
    }),
    dependencies: ({}) => ({
      subnet: "VPC::SubnetPublicUSEAST1F",
      eip: "NATIP",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "NATGateway",
      routeTable: "VPC::PrivateRouteTableUSEAST1D",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "NATGateway",
      routeTable: "VPC::PrivateRouteTableUSEAST1F",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "InternetGateway",
      routeTable: "VPC::PublicRouteTable",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "PrivateRouteTableUSEAST1D",
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "PrivateRouteTableUSEAST1F",
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "PublicRouteTable",
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "VPC::PrivateRouteTableUSEAST1D",
      subnet: "VPC::SubnetPrivateUSEAST1D",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "VPC::PrivateRouteTableUSEAST1F",
      subnet: "VPC::SubnetPrivateUSEAST1F",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "VPC::PublicRouteTable",
      subnet: "VPC::SubnetPublicUSEAST1D",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "VPC::PublicRouteTable",
      subnet: "VPC::SubnetPublicUSEAST1F",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "ClusterSharedNodeSecurityGroup",
      Description: "Communication between all nodes in the cluster",
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "ControlPlaneSecurityGroup",
      Description:
        "Communication between the control plane and worker nodegroups",
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "sg::VPC::eks-cluster-sg-my-cluster-1909614887",
    readOnly: true,
    filterLives: ({ resources }) =>
      pipe([
        () => resources,
        find(
          pipe([
            get("live.Tags"),
            find(
              and([
                eq(get("Key"), "aws:eks:cluster-name"),
                eq(get("Value"), "my-cluster"),
              ])
            ),
          ])
        ),
      ])(),
    dependencies: ({}) => ({
      vpc: "VPC",
      eksCluster: "my-cluster",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpProtocol: "-1",
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::VPC::ClusterSharedNodeSecurityGroup",
      securityGroupFrom: ["sg::VPC::eks-cluster-sg-my-cluster-1909614887"],
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "SubnetPrivateUSEAST1D",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}d`,
      Tags: [
        {
          Key: "kubernetes.io/role/internal-elb",
          Value: "1",
        },
      ],
      NewBits: 3,
      NetworkNumber: 3,
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "SubnetPrivateUSEAST1F",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}f`,
      Tags: [
        {
          Key: "kubernetes.io/role/internal-elb",
          Value: "1",
        },
      ],
      NewBits: 3,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "SubnetPublicUSEAST1D",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}d`,
      MapPublicIpOnLaunch: true,
      Tags: [
        {
          Key: "kubernetes.io/role/elb",
          Value: "1",
        },
      ],
      NewBits: 3,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "SubnetPublicUSEAST1F",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}f`,
      MapPublicIpOnLaunch: true,
      Tags: [
        {
          Key: "kubernetes.io/role/elb",
          Value: "1",
        },
      ],
      NewBits: 3,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
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
  {
    type: "Cluster",
    group: "EKS",
    properties: ({}) => ({
      name: "my-cluster",
      tags: {
        mykey1: "value",
      },
    }),
    dependencies: ({}) => ({
      subnets: [
        "VPC::SubnetPrivateUSEAST1D",
        "VPC::SubnetPrivateUSEAST1F",
        "VPC::SubnetPublicUSEAST1D",
        "VPC::SubnetPublicUSEAST1F",
      ],
      securityGroups: ["sg::VPC::ControlPlaneSecurityGroup"],
      role: "eksctl-my-cluster-cluster-ServiceRole-1T8YHA5ZIYVRB",
    }),
  },
  {
    type: "NodeGroup",
    group: "EKS",
    properties: ({}) => ({
      nodegroupName: "ng-1",
      capacityType: "ON_DEMAND",
      scalingConfig: {
        desiredSize: 1,
        maxSize: 1,
        minSize: 1,
      },
      labels: {
        "alpha.eksctl.io/cluster-name": "my-cluster",
        "alpha.eksctl.io/nodegroup-name": "ng-1",
      },
      tags: {
        mykey1: "value",
      },
    }),
    dependencies: ({}) => ({
      cluster: "my-cluster",
      subnets: ["VPC::SubnetPublicUSEAST1D", "VPC::SubnetPublicUSEAST1F"],
      role: "eksctl-my-cluster-nodegroup-ng-1-NodeInstanceRole-1LT5OVYUG2SEI",
      launchTemplate: "eksctl-my-cluster-nodegroup-ng-1",
    }),
  },
  {
    type: "OpenIDConnectProvider",
    group: "IAM",
    dependencies: ({}) => ({
      cluster: "my-cluster",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "eksctl-my-cluster-cluster-ServiceRole-1T8YHA5ZIYVRB",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "eks.amazonaws.com",
            },
          },
        ],
        Version: "2012-10-17",
      },
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: ["cloudwatch:PutMetricData"],
                Effect: "Allow",
                Resource: "*",
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "eksctl-my-cluster-cluster-PolicyCloudWatchMetrics",
        },
        {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  "ec2:DescribeAccountAttributes",
                  "ec2:DescribeAddresses",
                  "ec2:DescribeInternetGateways",
                ],
                Effect: "Allow",
                Resource: "*",
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "eksctl-my-cluster-cluster-PolicyELBPermissions",
        },
      ],
      AttachedPolicies: [
        {
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
          PolicyName: "AmazonEKSClusterPolicy",
        },
        {
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
          PolicyName: "AmazonEKSVPCResourceController",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "eksctl-my-cluster-nodegroup-ng-1-NodeInstanceRole-1LT5OVYUG2SEI",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
          },
        ],
        Version: "2012-10-17",
      },
      AttachedPolicies: [
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
          PolicyName: "AmazonEC2ContainerRegistryReadOnly",
        },
        {
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
          PolicyName: "AmazonEKS_CNI_Policy",
        },
        {
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
          PolicyName: "AmazonEKSWorkerNodePolicy",
        },
        {
          PolicyArn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
          PolicyName: "AmazonSSMManagedInstanceCore",
        },
      ],
    }),
  },
];
