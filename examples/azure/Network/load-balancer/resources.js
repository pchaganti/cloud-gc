// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

const createResources = ({ provider }) => {
  provider.Compute.makeSshPublicKey({
    name: "rg-load-balancer::vm_key",
    properties: ({}) => ({
      properties: {
        publicKey:
          "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDLvH4OrzJFkq2Ak7NokSgv+EOH\r\nLdstFxBNsB5jiU/Hz0wjdjFsK9etGjKPCTohKT9/wIGz3Fzy4vRjRljqqjx0CuGa\r\nPp6vV1JJHUcSOyJTJE5wSauBsDsZ34ydf05M04YTPpYT6SPa3DVWJ0VkcoPjj5BO\r\nTX0EcxrthMZSMbQ5Ceo5xW1TDmr5hq1wtRoBAhqo+4GcPkfBUZSo5dbZeE04T5yj\r\nDmqtpY8ZmGvPwJgD/1Sx2VnVitXRurwo17Y+xILSgYcajCaa/zO4aYldMlNmfbod\r\nhYYtFFv/9zWFZHUYt7i0uKb+JjfvubJFZjiYx5CdyN4hVtwTroVE6q9G57K7vr3G\r\nR6lTCAH/BuZ6NLob+m5HmSqhqySVDBZd/GCRnDRLpljvV1mh48Px4pZrp18oVOry\r\n7bW1B4htgcUkW2rHUnNrAEj9rUxKDoMprii3f61TuFgbufSlwm4kFplk4s5aDJ/t\r\nDw6meVQlvhlR40UA/qe95fmL88UOUbTh6svQeGE= generated-by-azure\r\n",
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-load-balancer"],
    }),
  });

  provider.Compute.makeVirtualMachineScaleSet({
    name: "rg-load-balancer::vm-scale-set",
    properties: ({ getId }) => ({
      sku: {
        name: "Standard_B1ls",
        tier: "Standard",
        capacity: 2,
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
            computerNamePrefix: "vm-scale-",
            adminUsername: "azureuser",
            linuxConfiguration: {
              disablePasswordAuthentication: true,
              ssh: {
                publicKeys: [
                  {
                    path: "/home/azureuser/.ssh/authorized_keys",
                  },
                ],
              },
              provisionVMAgent: true,
            },
            allowExtensionOperations: true,
            adminPassword:
              process.env.RG_LOAD_BALANCER_VM_SCALE_SET_ADMIN_PASSWORD,
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
                      name: "rg-load-balancer::basicnsgvnet-nic01",
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
                            name: "rg-load-balancer::vnet::default",
                          }),
                        },
                        privateIPAddressVersion: "IPv4",
                      },
                    },
                  ],
                },
              },
            ],
            networkInterfaces: undefined,
          },
        },
        overprovision: false,
        doNotRunExtensionsOnOverprovisionedVMs: false,
        platformFaultDomainCount: 1,
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-load-balancer"],
      subnets: [resources.Network.Subnet["rg-load-balancer::vnet::default"]],
      sshPublicKeys: [
        resources.Compute.SshPublicKey["rg-load-balancer::vm_key"],
      ],
      networkSecurityGroups: [
        resources.Network.NetworkSecurityGroup[
          "rg-load-balancer::basicnsgvnet-nic01"
        ],
      ],
    }),
  });

  provider.Network.makeLoadBalancer({
    name: "rg-load-balancer::load-balancer",
    properties: ({ getId }) => ({
      sku: {
        name: "Standard",
        tier: "Regional",
      },
      properties: {
        frontendIPConfigurations: [
          {
            name: "frontend",
            properties: {
              provisioningState: "Succeeded",
              privateIPAllocationMethod: "Dynamic",
              publicIPAddress: {
                id: getId({
                  type: "PublicIPAddress",
                  group: "Network",
                  name: "rg-load-balancer::ip-address",
                }),
              },
            },
          },
        ],
        loadBalancingRules: [],
        probes: [],
        inboundNatRules: [],
        outboundRules: [],
        inboundNatPools: [],
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-load-balancer"],
      publicIPAddresses: [
        resources.Network.PublicIPAddress["rg-load-balancer::ip-address"],
      ],
    }),
  });

  provider.Network.makeNetworkSecurityGroup({
    name: "rg-load-balancer::basicnsgvnet-nic01",
    properties: ({}) => ({
      properties: {
        securityRules: [],
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-load-balancer"],
    }),
  });

  provider.Network.makePublicIPAddress({
    name: "rg-load-balancer::ip-address",
    properties: ({}) => ({
      sku: {
        name: "Standard",
      },
      properties: {
        publicIPAllocationMethod: "Static",
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-load-balancer"],
    }),
  });

  provider.Network.makeSubnet({
    name: "rg-load-balancer::vnet::default",
    properties: ({}) => ({
      name: "default",
      properties: {
        addressPrefix: "10.0.0.0/16",
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-load-balancer"],
      virtualNetwork:
        resources.Network.VirtualNetwork["rg-load-balancer::vnet"],
    }),
  });

  provider.Network.makeVirtualNetwork({
    name: "rg-load-balancer::vnet",
    properties: ({}) => ({
      properties: {
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-load-balancer"],
    }),
  });

  provider.Resources.makeResourceGroup({
    name: "rg-load-balancer",
  });
};

exports.createResources = createResources;
