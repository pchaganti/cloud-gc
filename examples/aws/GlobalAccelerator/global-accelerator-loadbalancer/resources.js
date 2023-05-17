// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "sg::vpc-default::default",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-a",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-b",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  { type: "Vpc", group: "EC2", name: "vpc-default", isDefault: true },
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
                  name: "my-tg",
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
            name: "my-tg",
          })}`,
          Type: "forward",
        },
      ],
      Port: 80,
      Protocol: "HTTP",
    }),
    dependencies: ({}) => ({
      loadBalancer: "my-alb",
      targetGroups: ["my-tg"],
    }),
  },
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "my-alb",
      Scheme: "internet-facing",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: ({}) => ({
      subnets: [
        "vpc-default::subnet-default-a",
        "vpc-default::subnet-default-b",
      ],
      securityGroups: ["sg::vpc-default::default"],
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      HealthCheckPort: "traffic-port",
      HealthCheckProtocol: "HTTP",
      Name: "my-tg",
      Port: 80,
      Protocol: "HTTP",
      ProtocolVersion: "HTTP1",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "Accelerator",
    group: "GlobalAccelerator",
    properties: ({}) => ({
      AcceleratorAttributes: {
        FlowLogsEnabled: false,
      },
      Name: "my-accelerator",
    }),
  },
  {
    type: "EndpointGroup",
    group: "GlobalAccelerator",
    properties: ({ getId }) => ({
      AcceleratorName: "my-accelerator",
      EndpointConfigurations: [
        {
          ClientIPPreservationEnabled: true,
          EndpointId: `${getId({
            type: "LoadBalancer",
            group: "ElasticLoadBalancingV2",
            name: "my-alb",
          })}`,
          Weight: 128,
        },
      ],
      EndpointGroupRegion: "us-east-1",
      HealthCheckPort: 443,
      HealthCheckProtocol: "TCP",
    }),
    dependencies: ({}) => ({
      listener: "my-accelerator::TCP::443::443",
      loadBalancers: ["my-alb"],
    }),
  },
  {
    type: "Listener",
    group: "GlobalAccelerator",
    properties: ({}) => ({
      AcceleratorName: "my-accelerator",
      PortRanges: [
        {
          FromPort: 443,
          ToPort: 443,
        },
      ],
      Protocol: "TCP",
    }),
    dependencies: ({}) => ({
      accelerator: "my-accelerator",
    }),
  },
];
