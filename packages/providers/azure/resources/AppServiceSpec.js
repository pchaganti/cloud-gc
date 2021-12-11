const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit, any } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const AzClient = require("../AzClient");
const {
  findDependenciesResourceGroup,
  compare,
  buildTags,
} = require("../AzureCommon");

exports.fnSpecs = ({ config }) => {
  const { providerName, location } = config;

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/appservice/kube-environments
        group: "AppService",
        type: "KubeEnvironment",
        dependsOn: ["Resources::ResourceGroup", "LogAnalytics::Workspace"],
        dependsOnList: ["Resources::ResourceGroup"],
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
          },
          workspace: {
            type: "Workspace",
            group: "LogAnalytics",
          },
        }),
        propertiesDefault: {
          properties: {
            type: "managed",
            appLogsConfiguration: {
              destination: "log-analytics",
            },
          },
        },
        compare: compare({
          filterAll: pipe([
            tap((params) => {
              assert(true);
            }),
            omit([
              "properties.appLogsConfiguration.logAnalyticsConfiguration.sharedKey",
            ]),
          ]),
        }),
        filterLive: () =>
          pipe([
            pick(["tags", "properties"]),
            assign({
              properties: pipe([get("properties"), pick([])]),
            }),
          ]),
        Client: ({ spec }) =>
          AzClient({
            spec,
            pathSuffix: ({ dependencies: { resourceGroup } }) => {
              assert(resourceGroup, "missing resourceGroup dependency");
              return `/resourceGroups/${resourceGroup.name}/providers/Microsoft.Web/kubeEnvironments`;
            },
            pathSuffixList: () => `/providers/Microsoft.Web/kubeEnvironments`,
            apiVersion: "2021-02-01",
            config,
            findDependencies: ({ live, lives }) => [
              findDependenciesResourceGroup({ live, lives, config }),
              {
                type: "Workspace",
                group: "LogAnalytics",
                ids: [
                  pipe([
                    () => live,
                    get(
                      "properties.appLogsConfiguration.logAnalyticsConfiguration.customerId"
                    ),
                    (customerId) =>
                      pipe([
                        tap((params) => {
                          assert(customerId);
                        }),
                        () =>
                          lives.getByType({
                            providerName,
                            type: "Workspace",
                            group: "LogAnalytics",
                          }),
                        find(eq(get("live.properties.customerId"), customerId)),
                        tap((params) => {
                          assert(true);
                        }),
                        get("id"),
                      ])(),
                  ])(),
                ],
              },
            ],
            configDefault: ({ properties, dependencies: { workspace } }) =>
              pipe([
                tap(() => {
                  assert(workspace);
                }),
                () => properties,
                defaultsDeep({
                  location,
                  tags: buildTags(config),
                  properties: {
                    appLogsConfiguration: {
                      logAnalyticsConfiguration: {
                        customerId: getField(
                          workspace,
                          "properties.customerId"
                        ),
                        sharedKey: getField(
                          workspace,
                          "sharedKeys.primarySharedKey"
                        ),
                      },
                    },
                  },
                }),
                tap((params) => {
                  assert(true);
                }),
              ])(),
          }),
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/appservice/kube-environments
        group: "AppService",
        type: "ContainerApp",
        dependsOn: ["Resources::ResourceGroup", "AppService::KubeEnvironment"],
        dependsOnList: ["Resources::ResourceGroup"],
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
          },
          kubeEnvironment: {
            type: "KubeEnvironment",
            group: "AppService",
          },
        }),
        compare: compare({
          filterAll: pipe([omit(["location"])]),
        }),
        propertiesDefault: {
          properties: {
            configuration: {
              activeRevisionsMode: "Multiple",
              ingress: {
                transport: "Auto",
                traffic: [
                  {
                    weight: 100,
                    latestRevision: true,
                  },
                ],
                allowInsecure: false,
              },
            },
            template: {
              revisionSuffix: "",
            },
          },
        },
        filterLive: () =>
          pipe([
            pick(["tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                pick(["configuration", "template"]),
                omit(["configuration.ingress.fqdn"]),
              ]),
            }),
          ]),
        Client: ({ spec }) =>
          AzClient({
            spec,
            pathSuffix: ({ dependencies: { resourceGroup } }) => {
              assert(resourceGroup, "missing resourceGroup dependency");
              return `/resourceGroups/${resourceGroup.name}/providers/Microsoft.Web/containerapps`;
            },
            verbUpdate: "PUT",
            pathSuffixList: () => `/providers/Microsoft.Web/containerapps`,
            apiVersion: "2021-03-01",
            config,
            findDependencies: ({ live, lives }) => [
              findDependenciesResourceGroup({ live, lives, config }),
              {
                type: "KubeEnvironment",
                group: "AppService",
                ids: [
                  pipe([() => live, get("properties.kubeEnvironmentId")])(),
                ],
              },
            ],
            configDefault: ({
              properties,
              dependencies: { kubeEnvironment },
            }) =>
              pipe([
                tap(() => {
                  assert(kubeEnvironment);
                }),
                () => properties,
                defaultsDeep({
                  location,
                  tags: buildTags(config),
                  properties: {
                    kubeEnvironmentId: getField(kubeEnvironment, "id"),
                  },
                }),
              ])(),
          }),
      },
    ],
  ])();
};
