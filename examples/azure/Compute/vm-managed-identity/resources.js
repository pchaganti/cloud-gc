// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "SshPublicKey",
    group: "Compute",
    properties: ({ config }) => ({
      name: "keypair",
      location: config.location,
      properties: {
        publicKey:
          "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDC0/rnk5kQipNmX4ZtG+n0rAqCawway+rOuOubmxMPdBgvHCMak+M4Hc3bu6hxfJ549Ro0lNRWgCgQUSBNTUjcwurHApFiETGygwZr0n5TUExOaDWFmCz/YpGvrdOwcLutBvjy+Rhs/Y6rS0Vq5on357bUQvTmN2WJXxMHb5OTN+825qwdr0joV1j7OHLCKMHPkZGixE/ETnFFQHLz9dBaSN2n2R26PLc7s7x6N1YHrpvKM1/YO+h00/27XsXZctNmG/t9eqakr3KU+5aN0x8KBK2cI3iXfZBUneJt7O+2DvE2T42DZOyunPUV8GUAJh88MxTe2p/yQ+rLjxA7s5KokuGh9nPsU0nTGNfYY4PCjMDj0chVRk0wUMYcnFc9m0ZsAAZY/kQpZ+OkUAPLzxkZz3MsIQSXa9YRSNY0vQeeXMfa9JeCrYLKHnba2Bc3hwekggfZeZHecR2yXlk6ucoHl73j4pgQhnejfE+yyWLy5bC2lt3GQBFcmuc3IULxd2U= generated-by-azure",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-user-managed-identity",
    }),
  },
  {
    type: "VirtualMachine",
    group: "Compute",
    properties: ({ getId }) => ({
      name: "vm",
      properties: {
        hardwareProfile: {
          vmSize: "Standard_B1ls",
        },
        osProfile: {
          computerName: "vm",
          adminUsername: "ops",
          linuxConfiguration: {
            disablePasswordAuthentication: true,
            ssh: {
              publicKeys: [
                {
                  path: "/home/ops/.ssh/authorized_keys",
                  keyData: `${getId({
                    type: "SshPublicKey",
                    group: "Compute",
                    name: "rg-user-managed-identity::keypair",
                    path: "live.properties.publicKey",
                  })}`,
                },
              ],
            },
            enableVMAgentPlatformUpdates: false,
          },
          adminPassword: process.env.RG_USER_MANAGED_IDENTITY_VM_ADMIN_PASSWORD,
        },
        storageProfile: {
          imageReference: {
            publisher: "Canonical",
            offer: "UbuntuServer",
            sku: "18.04-LTS",
            version: "latest",
          },
          osDisk: {
            osType: "Linux",
            name: "vm_OsDisk_1_605a4b8ed8b742e092a0b09fac517d22",
            createOption: "FromImage",
            caching: "ReadWrite",
            managedDisk: {
              storageAccountType: "Premium_LRS",
            },
            deleteOption: "Detach",
            diskSizeGB: 30,
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: getId({
                type: "NetworkInterface",
                group: "Network",
                name: "rg-user-managed-identity::network-interface",
              }),
              properties: {
                primary: true,
              },
            },
          ],
        },
      },
      identity: {
        type: "UserAssigned",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-user-managed-identity",
      managedIdentities: ["rg-user-managed-identity::MyIdentity"],
      sshPublicKeys: ["rg-user-managed-identity::keypair"],
      networkInterfaces: ["rg-user-managed-identity::network-interface"],
    }),
  },
  {
    type: "UserAssignedIdentity",
    group: "ManagedIdentity",
    properties: ({ config }) => ({
      name: "MyIdentity",
      location: config.location,
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-user-managed-identity",
    }),
  },
  {
    type: "NetworkInterface",
    group: "Network",
    properties: ({ config, getId }) => ({
      name: "network-interface",
      location: config.location,
      properties: {
        ipConfigurations: [
          {
            properties: {
              publicIPAddress: {
                id: `${getId({
                  type: "PublicIPAddress",
                  group: "Network",
                  name: "rg-user-managed-identity::ip-address",
                })}`,
              },
              subnet: {
                id: `${getId({
                  type: "Subnet",
                  group: "Network",
                  name: "rg-user-managed-identity::virtual-network::subnet",
                })}`,
              },
            },
            name: "ipconfig1",
          },
        ],
        enableIPForwarding: true,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-user-managed-identity",
      networkSecurityGroup: "rg-user-managed-identity::security-group",
      publicIpAddresses: ["rg-user-managed-identity::ip-address"],
      subnets: ["rg-user-managed-identity::virtual-network::subnet"],
    }),
  },
  {
    type: "NetworkSecurityGroup",
    group: "Network",
    properties: ({}) => ({
      name: "security-group",
      properties: {
        securityRules: [
          {
            name: "SSH",
            properties: {
              description: "allow SSH",
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "22",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 1000,
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
      resourceGroup: "rg-user-managed-identity",
    }),
  },
  {
    type: "PublicIPAddress",
    group: "Network",
    properties: ({}) => ({
      name: "ip-address",
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-user-managed-identity",
    }),
  },
  {
    type: "Subnet",
    group: "Network",
    properties: ({}) => ({
      name: "subnet",
      properties: {
        addressPrefix: "10.0.0.0/24",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-user-managed-identity",
      virtualNetwork: "rg-user-managed-identity::virtual-network",
    }),
  },
  {
    type: "VirtualNetwork",
    group: "Network",
    properties: ({}) => ({
      name: "virtual-network",
      properties: {
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-user-managed-identity",
    }),
  },
  {
    type: "ResourceGroup",
    group: "Resources",
    properties: ({}) => ({
      name: "rg-user-managed-identity",
    }),
  },
];
