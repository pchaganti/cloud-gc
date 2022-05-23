// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "DatabaseAccount",
    group: "DocumentDB",
    properties: ({}) => ({
      properties: {
        disableLocalAuth: false,
        diagnosticLogSettings: {
          enableFullTextQuery: "None",
        },
        networkAclBypass: "None",
        cors: [],
        backupPolicy: {
          periodicModeProperties: {
            backupStorageRedundancy: "Geo",
            backupRetentionIntervalInHours: 8,
            backupIntervalInMinutes: 240,
          },
          type: "Periodic",
        },
        analyticalStorageConfiguration: {
          schemaType: "WellDefined",
        },
        enableAnalyticalStorage: false,
        enableFreeTier: true,
        publicNetworkAccess: "Enabled",
        defaultIdentity: "FirstPartyIdentity",
        disableKeyBasedMetadataWriteAccess: false,
        enableMultipleWriteLocations: false,
        virtualNetworkRules: [],
        capabilities: [],
        enableAutomaticFailover: false,
        isVirtualNetworkFilterEnabled: false,
        ipRules: [],
        databaseAccountOfferType: "Standard",
        locations: [
          {
            isZoneRedundant: false,
            failoverPriority: 0,
            locationName: "East US",
          },
        ],
        consistencyPolicy: {
          maxIntervalInSeconds: 5,
          maxStalenessPrefix: 100,
          defaultConsistencyLevel: "Session",
        },
      },
      identity: {
        type: "None",
      },
      name: "grucloud",
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-cosmos",
    }),
  },
  {
    type: "ResourceGroup",
    group: "Resources",
    properties: ({}) => ({
      name: "rg-cosmos",
    }),
  },
];
