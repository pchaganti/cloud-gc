// Generated by 'gc gencode'
const { pipe, tap, get, eq, and } = require("rubico");
const { find } = require("rubico/x");

const createResources = ({ provider }) => {
  provider.Resources.makeResourceGroup({
    name: "rg",
  });

  provider.LogAnalytics.makeWorkspace({
    name: "logs",
    properties: ({ config }) => ({
      properties: {
        sku: {
          name: "pergb2018",
        },
        retentionInDays: 30,
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg"],
    }),
  });

  provider.AppService.makeKubeEnvironment({
    name: "dev",
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg"],
      workspace: resources.LogAnalytics.Workspace["logs"],
    }),
  });

  provider.AppService.makeContainerApp({
    name: "plantuml",
    properties: ({ config }) => ({
      properties: {
        configuration: {
          ingress: {
            external: true,
            targetPort: 8080,
          },
        },
        template: {
          containers: [
            {
              image: "docker.io/plantuml/plantuml-server:jetty-v1.2021.15",
              name: "plantuml",
              resources: {
                cpu: 0.5,
                memory: "1Gi",
              },
            },
          ],
          scale: {
            maxReplicas: 10,
          },
        },
      },
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg"],
      kubeEnvironment: resources.AppService.KubeEnvironment["dev"],
    }),
  });
};

exports.createResources = createResources;
