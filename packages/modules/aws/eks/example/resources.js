// Generated by 'gc gencode'
const { pipe, tap, get, eq, and } = require("rubico");
const { find } = require("rubico/x");

const createResources = ({ provider }) => {
  provider.EC2.makeVpc({
    name: "VPC",
    properties: ({ config }) => ({
      CidrBlock: "192.168.0.0/16",
      DnsSupport: true,
      DnsHostnames: true,
    }),
  });

  provider.EC2.makeInternetGateway({
    name: "InternetGateway",
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeNatGateway({
    name: "NATGateway",
    dependencies: ({ resources }) => ({
      subnet: resources.EC2.Subnet.subnetPublicUseast1F,
      eip: resources.EC2.ElasticIpAddress.natip,
    }),
  });

  provider.EC2.makeSubnet({
    name: "SubnetPrivateUSEAST1C",
    properties: ({ config }) => ({
      CidrBlock: "192.168.96.0/19",
      AvailabilityZone: "us-east-1c",
      MapPublicIpOnLaunch: false,
      MapCustomerOwnedIpOnLaunch: false,
      Tags: [
        {
          Key: "kubernetes.io/role/internal-elb",
          Value: "1",
        },
      ],
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSubnet({
    name: "SubnetPrivateUSEAST1F",
    properties: ({ config }) => ({
      CidrBlock: "192.168.64.0/19",
      AvailabilityZone: "us-east-1f",
      MapPublicIpOnLaunch: false,
      MapCustomerOwnedIpOnLaunch: false,
      Tags: [
        {
          Key: "kubernetes.io/role/internal-elb",
          Value: "1",
        },
      ],
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSubnet({
    name: "SubnetPublicUSEAST1C",
    properties: ({ config }) => ({
      CidrBlock: "192.168.32.0/19",
      AvailabilityZone: "us-east-1c",
      MapPublicIpOnLaunch: true,
      MapCustomerOwnedIpOnLaunch: false,
      Tags: [
        {
          Key: "kubernetes.io/role/elb",
          Value: "1",
        },
      ],
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSubnet({
    name: "SubnetPublicUSEAST1F",
    properties: ({ config }) => ({
      CidrBlock: "192.168.0.0/19",
      AvailabilityZone: "us-east-1f",
      MapPublicIpOnLaunch: true,
      MapCustomerOwnedIpOnLaunch: false,
      Tags: [
        {
          Key: "kubernetes.io/role/elb",
          Value: "1",
        },
      ],
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeRouteTable({
    name: "PrivateRouteTableUSEAST1C",
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
      subnets: [resources.EC2.Subnet.subnetPrivateUseast1C],
    }),
  });

  provider.EC2.makeRouteTable({
    name: "PrivateRouteTableUSEAST1F",
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
      subnets: [resources.EC2.Subnet.subnetPrivateUseast1F],
    }),
  });

  provider.EC2.makeRouteTable({
    name: "PublicRouteTable",
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
      subnets: [
        resources.EC2.Subnet.subnetPublicUseast1C,
        resources.EC2.Subnet.subnetPublicUseast1F,
      ],
    }),
  });

  provider.EC2.makeRoute({
    name: "PrivateRouteTableUSEAST1C-igw",
    properties: ({ config }) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ resources }) => ({
      routeTable: resources.EC2.RouteTable.privateRouteTableUseast1C,
      natGateway: resources.EC2.NatGateway.natGateway,
    }),
  });

  provider.EC2.makeRoute({
    name: "PrivateRouteTableUSEAST1F-igw",
    properties: ({ config }) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ resources }) => ({
      routeTable: resources.EC2.RouteTable.privateRouteTableUseast1F,
      natGateway: resources.EC2.NatGateway.natGateway,
    }),
  });

  provider.EC2.makeRoute({
    name: "PublicRouteTable-igw",
    properties: ({ config }) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ resources }) => ({
      routeTable: resources.EC2.RouteTable.publicRouteTable,
      ig: resources.EC2.InternetGateway.internetGateway,
    }),
  });

  provider.EC2.makeSecurityGroup({
    name: "ClusterSharedNodeSecurityGroup",
    properties: ({ config }) => ({
      Description: "Communication between all nodes in the cluster",
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSecurityGroup({
    name: "ControlPlaneSecurityGroup",
    properties: ({ config }) => ({
      Description:
        "Communication between the control plane and worker nodegroups",
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.useSecurityGroup({
    name: "eks-cluster-sg-my-cluster-1909614887",
    properties: ({ config }) => ({
      Description:
        "EKS created security group applied to ENI that is attached to EKS Control Plane master nodes, as well as any managed workloads.",
      Tags: [
        {
          Key: "kubernetes.io/cluster/my-cluster",
          Value: "owned",
        },
      ],
    }),
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
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: "ClusterSharedNodeSecurityGroup-rule-ingress-all-from-ClusterSharedNodeSecurityGroup",
    properties: ({ config }) => ({
      IpPermission: {
        IpProtocol: "-1",
        FromPort: -1,
        ToPort: -1,
      },
    }),
    dependencies: ({ resources }) => ({
      securityGroup: resources.EC2.SecurityGroup.clusterSharedNodeSecurityGroup,
      securityGroupFrom:
        resources.EC2.SecurityGroup.clusterSharedNodeSecurityGroup,
    }),
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: "ClusterSharedNodeSecurityGroup-rule-ingress-all-from-eks-cluster-sg-my-cluster-1909614887",
    properties: ({ config }) => ({
      IpPermission: {
        IpProtocol: "-1",
        FromPort: -1,
        ToPort: -1,
      },
    }),
    dependencies: ({ resources }) => ({
      securityGroup: resources.EC2.SecurityGroup.clusterSharedNodeSecurityGroup,
      securityGroupFrom:
        resources.EC2.SecurityGroup.eksClusterSgMyCluster_1909614887,
    }),
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: "eks-cluster-sg-my-cluster-1909614887-rule-ingress-all-from-ClusterSharedNodeSecurityGroup",
    properties: ({ config }) => ({
      IpPermission: {
        IpProtocol: "-1",
        FromPort: -1,
        ToPort: -1,
      },
    }),
    dependencies: ({ resources }) => ({
      securityGroup:
        resources.EC2.SecurityGroup.eksClusterSgMyCluster_1909614887,
      securityGroupFrom:
        resources.EC2.SecurityGroup.clusterSharedNodeSecurityGroup,
    }),
  });

  provider.EC2.makeElasticIpAddress({
    name: "NATIP",
  });

  provider.EC2.makeLaunchTemplate({
    name: "lt-ng-1",
    properties: ({ config }) => ({
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
        ImageId: "ami-0ee7f482baec5230f",
        UserData:
          "TUlNRS1WZXJzaW9uOiAxLjAKQ29udGVudC1UeXBlOiBtdWx0aXBhcnQvbWl4ZWQ7IGJvdW5kYXJ5PSIvLyIKCi0tLy8KQ29udGVudC1UeXBlOiB0ZXh0L3gtc2hlbGxzY3JpcHQ7IGNoYXJzZXQ9InVzLWFzY2lpIgojIS9iaW4vYmFzaApzZXQgLWV4CkI2NF9DTFVTVEVSX0NBPUxTMHRMUzFDUlVkSlRpQkRSVkpVU1VaSlEwRlVSUzB0TFMwdENrMUpTVU0xZWtORFFXTXJaMEYzU1VKQlowbENRVVJCVGtKbmEzRm9hMmxIT1hjd1FrRlJjMFpCUkVGV1RWSk5kMFZSV1VSV1VWRkVSWGR3Y21SWFNtd0tZMjAxYkdSSFZucE5RalJZUkZSSmVFMVVRWGxOVkVsNVRVUkplRTFXYjFoRVZFMTRUVlJCZUU5VVNYbE5SRWw0VFZadmQwWlVSVlJOUWtWSFFURlZSUXBCZUUxTFlUTldhVnBZU25WYVdGSnNZM3BEUTBGVFNYZEVVVmxLUzI5YVNXaDJZMDVCVVVWQ1FsRkJSR2RuUlZCQlJFTkRRVkZ2UTJkblJVSkJUVWd3Q2xsT1dFaGFhMFpEYlVsb2VpOUpTM0JSYVdNNVdFeHpaMmx0V2xacVFqVkxRa0p1U0VwR1lWQmlUM292Y0RCbE5UUkZaRTVqYzBWa1ozZDZTRFprZVZRS1RtNVphMXBEYUdRdk4wRnFSQ3RzZURaaFFXeFVOM1JXVUc1bGEwWnJlazExTVZseVltTmFPV0pvUWxWNFIyWnpjakIyVmt3ek1uQnJhRTlQT0dScE53cG5ObEF3VFhoNVVrMXBNblpsYzJkMVFYQTFSblZSY0hoSmJGcGtTa3hrVldoeUsxVTFVSFp2Tm05dU4wYzROV05OVkdwa2N6TnRSakZNTDNKMFZIRllDa1J6TDBOcEszaHlObmRqTjBvMmJXNXFXbWhPYW5Kdk1VeEVSMVF5YlhCcldsQlhSMHhoTW1ob09IRllRazFVUVdSMWMybE1jRXN6UkUxT00ya3hTbVVLUlhJNFVWZ3pkbTFGSzNsQmJXZFZMMjV5WTB4WllsSkJZVXRTVWpab2NuaHpjekowYVdWM2RUWk1aRWhIUjJ4dVEwSkJlRlprZGpGVFlrTnZWMlFyY1Fwa1ZtSXpabnBJWkU1clQxZERUR3ByVEZoalEwRjNSVUZCWVU1RFRVVkJkMFJuV1VSV1VqQlFRVkZJTDBKQlVVUkJaMHRyVFVFNFIwRXhWV1JGZDBWQ0NpOTNVVVpOUVUxQ1FXWTRkMGhSV1VSV1VqQlBRa0paUlVaUFFVaG9lbTFEUzNsRVpXdGtiR2t6Y1RkeEwxUk9aWEJwYlVaTlFUQkhRMU54UjFOSllqTUtSRkZGUWtOM1ZVRkJORWxDUVZGQ1JVbDZUVE53YUZGVWQwbEdlbVJPVEZVNVVWSk5UVWxCVFRGbWJIaGxiM0JVY1V0d2MzUnpUV2RoTldrNE4wbERTUXBPV1RSMVNFVmpLek0wU2pOSVprVkpLMWhFTkhoQk1VbHlaSGROTDFkMlFqZDFUVXBJTW1SREswZFZNelo1Y2xsV1lWQnVTMVI0UTJ4dmNqaFpiekk1Q2t0T1VUTjRNVUpVVWt0eksyOTBXRFU1ZW1wUWFrSlZRbWN4WlRoaFIxbExhWFJwT0ZwRk16aERaWEZWTVdKWksyVmFRMWN4ZVRRMlJFdzRXakZwSzBVS2JXUlRjWEZQVVVGd05HbHVlSGdyUVRWeFkweHVOMDVJT0dwT2VGUkZhVzkwTjFJeVNtcEZSbnB6Y1ZacmVtcHFWVUkyTW1JMVMwZ3hjM1pMUzFkb2FBcEhlbXc1V1hZMVZ5dGhUV3RXZERGaWNYVXphM0JKUWpoeGFqbHVXazkxTXl0U2IwUmtRa3R2VkRKbk4xZzRjaTlxUXpCc1kwVldZaXR5YjNaeVdTczNDbGxhVDFSQ1ZFMTBSMHhEVFZZcmFEVmhVMUptWTNWT2NFOUNRMjExYUd3M1ZUUlhhd290TFMwdExVVk9SQ0JEUlZKVVNVWkpRMEZVUlMwdExTMHRDZz09CkFQSV9TRVJWRVJfVVJMPWh0dHBzOi8vRjY0RUI0QUI0MDU2NTczMTkyNzQ2RDYyQUU3RDgyNEQuZ3I3LnVzLWVhc3QtMS5la3MuYW1hem9uYXdzLmNvbQpLOFNfQ0xVU1RFUl9ETlNfSVA9MTAuMTAwLjAuMTAKL2V0Yy9la3MvYm9vdHN0cmFwLnNoIG15LWNsdXN0ZXIgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgJy0tbm9kZS1sYWJlbHM9ZWtzLmFtYXpvbmF3cy5jb20vc291cmNlTGF1bmNoVGVtcGxhdGVWZXJzaW9uPTEsYWxwaGEuZWtzY3RsLmlvL2NsdXN0ZXItbmFtZT1teS1jbHVzdGVyLGFscGhhLmVrc2N0bC5pby9ub2RlZ3JvdXAtbmFtZT1uZy0xLGVrcy5hbWF6b25hd3MuY29tL25vZGVncm91cC1pbWFnZT1hbWktMGVlN2Y0ODJiYWVjNTIzMGYsZWtzLmFtYXpvbmF3cy5jb20vY2FwYWNpdHlUeXBlPU9OX0RFTUFORCxla3MuYW1hem9uYXdzLmNvbS9ub2RlZ3JvdXA9bmctMSxla3MuYW1hem9uYXdzLmNvbS9zb3VyY2VMYXVuY2hUZW1wbGF0ZUlkPWx0LTAyZTY4NDNiNWY4MzQ2MjI4JyAtLWI2NC1jbHVzdGVyLWNhICRCNjRfQ0xVU1RFUl9DQSAtLWFwaXNlcnZlci1lbmRwb2ludCAkQVBJX1NFUlZFUl9VUkwgLS1kbnMtY2x1c3Rlci1pcCAkSzhTX0NMVVNURVJfRE5TX0lQCgotLS8vLS0=",
        MetadataOptions: {
          HttpTokens: "optional",
          HttpPutResponseHopLimit: 2,
        },
      },
    }),
  });

  provider.EKS.makeCluster({
    name: "my-cluster",
    properties: ({ config }) => ({
      version: "1.20",
    }),
    dependencies: ({ resources }) => ({
      subnets: [
        resources.EC2.Subnet.subnetPrivateUseast1C,
        resources.EC2.Subnet.subnetPrivateUseast1F,
        resources.EC2.Subnet.subnetPublicUseast1C,
        resources.EC2.Subnet.subnetPublicUseast1F,
      ],
      securityGroups: [resources.EC2.SecurityGroup.controlPlaneSecurityGroup],
      role: resources.IAM.Role.eksctlMyClusterClusterServiceRole_1X24Aqf8Lrqdl,
    }),
  });

  provider.EKS.makeNodeGroup({
    name: "ng-1",
    properties: ({ config }) => ({
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
    dependencies: ({ resources }) => ({
      cluster: resources.EKS.Cluster.myCluster,
      subnets: [
        resources.EC2.Subnet.subnetPublicUseast1C,
        resources.EC2.Subnet.subnetPublicUseast1F,
      ],
      role: resources.IAM.Role
        .eksctlMyClusterNodegroupNg_1NodeInstanceRole_1H4Gn851M2Nx6,
      launchTemplate: resources.EC2.LaunchTemplate.ltNg_1,
    }),
  });

  provider.IAM.makeRole({
    name: "eksctl-my-cluster-cluster-ServiceRole-1X24AQF8LRQDL",
    properties: ({ config }) => ({
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
    }),
    dependencies: ({ resources }) => ({
      policies: [
        resources.IAM.Policy.amazonEksClusterPolicy,
        resources.IAM.Policy.amazonEksvpcResourceController,
      ],
    }),
  });

  provider.IAM.makeRole({
    name: "eksctl-my-cluster-nodegroup-ng-1-NodeInstanceRole-1H4GN851M2NX6",
    properties: ({ config }) => ({
      Path: "/",
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
    dependencies: ({ resources }) => ({
      policies: [
        resources.IAM.Policy.amazonEc2ContainerRegistryReadOnly,
        resources.IAM.Policy.amazonEksCniPolicy,
        resources.IAM.Policy.amazonEksWorkerNodePolicy,
        resources.IAM.Policy.amazonSsmManagedInstanceCore,
      ],
    }),
  });

  provider.IAM.usePolicy({
    name: "AmazonEC2ContainerRegistryReadOnly",
    properties: ({ config }) => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    }),
  });

  provider.IAM.usePolicy({
    name: "AmazonEKS_CNI_Policy",
    properties: ({ config }) => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    }),
  });

  provider.IAM.usePolicy({
    name: "AmazonEKSClusterPolicy",
    properties: ({ config }) => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
    }),
  });

  provider.IAM.usePolicy({
    name: "AmazonEKSVPCResourceController",
    properties: ({ config }) => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
    }),
  });

  provider.IAM.usePolicy({
    name: "AmazonEKSWorkerNodePolicy",
    properties: ({ config }) => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    }),
  });

  provider.IAM.usePolicy({
    name: "AmazonSSMManagedInstanceCore",
    properties: ({ config }) => ({
      Arn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
    }),
  });
};

exports.createResources = createResources;
