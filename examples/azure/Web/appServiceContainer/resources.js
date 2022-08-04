// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "ResourceGroup",
    group: "Resources",
    properties: ({}) => ({
      name: "rg-app",
    }),
  },
  {
    type: "AppServicePlan",
    group: "Web",
    properties: ({ config }) => ({
      name: "ASP-rgapp-8ffa",
      kind: "linux",
      location: config.location,
      properties: {
        reserved: true,
      },
      sku: {
        name: "F1",
        tier: "Free",
        size: "F1",
        family: "F",
        capacity: 1,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-app",
    }),
  },
  {
    type: "WebApp",
    group: "Web",
    properties: ({ config }) => ({
      name: "gc-app-test",
      kind: "app,linux,container",
      location: config.location,
      properties: {
        enabled: true,
        reserved: true,
        vnetRouteAllEnabled: false,
        siteConfig: {
          numberOfWorkers: 1,
          linuxFxVersion: "DOCKER|mcr.microsoft.com/appsvc/staticsite:latest",
          acrUseManagedIdentityCreds: false,
          alwaysOn: false,
          http20Enabled: false,
          functionAppScaleLimit: 0,
          minimumElasticInstanceCount: 0,
        },
        clientAffinityEnabled: false,
        clientCertEnabled: false,
        clientCertMode: "Required",
        hostNamesDisabled: false,
        containerSize: 0,
        dailyMemoryTimeQuota: 0,
        httpsOnly: false,
        redundancyMode: "None",
        storageAccountRequired: false,
        keyVaultReferenceIdentity: "SystemAssigned",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-app",
      appServicePlan: "rg-app::ASP-rgapp-8ffa",
    }),
  },
];
