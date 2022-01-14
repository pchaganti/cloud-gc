// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

const createResources = ({ provider }) => {
  provider.Compute.makeDisk({
    name: "vm_DataDisk_0",
    properties: ({}) => ({
      sku: {
        name: "Premium_LRS",
      },
      properties: {
        creationData: {
          createOption: "Empty",
        },
        diskSizeGB: 1,
        diskIOPSReadWrite: 120,
        diskMBpsReadWrite: 25,
        encryption: {
          type: "EncryptionAtRestWithPlatformKey",
        },
        networkAccessPolicy: "AllowAll",
        tier: "P1",
        publicNetworkAccess: "Enabled",
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-vm-disks"],
    }),
  });

  provider.Compute.makeSshPublicKey({
    name: "keypair-vm",
    properties: ({}) => ({
      properties: {
        publicKey:
          "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDhnfm727z+WSZ2hwIUoE/oiAB1\r\nwT/oIG75RmHeNLgq6R0oVEf0nMFv2HiqZeZPXBARsHwbtGC/RaQ6p/ccTD/4AJLZ\r\n0daZDLZ6y48BPzMpwS92xfAAJLP2ot656m5x/O/46wLyOvKzrgztIZrxs4Bfjzu1\r\nz3ScKXo/U2CI1sfmCzVyy2zTBWywv4JghRu1VZvm9w7/itCgSP214FDgkzphybRe\r\nCejmizHH4SEz4cBb4RPznYY+B5TJmVLRGi01OAjENzhx0Wn28WisY6tCTipZqM4y\r\n4z9PPIEDPI4EMhVYBMfB+pIEEyPKlcUnO7yMtdaFakNC/Mb9VoA8AfghUS6Ya/ss\r\nfjA4nlJx6w51ceflCPlaY0mzg5zMlL/RAyAlstfHqfBLHES66LuxKYpICle7cae6\r\ntgmZjZp/cIC4C8dajYJ6q0ir2l8dYs+Ov5s7NGqbJIOvn8O51RulyaGtfWy+1Uwp\r\noV/fiksm36yhfynfkNZ3GpOMetKvs47sZtKFIqU= generated-by-azure\r\n",
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-vm-disks"],
    }),
  });

  provider.Compute.makeVirtualMachine({
    name: "vm",
    properties: ({ getId }) => ({
      properties: {
        hardwareProfile: {
          vmSize: "Standard_B1ls",
        },
        osProfile: {
          computerName: "vm",
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
          },
          adminPassword: process.env.VM_ADMIN_PASSWORD,
        },
        storageProfile: {
          imageReference: {
            publisher: "canonical",
            offer: "0001-com-ubuntu-server-focal",
            sku: "20_04-lts",
            version: "latest",
          },
          dataDisks: [
            {
              lun: 0,
              name: "vm_DataDisk_0",
              createOption: "Attach",
              caching: "None",
              writeAcceleratorEnabled: false,
              managedDisk: {
                storageAccountType: "Premium_LRS",
                id: getId({
                  type: "Disk",
                  group: "Compute",
                  name: "vm_DataDisk_0",
                }),
              },
              deleteOption: "Detach",
              diskSizeGB: 1,
              toBeDetached: false,
            },
          ],
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            enabled: true,
          },
        },
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-vm-disks"],
      networkInterfaces: [resources.Network.NetworkInterface["vm27"]],
      disks: [resources.Compute.Disk["vm_DataDisk_0"]],
      sshPublicKeys: [resources.Compute.SshPublicKey["keypair-vm"]],
    }),
  });

  provider.Network.makeNetworkInterface({
    name: "vm27",
    properties: ({}) => ({
      properties: {
        ipConfigurations: [
          {
            name: "ipconfig1",
            properties: {
              privateIPAllocationMethod: "Dynamic",
            },
          },
        ],
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-vm-disks"],
      virtualNetwork: resources.Network.VirtualNetwork["rg-vm-disks-vnet"],
      publicIpAddress: resources.Network.PublicIPAddress["vm-ip"],
      securityGroup: resources.Network.NetworkSecurityGroup["vm-nsg"],
      subnet: resources.Network.Subnet["default"],
    }),
  });

  provider.Network.makeNetworkSecurityGroup({
    name: "vm-nsg",
    properties: ({}) => ({
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
            },
          },
        ],
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-vm-disks"],
    }),
  });

  provider.Network.makePublicIPAddress({
    name: "vm-ip",
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-vm-disks"],
    }),
  });

  provider.Network.makeSubnet({
    name: "default",
    properties: ({}) => ({
      properties: {
        addressPrefix: "10.0.0.0/24",
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-vm-disks"],
      virtualNetwork: resources.Network.VirtualNetwork["rg-vm-disks-vnet"],
    }),
  });

  provider.Network.makeVirtualNetwork({
    name: "rg-vm-disks-vnet",
    properties: ({}) => ({
      properties: {
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-vm-disks"],
    }),
  });

  provider.Resources.makeResourceGroup({
    name: "rg-vm-disks",
  });
};

exports.createResources = createResources;
