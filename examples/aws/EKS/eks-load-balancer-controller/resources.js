// Generated by 'gc gencode'
const { pipe, get, eq, and } = require("rubico");
const { find } = require("rubico/x");

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
    type: "InternetGateway",
    group: "EC2",
    name: "InternetGateway",
  },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "VPC",
      internetGateway: "InternetGateway",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "NATGateway",
    dependencies: () => ({
      subnet: "SubnetPublicUSEAST1F",
      eip: "NATIP",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "SubnetPrivateUSEAST1D",
    properties: ({ config }) => ({
      CidrBlock: "192.168.96.0/19",
      AvailabilityZone: `${config.region}d`,
      Tags: [
        {
          Key: "kubernetes.io/role/internal-elb",
          Value: "1",
        },
      ],
    }),
    dependencies: () => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "SubnetPrivateUSEAST1F",
    properties: ({ config }) => ({
      CidrBlock: "192.168.64.0/19",
      AvailabilityZone: `${config.region}f`,
      Tags: [
        {
          Key: "kubernetes.io/role/internal-elb",
          Value: "1",
        },
      ],
    }),
    dependencies: () => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "SubnetPublicUSEAST1D",
    properties: ({ config }) => ({
      CidrBlock: "192.168.32.0/19",
      AvailabilityZone: `${config.region}d`,
      MapPublicIpOnLaunch: true,
      Tags: [
        {
          Key: "kubernetes.io/role/elb",
          Value: "1",
        },
      ],
    }),
    dependencies: () => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "SubnetPublicUSEAST1F",
    properties: ({ config }) => ({
      CidrBlock: "192.168.0.0/19",
      AvailabilityZone: `${config.region}f`,
      MapPublicIpOnLaunch: true,
      Tags: [
        {
          Key: "kubernetes.io/role/elb",
          Value: "1",
        },
      ],
    }),
    dependencies: () => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "PrivateRouteTableUSEAST1D",
    dependencies: () => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "PrivateRouteTableUSEAST1F",
    dependencies: () => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "PublicRouteTable",
    dependencies: () => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "PrivateRouteTableUSEAST1D",
      subnet: "SubnetPrivateUSEAST1D",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "PrivateRouteTableUSEAST1F",
      subnet: "SubnetPrivateUSEAST1F",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "PublicRouteTable",
      subnet: "SubnetPublicUSEAST1D",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "PublicRouteTable",
      subnet: "SubnetPublicUSEAST1F",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "PrivateRouteTableUSEAST1D",
      natGateway: "NATGateway",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "PrivateRouteTableUSEAST1F",
      natGateway: "NATGateway",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "PublicRouteTable",
      ig: "InternetGateway",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "ClusterSharedNodeSecurityGroup",
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
    name: "ControlPlaneSecurityGroup",
    properties: ({}) => ({
      Description:
        "Communication between the control plane and worker nodegroups",
    }),
    dependencies: () => ({
      vpc: "VPC",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "eks-cluster-sg-my-cluster-1909614887",
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
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpProtocol: "-1",
    }),
    dependencies: () => ({
      securityGroup: "ClusterSharedNodeSecurityGroup",
      securityGroupFrom: ["ClusterSharedNodeSecurityGroup"],
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpProtocol: "-1",
    }),
    dependencies: () => ({
      securityGroup: "ClusterSharedNodeSecurityGroup",
      securityGroupFrom: ["eks-cluster-sg-my-cluster-1909614887"],
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpProtocol: "-1",
    }),
    dependencies: () => ({
      securityGroup: "eks-cluster-sg-my-cluster-1909614887",
      securityGroupFrom: "ClusterSharedNodeSecurityGroup",
    }),
  },
  { type: "ElasticIpAddress", group: "EC2", name: "NATIP" },
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
              VolumeSize: 80,
              VolumeType: "gp3",
              Throughput: 125,
            },
          },
        ],
        MetadataOptions: {
          HttpTokens: "optional",
          HttpPutResponseHopLimit: 2,
        },
      },
    }),
    dependencies: () => ({
      securityGroups: ["eks-cluster-sg-my-cluster-1909614887"],
    }),
  },
  {
    type: "Cluster",
    group: "EKS",
    name: "my-cluster",
    properties: ({}) => ({
      version: "1.20",
    }),
    dependencies: () => ({
      subnets: [
        "SubnetPrivateUSEAST1D",
        "SubnetPrivateUSEAST1F",
        "SubnetPublicUSEAST1D",
        "SubnetPublicUSEAST1F",
      ],
      securityGroups: ["ControlPlaneSecurityGroup"],
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
        minSize: 1,
        maxSize: 1,
        desiredSize: 1,
      },
      labels: {
        "alpha.eksctl.io/nodegroup-name": "ng-1",
        "alpha.eksctl.io/cluster-name": "my-cluster",
      },
    }),
    dependencies: () => ({
      cluster: "my-cluster",
      subnets: ["SubnetPublicUSEAST1D", "SubnetPublicUSEAST1F"],
      role: "eksctl-my-cluster-nodegroup-ng-1-NodeInstanceRole-1LT5OVYUG2SEI",
      launchTemplate: "eksctl-my-cluster-nodegroup-ng-1",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "eksctl-my-cluster-cluster-ServiceRole-1T8YHA5ZIYVRB",
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "eks.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["cloudwatch:PutMetricData"],
                Resource: `*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "eksctl-my-cluster-cluster-PolicyCloudWatchMetrics",
        },
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "ec2:DescribeAccountAttributes",
                  "ec2:DescribeAddresses",
                  "ec2:DescribeInternetGateways",
                ],
                Resource: `*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "eksctl-my-cluster-cluster-PolicyELBPermissions",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AmazonEKSClusterPolicy",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
        },
        {
          PolicyName: "AmazonEKSVPCResourceController",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
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
      AttachedPolicies: [
        {
          PolicyName: "AmazonEC2ContainerRegistryReadOnly",
          PolicyArn:
            "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
        },
        {
          PolicyName: "AmazonEKSWorkerNodePolicy",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
        },
        {
          PolicyName: "AmazonEKS_CNI_Policy",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
        },
        {
          PolicyName: "AmazonSSMManagedInstanceCore",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
        },
      ],
    }),
  },
];
