// Generated by 'gc gencode'
const { pipe, get, eq, and } = require("rubico");
const { find } = require("rubico/x");

exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    properties: ({}) => ({
      DomainName: "grucloud.org",
      SubjectAlternativeNames: ["grucloud.org", "*.grucloud.org"],
    }),
  },
  {
    type: "AutoScalingGroup",
    group: "AutoScaling",
    name: "asg-ng-1",
    readOnly: true,
    properties: ({}) => ({
      MinSize: 1,
      MaxSize: 1,
      DesiredCapacity: 1,
      HealthCheckGracePeriod: 15,
      Tags: [
        {
          Key: "k8s.io/cluster-autoscaler/enabled",
          Value: "true",
        },
        {
          Key: "k8s.io/cluster-autoscaler/my-cluster",
          Value: "owned",
        },
        {
          Key: "kubernetes.io/cluster/my-cluster",
          Value: "owned",
        },
      ],
    }),
    dependencies: ({}) => ({
      subnets: ["VPC::SubnetPublicUSEAST1D", "VPC::SubnetPublicUSEAST1F"],
      launchTemplate: "lt-ng-1",
    }),
  },
  {
    type: "AutoScalingAttachment",
    group: "AutoScaling",
    dependencies: ({}) => ({
      autoScalingGroup: "asg-ng-1",
      targetGroup: "target-group-rest",
    }),
  },
  {
    type: "AutoScalingAttachment",
    group: "AutoScaling",
    dependencies: ({}) => ({
      autoScalingGroup: "asg-ng-1",
      targetGroup: "target-group-web",
    }),
  },
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
  },
  {
    type: "LaunchTemplate",
    group: "EC2",
    name: "lt-ng-1",
    readOnly: true,
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
        Image: {
          Description:
            "EKS Kubernetes Worker AMI with AmazonLinux2 image, (k8s: 1.26.2, containerd: 1.6.*)",
        },
        MetadataOptions: {
          HttpPutResponseHopLimit: 2,
          HttpTokens: "optional",
        },
        UserData: `MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="//"

--//
Content-Type: text/x-shellscript; charset="us-ascii"
#!/bin/bash
set -ex
B64_CLUSTER_CA=LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUMvakNDQWVhZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwcmRXSmwKY201bGRHVnpNQjRYRFRJek1EVXhNVEl5TkRZd01sb1hEVE16TURVd09ESXlORFl3TWxvd0ZURVRNQkVHQTFVRQpBeE1LYTNWaVpYSnVaWFJsY3pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTmtEClNPL2ZteDhreXUyNkk1RGdBL01UZ0NEazMwdXJGTGcrUFQ3LzhSM0FIUmdRME9TVCtOM3FVQ1Q5T0dqRWxVcmUKWUJpd0pmei9iRVZVeDg0Ymx0YStORnIvUGpwVUtZKzludGtNVTF5NHByay90Wi91Z2tzRFgvSjR3MmNqdmhBRgo2YzlNeFk5aGRueEdLQWcvTStpWGVzQlE2TEFqa1UvYWpabkRtV3B5TjY4MFNjdGZuSXZMSHpZSU43b0VDYmNsCndkV0lnVDFIVm14WEhCNjFqKzFYNXpwTmVONDNUa3BERnA5a2kycUJEbUdPdG5NTHh1QTl3dnIzZHhkcEVES0UKajZhNzRreE9vM2kzSE90L0xqeWExckd5UGRkK05oQ1RxVlZqbWZmL1RXRHUrallPSTIrU1pNbXlaQmtCNmZJTgpqcEhwWHhXbUtQaDJ1enpqQnRrQ0F3RUFBYU5aTUZjd0RnWURWUjBQQVFIL0JBUURBZ0trTUE4R0ExVWRFd0VCCi93UUZNQU1CQWY4d0hRWURWUjBPQkJZRUZFRDczV1JhdFNUaWtHTGtnS052Nms4a1puRzFNQlVHQTFVZEVRUU8KTUF5Q0NtdDFZbVZ5Ym1WMFpYTXdEUVlKS29aSWh2Y05BUUVMQlFBRGdnRUJBQjUxb0pzZ2h2Um52TUJ6RWoxUQoxb0FXRlhTMTNVUVlZSEEvS2QrMjJvTkNUa0NlUmJwN1pYQTVPS2tXOFFTcFNFVnpXdlg3czJyZjRWS3cwODFSCnJ4U0tHTHpKVXJaMkE3Wm1hejZIOGpqOXM2ajJaZGVJN202ZEx4azJ3ektrSVFwRUZOVTMzYzZoMjNGbjhBVEQKdEUvZWhraWplbTl4Z1dxQmNIRkJHWEc5amplK1FROGJacnA1dTN5SVdUdnBNbEwwUzhGRHk4NGZrQzZoWkpSQwpiTG1TYXpmL1JPa3BjT1N5a3YzczdSanpxM0xiM2ZSUDZxS0F1ZzlTeVhOVGJ4UzZCREJKaXRuOVJOeTFSWGZnCkZ5bml5NHU1SDdLVTJTR3pwT0QyUW5rRUlsVzJsQVgyaWlHVHlwQXZtWEgwRTNDUU8xdkZDUDM1aWRuVTJLUjIKT0RNPQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
API_SERVER_URL=https://2FC8329EAFF8EA4F0E7C800E2362038C.gr7.us-east-1.eks.amazonaws.com
K8S_CLUSTER_DNS_IP=10.100.0.10
/etc/eks/bootstrap.sh my-cluster --kubelet-extra-args '--node-labels=eks.amazonaws.com/sourceLaunchTemplateVersion=1,alpha.eksctl.io/cluster-name=my-cluster,alpha.eksctl.io/nodegroup-name=ng-1,eks.amazonaws.com/nodegroup-image=ami-0f114867066b78822,eks.amazonaws.com/capacityType=ON_DEMAND,eks.amazonaws.com/nodegroup=ng-1,eks.amazonaws.com/sourceLaunchTemplateId=lt-0de1bfcf1aee60df2 --max-pods=17' --b64-cluster-ca $B64_CLUSTER_CA --apiserver-endpoint $API_SERVER_URL --dns-cluster-ip $K8S_CLUSTER_DNS_IP --use-max-pods false

--//--`,
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
      PrivateIpAddressIndex: 2048,
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
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "load-balancer",
      Description: "Load Balancer",
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
      securityGroup: "sg::VPC::ClusterSharedNodeSecurityGroup",
      securityGroupFrom: ["sg::VPC::eks-cluster-sg-my-cluster-1909614887"],
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 443,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      ToPort: 443,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::VPC::load-balancer",
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
      securityGroup: "sg::VPC::load-balancer",
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
    type: "Addon",
    group: "EKS",
    properties: ({}) => ({
      addonName: "coredns",
      addonVersion: "v1.9.3-eksbuild.2",
    }),
    dependencies: ({}) => ({
      cluster: "my-cluster",
    }),
  },
  {
    type: "Cluster",
    group: "EKS",
    properties: ({}) => ({
      name: "my-cluster",
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
    }),
    dependencies: ({}) => ({
      cluster: "my-cluster",
      subnets: ["VPC::SubnetPublicUSEAST1D", "VPC::SubnetPublicUSEAST1F"],
      role: "eksctl-my-cluster-nodegroup-ng-1-NodeInstanceRole-1LT5OVYUG2SEI",
      launchTemplate: "eksctl-my-cluster-nodegroup-ng-1",
    }),
  },
  {
    type: "Listener",
    group: "ElasticLoadBalancingV2",
    properties: ({ getId }) => ({
      DefaultActions: [
        {
          ForwardConfig: {
            TargetGroups: [
              {
                TargetGroupArn: `${getId({
                  type: "TargetGroup",
                  group: "ElasticLoadBalancingV2",
                  name: "target-group-web",
                })}`,
                Weight: 1,
              },
            ],
            TargetGroupStickinessConfig: {
              Enabled: false,
            },
          },
          TargetGroupArn: `${getId({
            type: "TargetGroup",
            group: "ElasticLoadBalancingV2",
            name: "target-group-web",
          })}`,
          Type: "forward",
        },
      ],
      Port: 80,
      Protocol: "HTTP",
    }),
    dependencies: ({}) => ({
      loadBalancer: "load-balancer",
      targetGroups: ["target-group-web"],
    }),
  },
  {
    type: "Listener",
    group: "ElasticLoadBalancingV2",
    properties: ({ getId }) => ({
      DefaultActions: [
        {
          ForwardConfig: {
            TargetGroups: [
              {
                TargetGroupArn: `${getId({
                  type: "TargetGroup",
                  group: "ElasticLoadBalancingV2",
                  name: "target-group-web",
                })}`,
                Weight: 1,
              },
            ],
            TargetGroupStickinessConfig: {
              Enabled: false,
            },
          },
          TargetGroupArn: `${getId({
            type: "TargetGroup",
            group: "ElasticLoadBalancingV2",
            name: "target-group-web",
          })}`,
          Type: "forward",
        },
      ],
      Port: 443,
      Protocol: "HTTPS",
    }),
    dependencies: ({}) => ({
      loadBalancer: "load-balancer",
      targetGroups: ["target-group-web"],
      certificate: "grucloud.org",
    }),
  },
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "load-balancer",
      Scheme: "internet-facing",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: ({}) => ({
      subnets: ["VPC::SubnetPublicUSEAST1D", "VPC::SubnetPublicUSEAST1F"],
      securityGroups: ["sg::VPC::load-balancer"],
    }),
  },
  {
    type: "Rule",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Priority: "1",
      Conditions: [
        {
          Field: "path-pattern",
          Values: ["/*"],
        },
      ],
      Actions: [
        {
          Order: 1,
          RedirectConfig: {
            Host: "#{host}",
            Path: "/#{path}",
            Port: "443",
            Protocol: "HTTPS",
            Query: "#{query}",
            StatusCode: "HTTP_301",
          },
          Type: "redirect",
        },
      ],
    }),
    dependencies: ({}) => ({
      listener: "listener::load-balancer::HTTP::80",
    }),
  },
  {
    type: "Rule",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Priority: "1",
      Conditions: [
        {
          Field: "path-pattern",
          Values: ["/api/*"],
        },
      ],
    }),
    dependencies: ({}) => ({
      listener: "listener::load-balancer::HTTPS::443",
      targetGroup: "target-group-rest",
    }),
  },
  {
    type: "Rule",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Priority: "2",
      Conditions: [
        {
          Field: "path-pattern",
          Values: ["/*"],
        },
      ],
    }),
    dependencies: ({}) => ({
      listener: "listener::load-balancer::HTTPS::443",
      targetGroup: "target-group-web",
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      HealthCheckPath: "/api/v1/version",
      HealthCheckPort: "traffic-port",
      HealthCheckProtocol: "HTTP",
      Name: "target-group-rest",
      Port: 30020,
      Protocol: "HTTP",
      ProtocolVersion: "HTTP1",
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      HealthCheckPort: "traffic-port",
      HealthCheckProtocol: "HTTP",
      Name: "target-group-web",
      Port: 30010,
      Protocol: "HTTP",
      ProtocolVersion: "HTTP1",
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "eksctl-my-cluster-cluster-ServiceRole-1T8YHA5ZIYVRB",
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
                Resource: "*",
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
                Resource: "*",
                Effect: "Allow",
              },
            ],
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
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "grucloud.org.",
    }),
    dependencies: ({}) => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    properties: ({}) => ({
      AliasTarget: {
        EvaluateTargetHealth: true,
      },
      Name: "grucloud.org.",
      Type: "A",
    }),
    dependencies: ({}) => ({
      hostedZone: "grucloud.org.",
      loadBalancer: "load-balancer",
    }),
  },
  {
    type: "Domain",
    group: "Route53Domains",
    name: "grucloud.org",
    readOnly: true,
  },
];
