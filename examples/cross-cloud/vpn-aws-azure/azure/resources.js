// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "SshPublicKey",
    group: "Compute",
    properties: ({ config }) => ({
      name: "machine-azure_key",
      location: config.location,
      properties: {
        publicKey:
          "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDXMbrqlWTtPH7ochhNri6aRUn2PcSTYR1xZ1IXFV//0VO4Nm0Qp21A+C3bdTu9YurWc2fH+YM/tcU1ac/NABC3+UYNUJukeMcdX/bETHP6wkVC4nU6BDY9n+HuAJHkFgzG9xTPb7McOiTqcCYi0u17FihIULxZHScs+oeKefMl7aXxl9QVOlO1wPWs2AtQzLjYBJSDWcSeZYE6f8S7sg9A9spSqA3ppy5DnQoEQQ7dpxEXCIt68z1CtIIO7FURjr4OfJfDS38lkWHv5sRUpi/pB5sEGL/bwyn3b0mS3GuAqAU5w/WrYdjEcGcWR6p9vDdaIuXEHqN1dxpwr55gQwl1cZDcCzSG2268c8hTgXkMnTgYldgAaauaWYfqwQpE56tzD/J1K33RoXlbtUNWdVawh4PL68gzG0g4d6eJKCTssbXafxLXCQxN+ATxMIkHFgyL092oaSD2bsSH23yH3561O5b8CqFsVa5nzcpoTFbPHyPNECwo4GzmwA706r8EBvE= generated-by-azure",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
    }),
  },
  {
    type: "VirtualMachine",
    group: "Compute",
    properties: ({ getId }) => ({
      name: "machine-azure",
      properties: {
        hardwareProfile: {
          vmSize: "Standard_B1ls",
        },
        osProfile: {
          computerName: "machine-azure",
          adminUsername: "azureuser",
          linuxConfiguration: {
            disablePasswordAuthentication: true,
            ssh: {
              publicKeys: [
                {
                  path: "/home/azureuser/.ssh/authorized_keys",
                  keyData: `${getId({
                    type: "SshPublicKey",
                    group: "Compute",
                    name: "hybridrg::machine-azure_key",
                    path: "live.properties.publicKey",
                  })}`,
                },
              ],
            },
            enableVMAgentPlatformUpdates: false,
          },
          adminPassword: process.env.HYBRIDRG_MACHINE_AZURE_ADMIN_PASSWORD,
        },
        storageProfile: {
          imageReference: {
            publisher: "canonical",
            offer: "0001-com-ubuntu-server-focal",
            sku: "20_04-lts-gen2",
            version: "latest",
          },
          osDisk: {
            osType: "Linux",
            name: "machine-azure_OsDisk_1_eeaa75f85bd74d19bb786d94644eba1a",
            createOption: "FromImage",
            caching: "ReadWrite",
            managedDisk: {
              storageAccountType: "Premium_LRS",
            },
            deleteOption: "Delete",
            diskSizeGB: 30,
          },
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            enabled: true,
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: getId({
                type: "NetworkInterface",
                group: "Network",
                name: "hybridrg::machine-azure388",
              }),
              properties: {
                deleteOption: "Detach",
              },
            },
          ],
        },
      },
      identity: {
        type: "SystemAssigned",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      sshPublicKeys: ["hybridrg::machine-azure_key"],
      networkInterfaces: ["hybridrg::machine-azure388"],
    }),
  },
  {
    type: "VirtualMachineExtension",
    group: "Compute",
    properties: ({ config }) => ({
      name: "AADSSHLoginForLinux",
      location: config.location,
      properties: {
        publisher: "Microsoft.Azure.ActiveDirectory",
        type: "AADSSHLoginForLinux",
        typeHandlerVersion: "1.0",
        autoUpgradeMinorVersion: true,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      vm: "hybridrg::machine-azure",
    }),
  },
  {
    type: "BastionHost",
    group: "Network",
    properties: ({ config, getId }) => ({
      name: "bastion",
      location: config.location,
      properties: {
        ipConfigurations: [
          {
            properties: {
              privateIPAllocationMethod: "Dynamic",
              subnet: {
                id: `${getId({
                  type: "Subnet",
                  group: "Network",
                  name: "hybridrg::vnet1::AzureBastionSubnet",
                })}`,
              },
              publicIPAddress: {
                id: `${getId({
                  type: "PublicIPAddress",
                  group: "Network",
                  name: "hybridrg::vnet1-ip",
                })}`,
              },
            },
            name: "IpConf",
          },
        ],
        scaleUnits: 2,
        enableTunneling: true,
      },
      sku: {
        name: "Standard",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      subnets: ["hybridrg::vnet1::AzureBastionSubnet"],
      publicIpAddresses: ["hybridrg::vnet1-ip"],
    }),
  },
  {
    type: "LocalNetworkGateway",
    group: "Network",
    properties: ({ config, getId }) => ({
      name: "azlngw1",
      location: config.location,
      properties: {
        localNetworkAddressSpace: {
          addressPrefixes: ["192.168.0.0/16"],
        },
        gatewayIpAddress: `${getId({
          type: "VpnConnection",
          group: "EC2",
          name: "vpn-connection",
          path: "live.Options.TunnelOptions[1].OutsideIpAddress",
        })}`,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      gatewayIpAddressAws: { name: "vpn-connection", provider: "aws" },
    }),
  },
  {
    type: "LocalNetworkGateway",
    group: "Network",
    properties: ({ config, getId }) => ({
      name: "azlngw2",
      location: config.location,
      properties: {
        localNetworkAddressSpace: {
          addressPrefixes: ["192.168.0.0/16"],
        },
        gatewayIpAddress: `${getId({
          type: "VpnConnection",
          group: "EC2",
          name: "vpn-connection",
          path: "live.Options.TunnelOptions[0].OutsideIpAddress",
        })}`,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      gatewayIpAddressAws: { name: "vpn-connection", provider: "aws" },
    }),
  },
  {
    type: "NetworkInterface",
    group: "Network",
    properties: ({ config, getId }) => ({
      name: "machine-azure388",
      location: config.location,
      properties: {
        ipConfigurations: [
          {
            properties: {
              subnet: {
                id: `${getId({
                  type: "Subnet",
                  group: "Network",
                  name: "hybridrg::vnet1::subnet1",
                })}`,
              },
            },
            name: "ipconfig1",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      networkSecurityGroup: "hybridrg::machine-azure-nsg",
      subnets: ["hybridrg::vnet1::subnet1"],
    }),
  },
  {
    type: "NetworkSecurityGroup",
    group: "Network",
    properties: ({}) => ({
      name: "machine-azure-nsg",
      properties: {
        securityRules: [
          {
            name: "SSH",
            properties: {
              protocol: "TCP",
              sourcePortRange: "*",
              destinationPortRange: "22",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 300,
              direction: "Inbound",
              sourcePortRanges: [],
              destinationPortRanges: [],
              sourceAddressPrefixes: [],
              destinationAddressPrefixes: [],
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
    }),
  },
  {
    type: "PublicIPAddress",
    group: "Network",
    properties: ({}) => ({
      name: "vnet1-ip",
      sku: {
        name: "Standard",
      },
      properties: {
        publicIPAllocationMethod: "Static",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
    }),
  },
  {
    type: "PublicIPAddress",
    group: "Network",
    properties: ({}) => ({
      name: "vnetvgwpip1",
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
    }),
  },
  {
    type: "Route",
    group: "Network",
    properties: ({}) => ({
      name: "route-aws",
      properties: {
        addressPrefix: "192.168.0.0/16",
        nextHopType: "VirtualNetworkGateway",
        hasBgpOverride: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      routeTable: "hybridrg::rtb-aws",
    }),
  },
  {
    type: "RouteTable",
    group: "Network",
    properties: ({ config }) => ({
      name: "rtb-aws",
      location: config.location,
      properties: {
        disableBgpRoutePropagation: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
    }),
  },
  {
    type: "Subnet",
    group: "Network",
    properties: ({}) => ({
      name: "AzureBastionSubnet",
      properties: {
        addressPrefix: "172.16.0.0/26",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      virtualNetwork: "hybridrg::vnet1",
    }),
  },
  {
    type: "Subnet",
    group: "Network",
    properties: ({}) => ({
      name: "GatewaySubnet",
      properties: {
        addressPrefix: "172.16.2.0/27",
        privateEndpointNetworkPolicies: "Enabled",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      virtualNetwork: "hybridrg::vnet1",
    }),
  },
  {
    type: "Subnet",
    group: "Network",
    properties: ({}) => ({
      name: "subnet1",
      properties: {
        addressPrefix: "172.16.1.0/24",
        privateEndpointNetworkPolicies: "Enabled",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      virtualNetwork: "hybridrg::vnet1",
    }),
  },
  {
    type: "VirtualNetwork",
    group: "Network",
    properties: ({}) => ({
      name: "vnet1",
      properties: {
        addressSpace: {
          addressPrefixes: ["172.16.0.0/16"],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
    }),
  },
  {
    type: "VirtualNetworkGateway",
    group: "Network",
    properties: ({ config, getId }) => ({
      name: "myvng1",
      location: config.location,
      properties: {
        ipConfigurations: [
          {
            properties: {
              privateIPAllocationMethod: "Dynamic",
              subnet: {
                id: `${getId({
                  type: "Subnet",
                  group: "Network",
                  name: "hybridrg::vnet1::GatewaySubnet",
                })}`,
              },
              publicIPAddress: {
                id: `${getId({
                  type: "PublicIPAddress",
                  group: "Network",
                  name: "hybridrg::vnetvgwpip1",
                })}`,
              },
            },
            name: "vnetGatewayConfig",
          },
        ],
        gatewayType: "Vpn",
        vpnType: "RouteBased",
        vpnGatewayGeneration: "Generation1",
        enableBgp: false,
        enablePrivateIpAddress: false,
        activeActive: false,
        disableIPSecReplayProtection: false,
        sku: {
          name: "VpnGw1",
          tier: "VpnGw1",
        },
        vpnClientConfiguration: {
          vpnClientProtocols: ["OpenVPN", "IkeV2"],
          vpnAuthenticationTypes: [],
        },
        bgpSettings: {
          asn: 65515,
          bgpPeeringAddress: "172.16.2.14",
          peerWeight: 0,
        },
        enableBgpRouteTranslationForNat: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      subnets: ["hybridrg::vnet1::GatewaySubnet"],
      publicIpAddresses: ["hybridrg::vnetvgwpip1"],
    }),
  },
  {
    type: "VirtualNetworkGatewayConnection",
    group: "Network",
    properties: ({ config }) => ({
      name: "vngc1",
      location: config.location,
      properties: {
        connectionType: "IPsec",
        connectionProtocol: "IKEv2",
        routingWeight: 0,
        dpdTimeoutSeconds: 0,
        connectionMode: "Default",
        enableBgp: false,
        useLocalAzureIpAddress: false,
        usePolicyBasedTrafficSelectors: false,
        expressRouteGatewayBypass: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      localNetworkGateway: "hybridrg::azlngw1",
      virtualNetworkGateway: "hybridrg::myvng1",
    }),
  },
  {
    type: "VirtualNetworkGatewayConnection",
    group: "Network",
    properties: ({ config }) => ({
      name: "vngc2",
      location: config.location,
      properties: {
        connectionType: "IPsec",
        connectionProtocol: "IKEv2",
        routingWeight: 0,
        dpdTimeoutSeconds: 0,
        connectionMode: "Default",
        enableBgp: false,
        useLocalAzureIpAddress: false,
        usePolicyBasedTrafficSelectors: false,
        expressRouteGatewayBypass: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      localNetworkGateway: "hybridrg::azlngw2",
      virtualNetworkGateway: "hybridrg::myvng1",
    }),
  },
  {
    type: "VirtualNetworkGatewayConnectionSharedKey",
    group: "Network",
    properties: ({ getId }) => ({
      value: `${getId({
        type: "VpnConnection",
        group: "EC2",
        name: "vpn-connection",
        path: "live.Options.TunnelOptions[1].PreSharedKey",
      })}`,
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      virtualNetworkGatewayConnection: "hybridrg::vngc1",
      vpnConnectionAws: { name: "vpn-connection", provider: "aws" },
    }),
  },
  {
    type: "VirtualNetworkGatewayConnectionSharedKey",
    group: "Network",
    properties: ({ getId }) => ({
      value: `${getId({
        type: "VpnConnection",
        group: "EC2",
        name: "vpn-connection",
        path: "live.Options.TunnelOptions[0].PreSharedKey",
      })}`,
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      virtualNetworkGatewayConnection: "hybridrg::vngc2",
      vpnConnectionAws: { name: "vpn-connection", provider: "aws" },
    }),
  },
  {
    type: "ResourceGroup",
    group: "Resources",
    properties: ({}) => ({
      name: "hybridrg",
    }),
  },
];
