// Generated by 'gc gencode'
const { pipe, tap, get, eq, and } = require("rubico");
const { find } = require("rubico/x");

const createResources = ({ provider }) => {
  provider.Compute.makeVirtualMachine({
    name: "vm",
    properties: ({ config }) => ({
      properties: {
        hardwareProfile: {
          vmSize: "Standard_A1_v2",
        },
        storageProfile: {
          imageReference: {
            publisher: "Canonical",
            offer: "UbuntuServer",
            sku: "18.04-LTS",
            version: "latest",
          },
        },
        osProfile: {
          computerName: "myVM",
          adminUsername: "ops",
          linuxConfiguration: {
            disablePasswordAuthentication: false,
            provisionVMAgent: true,
            patchSettings: {
              patchMode: "ImageDefault",
              assessmentMode: "ImageDefault",
            },
          },
          allowExtensionOperations: true,
          adminPassword: process.env.VM_ADMIN_PASSWORD,
        },
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["resource-group"],
      networkInterface: resources.Network.NetworkInterface["network-interface"],
    }),
  });

  provider.Network.makeNetworkInterface({
    name: "network-interface",
    properties: ({ config }) => ({
      properties: {
        ipConfigurations: [
          {
            name: "ipconfig",
            properties: {
              privateIPAllocationMethod: "Dynamic",
            },
          },
        ],
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["resource-group"],
      virtualNetwork: resources.Network.VirtualNetwork["virtual-network"],
      publicIpAddress: resources.Network.PublicIPAddress["ip"],
      securityGroup: resources.Network.NetworkSecurityGroup["security-group"],
      subnet: resources.Network.Subnet["subnet"],
    }),
  });

  provider.Network.makeNetworkSecurityGroup({
    name: "security-group",
    properties: ({ config }) => ({
      properties: {
        securityRules: [
          {
            name: "SSH",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "22",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 1000,
              direction: "Inbound",
            },
          },
          {
            name: "ICMP",
            properties: {
              protocol: "Icmp",
              sourcePortRange: "*",
              destinationPortRange: "*",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 1001,
              direction: "Inbound",
            },
          },
        ],
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["resource-group"],
    }),
  });

  provider.Network.makePublicIPAddress({
    name: "ip",
    properties: ({ config }) => ({
      properties: {
        publicIPAddressVersion: "IPv4",
        publicIPAllocationMethod: "Dynamic",
        idleTimeoutInMinutes: 4,
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["resource-group"],
    }),
  });

  provider.Network.makeSubnet({
    name: "subnet",
    properties: ({ config }) => ({
      properties: {
        addressPrefix: "10.0.0.0/24",
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["resource-group"],
      virtualNetwork: resources.Network.VirtualNetwork["virtual-network"],
    }),
  });

  provider.Network.makeVirtualNetwork({
    name: "virtual-network",
    properties: ({ config }) => ({
      properties: {
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["resource-group"],
    }),
  });

  provider.Resources.makeResourceGroup({
    name: "resource-group",
  });
};

exports.createResources = createResources;
