// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "SshPublicKey",
    group: "Compute",
    properties: ({ config }) => ({
      name: "admingrucloud",
      location: config.location,
      properties: {
        publicKey:
          "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDJIm/qoOB61JXbMH7c9jcaVdBJ\r\nQ8NwwIyWfOIklNQG80JFQKQlc/pO1wS30+WlNhjLFXCokZdrJmDzry68BAz92lJ4\r\nTQHRZoZmzsjs40bIQ1xTw72w+LT/eMj2YJIMvKcokIOY/ZziKYwEhGjJCv7Gg2Da\r\nyHN8mbxMs6IL35Q80lJJBrc91AZ/ZplZFu07GySY78+JuNFI+WqO5ltNHduf+u1u\r\nrHrT7NbwDAhTsV7PaP9/q9u8iWJyglH8QfTyNMjciMxTHxjgDFV9xPfsyaMaB8tf\r\nkcSNx9rAmtH62D3FWup8gvGs4PHUoSIihvogtEWyLquQqP4CJUUcLjE7xSIDdZ5R\r\nuqo5Xf1nfBQXdB7atwT8rSEm9CdpSlcWbJ4yzeki9IUMR8iPnHB27lxuBlyHiYPL\r\n8vSXe1ofbl7J0NErjjoyDn1x75hDZGHX9VLh1BMz03DkJ5+zKRtwWYHozQvi7AA8\r\nIRDzslT6+u/ZwpkfbPlwyh8pQFBOTn2l3SlupLk= generated-by-azure\r\n",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-ag",
    }),
  },
  {
    type: "VirtualMachineScaleSet",
    group: "Compute",
    properties: ({ getId }) => ({
      name: "vmss",
      sku: {
        name: "Standard_B1ls",
        tier: "Standard",
        capacity: 1,
      },
      properties: {
        singlePlacementGroup: false,
        upgradePolicy: {
          mode: "Manual",
        },
        scaleInPolicy: {
          rules: ["Default"],
        },
        virtualMachineProfile: {
          osProfile: {
            computerNamePrefix: "vmssscr3w",
            adminUsername: "azureuser",
            linuxConfiguration: {
              disablePasswordAuthentication: true,
              ssh: {
                publicKeys: [
                  {
                    path: "/home/azureuser/.ssh/authorized_keys",
                    keyData:
                      "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDJIm/qoOB61JXbMH7c9jcaVdBJ\r\nQ8NwwIyWfOIklNQG80JFQKQlc/pO1wS30+WlNhjLFXCokZdrJmDzry68BAz92lJ4\r\nTQHRZoZmzsjs40bIQ1xTw72w+LT/eMj2YJIMvKcokIOY/ZziKYwEhGjJCv7Gg2Da\r\nyHN8mbxMs6IL35Q80lJJBrc91AZ/ZplZFu07GySY78+JuNFI+WqO5ltNHduf+u1u\r\nrHrT7NbwDAhTsV7PaP9/q9u8iWJyglH8QfTyNMjciMxTHxjgDFV9xPfsyaMaB8tf\r\nkcSNx9rAmtH62D3FWup8gvGs4PHUoSIihvogtEWyLquQqP4CJUUcLjE7xSIDdZ5R\r\nuqo5Xf1nfBQXdB7atwT8rSEm9CdpSlcWbJ4yzeki9IUMR8iPnHB27lxuBlyHiYPL\r\n8vSXe1ofbl7J0NErjjoyDn1x75hDZGHX9VLh1BMz03DkJ5+zKRtwWYHozQvi7AA8\r\nIRDzslT6+u/ZwpkfbPlwyh8pQFBOTn2l3SlupLk= generated-by-azure\r\n",
                  },
                ],
              },
              provisionVMAgent: true,
              enableVMAgentPlatformUpdates: false,
            },
            allowExtensionOperations: true,
            adminPassword: process.env.RG_AG_VMSS_ADMIN_PASSWORD,
          },
          storageProfile: {
            osDisk: {
              osType: "Linux",
              createOption: "FromImage",
              caching: "ReadWrite",
              managedDisk: {
                storageAccountType: "Premium_LRS",
              },
              diskSizeGB: 30,
            },
            imageReference: {
              publisher: "canonical",
              offer: "0001-com-ubuntu-server-focal",
              sku: "20_04-lts",
              version: "latest",
            },
          },
          diagnosticsProfile: {
            bootDiagnostics: {
              enabled: true,
            },
          },
          networkProfile: {
            networkInterfaceConfigurations: [
              {
                name: "vnet-nic01",
                properties: {
                  primary: true,
                  enableAcceleratedNetworking: false,
                  networkSecurityGroup: {
                    id: getId({
                      type: "NetworkSecurityGroup",
                      group: "Network",
                      name: "rg-ag::basicnsgvnet-nic01",
                    }),
                  },
                  dnsSettings: {
                    dnsServers: [],
                  },
                  enableIPForwarding: false,
                  ipConfigurations: [
                    {
                      name: "vnet-nic01-defaultIpConfiguration",
                      properties: {
                        primary: true,
                        subnet: {
                          id: getId({
                            type: "Subnet",
                            group: "Network",
                            name: "rg-ag::vnet::default",
                          }),
                        },
                        privateIPAddressVersion: "IPv4",
                        applicationGatewayBackendAddressPools: [
                          {
                            id: getId({
                              type: "ApplicationGateway",
                              group: "Network",
                              name: "rg-ag::ag",
                              suffix: "/backendAddressPools/backendpool",
                            }),
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        overprovision: false,
        doNotRunExtensionsOnOverprovisionedVMs: false,
        platformFaultDomainCount: 1,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-ag",
      sshPublicKeys: ["rg-ag::admingrucloud"],
      networkSecurityGroups: ["rg-ag::basicnsgvnet-nic01"],
      subnets: ["rg-ag::vnet::default"],
      applicationGateways: ["rg-ag::ag"],
    }),
  },
  {
    type: "ApplicationGateway",
    group: "Network",
    properties: ({ config, getId }) => ({
      name: "ag",
      properties: {
        sku: {
          name: "Standard_v2",
          tier: "Standard_v2",
        },
        gatewayIPConfigurations: [
          {
            name: "appGatewayIpConfig",
            properties: {
              subnet: {
                id: getId({
                  type: "Subnet",
                  group: "Network",
                  name: "rg-ag::vnet::subnet-ag",
                }),
              },
            },
          },
        ],
        frontendIPConfigurations: [
          {
            name: "appGwPublicFrontendIp",
            properties: {
              publicIPAddress: {
                id: getId({
                  type: "PublicIPAddress",
                  group: "Network",
                  name: "rg-ag::ip",
                }),
              },
            },
          },
        ],
        frontendPorts: [
          {
            name: "port_80",
            properties: {
              port: 80,
            },
          },
        ],
        backendAddressPools: [
          {
            name: "backendpool",
            properties: {},
          },
        ],
        backendHttpSettingsCollection: [
          {
            name: "http-settings",
            properties: {
              port: 80,
              protocol: "Http",
              cookieBasedAffinity: "Disabled",
              pickHostNameFromBackendAddress: false,
              requestTimeout: 20,
            },
          },
        ],
        httpListeners: [
          {
            name: "listener",
            properties: {
              frontendIPConfiguration: {
                id: `/subscriptions/${config.subscriptionId}/resourceGroups/rg-ag/providers/Microsoft.Network/applicationGateways/ag/frontendIPConfigurations/appGwPublicFrontendIp`,
              },
              frontendPort: {
                id: `/subscriptions/${config.subscriptionId}/resourceGroups/rg-ag/providers/Microsoft.Network/applicationGateways/ag/frontendPorts/port_80`,
              },
              protocol: "Http",
              hostNames: [],
              requireServerNameIndication: false,
            },
          },
        ],
        requestRoutingRules: [
          {
            name: "rule",
            properties: {
              ruleType: "Basic",
              priority: 1,
              httpListener: {
                id: `/subscriptions/${config.subscriptionId}/resourceGroups/rg-ag/providers/Microsoft.Network/applicationGateways/ag/httpListeners/listener`,
              },
              backendAddressPool: {
                id: `/subscriptions/${config.subscriptionId}/resourceGroups/rg-ag/providers/Microsoft.Network/applicationGateways/ag/backendAddressPools/backendpool`,
              },
              backendHttpSettings: {
                id: `/subscriptions/${config.subscriptionId}/resourceGroups/rg-ag/providers/Microsoft.Network/applicationGateways/ag/backendHttpSettingsCollection/http-settings`,
              },
            },
          },
        ],
        enableHttp2: false,
        autoscaleConfiguration: {
          minCapacity: 0,
          maxCapacity: 10,
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-ag",
      subnets: ["rg-ag::vnet::subnet-ag"],
      publicIpAddresses: ["rg-ag::ip"],
    }),
  },
  {
    type: "NetworkSecurityGroup",
    group: "Network",
    properties: ({}) => ({
      name: "basicnsgvnet-nic01",
      properties: {
        securityRules: [],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-ag",
    }),
  },
  {
    type: "PublicIPAddress",
    group: "Network",
    properties: ({}) => ({
      name: "ip",
      sku: {
        name: "Standard",
      },
      properties: {
        publicIPAllocationMethod: "Static",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-ag",
    }),
  },
  {
    type: "Subnet",
    group: "Network",
    properties: ({}) => ({
      name: "default",
      properties: {
        addressPrefix: "10.0.0.0/24",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-ag",
      virtualNetwork: "rg-ag::vnet",
    }),
  },
  {
    type: "Subnet",
    group: "Network",
    properties: ({}) => ({
      name: "subnet-ag",
      properties: {
        addressPrefix: "10.0.1.0/24",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-ag",
      virtualNetwork: "rg-ag::vnet",
    }),
  },
  {
    type: "VirtualNetwork",
    group: "Network",
    properties: ({}) => ({
      name: "vnet",
      properties: {
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-ag",
    }),
  },
  {
    type: "ResourceGroup",
    group: "Resources",
    properties: ({}) => ({
      name: "rg-ag",
    }),
  },
];
