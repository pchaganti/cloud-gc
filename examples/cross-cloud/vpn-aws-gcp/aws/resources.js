// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "CustomerGateway",
    group: "EC2",
    name: "cw-gcp",
    properties: ({ getId }) => ({
      BgpAsn: "65000",
      IpAddress: `${getId({
        type: "Address",
        group: "compute",
        name: "ip-vpn",
        path: "live.address",
      })}`,
    }),
    dependencies: ({}) => ({
      ipAddressGoogle: "ip-vpn",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `subnet-private1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 8,
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `rtb-private1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpc::rtb-private1-${config.region}a`,
      subnet: `vpc::subnet-private1-${config.region}a`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "192.168.0.0/24",
    }),
    dependencies: ({ config }) => ({
      routeTable: `vpc::rtb-private1-${config.region}a`,
      vpnGateway: "vpg",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "launch-wizard-1",
      Description: "launch-wizard created 2022-09-05T17:59:39.259Z",
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpProtocol: "icmp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc::launch-wizard-1",
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
      ToPort: 22,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc::launch-wizard-1",
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
      securityGroup: "sg::vpc::launch-wizard-1",
    }),
  },
  {
    type: "Instance",
    group: "EC2",
    name: "machine-aws",
    properties: ({ config, getId }) => ({
      InstanceType: "t2.micro",
      Placement: {
        AvailabilityZone: `${config.region}a`,
      },
      NetworkInterfaces: [
        {
          DeviceIndex: 0,
          Groups: [
            `${getId({
              type: "SecurityGroup",
              group: "EC2",
              name: "sg::vpc::launch-wizard-1",
            })}`,
          ],
          SubnetId: `${getId({
            type: "Subnet",
            group: "EC2",
            name: `vpc::subnet-private1-${config.region}a`,
          })}`,
        },
      ],
      Image: {
        Description:
          "Amazon Linux 2 Kernel 5.10 AMI 2.0.20220805.0 x86_64 HVM gp2",
      },
    }),
    dependencies: ({ config }) => ({
      subnets: [`vpc::subnet-private1-${config.region}a`],
      iamInstanceProfile: "role-ec2-ssm",
      securityGroups: ["sg::vpc::launch-wizard-1"],
    }),
  },
  {
    type: "VpcEndpoint",
    group: "EC2",
    name: "vpce-ec2-messages",
    properties: ({ config }) => ({
      PrivateDnsEnabled: true,
      VpcEndpointType: "Interface",
      ServiceName: `com.amazonaws.${config.region}.ec2messages`,
    }),
    dependencies: ({ config }) => ({
      vpc: "vpc",
      subnets: [`vpc::subnet-private1-${config.region}a`],
      securityGroups: ["sg::vpc::launch-wizard-1"],
    }),
  },
  {
    type: "VpcEndpoint",
    group: "EC2",
    name: "vpce-ssm",
    properties: ({ config }) => ({
      PrivateDnsEnabled: true,
      VpcEndpointType: "Interface",
      ServiceName: `com.amazonaws.${config.region}.ssm`,
    }),
    dependencies: ({ config }) => ({
      vpc: "vpc",
      subnets: [`vpc::subnet-private1-${config.region}a`],
      securityGroups: ["sg::vpc::launch-wizard-1"],
    }),
  },
  {
    type: "VpcEndpoint",
    group: "EC2",
    name: "vpce-ssm-messages",
    properties: ({ config }) => ({
      PrivateDnsEnabled: true,
      VpcEndpointType: "Interface",
      ServiceName: `com.amazonaws.${config.region}.ssmmessages`,
    }),
    dependencies: ({ config }) => ({
      vpc: "vpc",
      subnets: [`vpc::subnet-private1-${config.region}a`],
      securityGroups: ["sg::vpc::launch-wizard-1"],
    }),
  },
  {
    type: "VpnGateway",
    group: "EC2",
    name: "vpg",
    properties: ({}) => ({
      AmazonSideAsn: 64512,
    }),
  },
  {
    type: "VpnGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "vpc",
      vpnGateway: "vpg",
    }),
  },
  {
    type: "VpnConnection",
    group: "EC2",
    name: "vpn-gcp",
    properties: ({}) => ({
      Category: "VPN",
      Options: {
        StaticRoutesOnly: true,
      },
    }),
    dependencies: ({}) => ({
      customerGateway: "cw-gcp",
      vpnGateway: "vpg",
    }),
  },
  {
    type: "VpnConnectionRoute",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "192.168.0.0/24",
    }),
    dependencies: ({}) => ({
      vpnConnection: "vpn-gcp",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "role-ec2-ssm",
      Description: "Allows EC2 instances to call AWS services on your behalf.",
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
          PolicyName: "AmazonSSMManagedInstanceCore",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
        },
      ],
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "role-ec2-ssm",
    dependencies: ({}) => ({
      roles: ["role-ec2-ssm"],
    }),
  },
];
