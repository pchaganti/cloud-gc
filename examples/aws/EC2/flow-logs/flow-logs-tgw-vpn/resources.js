// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "/aws/flowlogs-vpv-connection",
      retentionInDays: 1,
    }),
  },
  {
    type: "CustomerGateway",
    group: "EC2",
    name: "my-customer-gw",
    properties: ({}) => ({
      BgpAsn: "65000",
      IpAddress: "1.1.1.1",
    }),
  },
  {
    type: "FlowLogs",
    group: "EC2",
    name: "flow-logs-vpn-connection",
    properties: ({ config }) => ({
      DeliverLogsPermissionArn: `arn:aws:iam::${config.accountId()}:role/aws-service-role/transitgateway.amazonaws.com/AWSServiceRoleForVPCTransitGateway`,
      LogFormat:
        "${version} ${resource-type} ${account-id} ${tgw-id} ${tgw-attachment-id} ${tgw-src-vpc-account-id} ${tgw-dst-vpc-account-id} ${tgw-src-vpc-id} ${tgw-dst-vpc-id} ${tgw-src-subnet-id} ${tgw-dst-subnet-id} ${tgw-src-eni} ${tgw-dst-eni} ${tgw-src-az-id} ${tgw-dst-az-id} ${tgw-pair-attachment-id} ${srcaddr} ${dstaddr} ${srcport} ${dstport} ${protocol} ${packets} ${bytes} ${start} ${end} ${log-status} ${type} ${packets-lost-no-route} ${packets-lost-blackhole} ${packets-lost-mtu-exceeded} ${packets-lost-ttl-expired} ${tcp-flags} ${region} ${flow-direction} ${pkt-src-aws-service} ${pkt-dst-aws-service}",
      MaxAggregationInterval: 60,
    }),
    dependencies: ({}) => ({
      transitGatewayVpnAttachment: "tgw-attach::tgw::vpn::vpn-connection",
      cloudWatchLogGroup: "/aws/flowlogs-vpv-connection",
    }),
  },
  {
    type: "TransitGateway",
    group: "EC2",
    name: "tgw",
    properties: ({}) => ({
      Description: "",
      Options: {
        AmazonSideAsn: 64512,
        AutoAcceptSharedAttachments: "disable",
        DefaultRouteTableAssociation: "enable",
        DefaultRouteTablePropagation: "enable",
        DnsSupport: "enable",
        MulticastSupport: "disable",
        VpnEcmpSupport: "enable",
      },
    }),
  },
  {
    type: "TransitGatewayRouteTable",
    group: "EC2",
    name: "tgw-rtb-tgw-default",
    readOnly: true,
    properties: ({}) => ({
      DefaultAssociationRouteTable: true,
      DefaultPropagationRouteTable: true,
    }),
    dependencies: ({}) => ({
      transitGateway: "tgw",
    }),
  },
  {
    type: "TransitGatewayRouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      transitGatewayRouteTable: "tgw-rtb-tgw-default",
      transitGatewayVpnAttachment: "tgw-attach::tgw::vpn::vpn-connection",
    }),
  },
  {
    type: "TransitGatewayRouteTablePropagation",
    group: "EC2",
    dependencies: ({}) => ({
      transitGatewayRouteTable: "tgw-rtb-tgw-default",
      transitGatewayVpnAttachment: "tgw-attach::tgw::vpn::vpn-connection",
    }),
  },
  {
    type: "TransitGatewayVpnAttachment",
    group: "EC2",
    name: "tgw-attach::tgw::vpn::vpn-connection",
    readOnly: true,
    dependencies: ({}) => ({
      transitGateway: "tgw",
      vpnConnection: "vpn-connection",
    }),
  },
  {
    type: "VpnConnection",
    group: "EC2",
    name: "vpn-connection",
    properties: ({}) => ({
      Category: "VPN",
    }),
    dependencies: ({}) => ({
      customerGateway: "my-customer-gw",
      transitGateway: "tgw",
    }),
  },
];
