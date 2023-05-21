// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Mesh",
    group: "AppMesh",
    properties: ({}) => ({
      meshName: "my-mesh",
      spec: {
        egressFilter: {
          type: "DROP_ALL",
        },
      },
    }),
  },
  {
    type: "Route",
    group: "AppMesh",
    properties: ({}) => ({
      routeName: "my-route",
      spec: {
        httpRoute: {
          action: {
            weightedTargets: [
              {
                port: 80,
                virtualNode: "my-node",
                weight: 1,
              },
            ],
          },
          match: {
            prefix: "/",
          },
        },
      },
      virtualRouterName: "my-router",
    }),
    dependencies: ({}) => ({
      mesh: "my-mesh",
      virtualRouter: "my-mesh::my-router",
    }),
  },
  {
    type: "VirtualNode",
    group: "AppMesh",
    properties: ({}) => ({
      spec: {
        backendDefaults: {
          clientPolicy: {},
        },
        backends: [],
        listeners: [
          {
            portMapping: {
              port: 80,
              protocol: "http",
            },
          },
        ],
        logging: {},
        serviceDiscovery: {
          dns: {
            hostname: "my-service.grucloud.org",
          },
        },
      },
      virtualNodeName: "my-node",
    }),
    dependencies: ({}) => ({
      mesh: "my-mesh",
    }),
  },
  {
    type: "VirtualRouter",
    group: "AppMesh",
    properties: ({}) => ({
      spec: {
        listeners: [
          {
            portMapping: {
              port: 80,
              protocol: "http",
            },
          },
        ],
      },
      virtualRouterName: "my-router",
    }),
    dependencies: ({}) => ({
      mesh: "my-mesh",
    }),
  },
  {
    type: "VirtualService",
    group: "AppMesh",
    properties: ({}) => ({
      spec: {
        provider: {
          virtualRouter: {
            virtualRouterName: "my-router",
          },
        },
      },
      virtualServiceName: "my-service",
    }),
    dependencies: ({}) => ({
      mesh: "my-mesh",
      virtualRouter: "my-mesh::my-router",
    }),
  },
  {
    type: "PrincipalAssociation",
    group: "RAM",
    properties: ({}) => ({
      associatedEntity: "548529576214",
      external: false,
    }),
    dependencies: ({}) => ({
      resourceShare: "share-mesh",
    }),
  },
  {
    type: "ResourceAssociation",
    group: "RAM",
    properties: ({}) => ({
      external: false,
    }),
    dependencies: ({}) => ({
      resourceShare: "share-mesh",
      appMesh: "my-mesh",
    }),
  },
  {
    type: "ResourceShare",
    group: "RAM",
    properties: ({}) => ({
      allowExternalPrincipals: true,
      featureSet: "STANDARD",
      name: "share-mesh",
    }),
  },
];
