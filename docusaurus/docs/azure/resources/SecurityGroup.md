---
id: SecurityGroup
title: Security Group
---

Provides a Security Group:

```js
const sg = provider.makeSecurityGroup({
  name: `security-group`,
  dependencies: { resourceGroup },
  properties: {
    properties: {
      securityRules: [
        {
          name: "SSH",
          properties: {
            access: "Allow",
            direction: "Inbound",
            protocol: "Tcp",
            destinationPortRange: "22",
            destinationAddressPrefix: "*",
            sourcePortRange: "*",
            sourceAddressPrefix: "*",
            priority: 1000,
          },
        },
      ],
    },
  },
});
```

### Examples

- [basic example](https://github.com/FredericHeem/grucloud/blob/master/examples/azure/iac.js#L33)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networksecuritygroups/createorupdate#request-body)

### Dependencies

- [ResourceGroup](./ResourceGroup)

### Used By

- [NetworkInterface](./NetworkInterface)