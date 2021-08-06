// Generated by aws2gc
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  const { config } = provider;

  provider.ec2.makeVpc({
    name: config.ec2.Vpc.vpc.name,
    namespace: "VPC",
    properties: () => config.ec2.Vpc.vpc.properties,
  });

  provider.ec2.makeSubnet({
    name: config.ec2.Subnet.subnetPrivateA.name,
    namespace: "VPC",
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpc,
    }),
    properties: () => config.ec2.Subnet.subnetPrivateA.properties,
  });

  provider.ec2.makeSubnet({
    name: config.ec2.Subnet.subnetPrivateB.name,
    namespace: "VPC",
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpc,
    }),
    properties: () => config.ec2.Subnet.subnetPrivateB.properties,
  });

  provider.ec2.makeSubnet({
    name: config.ec2.Subnet.subnetPublicA.name,
    namespace: "VPC",
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpc,
    }),
    properties: () => config.ec2.Subnet.subnetPublicA.properties,
  });

  provider.ec2.makeSubnet({
    name: config.ec2.Subnet.subnetPublicB.name,
    namespace: "VPC",
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpc,
    }),
    properties: () => config.ec2.Subnet.subnetPublicB.properties,
  });

  provider.ec2.makeElasticIpAddress({
    name: config.ec2.ElasticIpAddress.iep.name,
    namespace: "VPC",
  });

  provider.ec2.makeInternetGateway({
    name: config.ec2.InternetGateway.internetGateway.name,
    namespace: "VPC",
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpc,
    }),
  });

  provider.ec2.makeNatGateway({
    name: config.ec2.NatGateway.natGateway.name,
    namespace: "VPC",
    dependencies: ({ resources }) => ({
      subnet: resources.ec2.Subnet.subnetPublicA,
      eip: resources.ec2.ElasticIpAddress.iep,
    }),
  });

  provider.ec2.makeRouteTable({
    name: config.ec2.RouteTable.routeTablePrivateA.name,
    namespace: "VPC",
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpc,
      subnets: [resources.ec2.Subnet.subnetPrivateA],
    }),
  });

  provider.ec2.makeRouteTable({
    name: config.ec2.RouteTable.routeTablePrivateB.name,
    namespace: "VPC",
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpc,
      subnets: [resources.ec2.Subnet.subnetPrivateB],
    }),
  });

  provider.ec2.makeRouteTable({
    name: config.ec2.RouteTable.routeTablePublic.name,
    namespace: "VPC",
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpc,
      subnets: [
        resources.ec2.Subnet.subnetPublicB,
        resources.ec2.Subnet.subnetPublicA,
      ],
    }),
  });

  provider.ec2.makeRoute({
    name: config.ec2.Route.routePrivateA.name,
    namespace: "VPC",
    dependencies: ({ resources }) => ({
      routeTable: resources.ec2.RouteTable.routeTablePrivateA,
      natGateway: resources.ec2.NatGateway.natGateway,
    }),
    properties: () => config.ec2.Route.routePrivateA.properties,
  });

  provider.ec2.makeRoute({
    name: config.ec2.Route.routePrivateB.name,
    namespace: "VPC",
    dependencies: ({ resources }) => ({
      routeTable: resources.ec2.RouteTable.routeTablePrivateB,
      natGateway: resources.ec2.NatGateway.natGateway,
    }),
    properties: () => config.ec2.Route.routePrivateB.properties,
  });

  provider.ec2.makeRoute({
    name: config.ec2.Route.routePublic.name,
    namespace: "VPC",
    dependencies: ({ resources }) => ({
      routeTable: resources.ec2.RouteTable.routeTablePublic,
      ig: resources.ec2.InternetGateway.internetGateway,
    }),
    properties: () => config.ec2.Route.routePublic.properties,
  });
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  createResources({
    provider,
  });

  return {
    provider,
  };
};
