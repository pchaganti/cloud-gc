// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Binding",
    group: "iam",
    name: "roles/firebasenotifications.viewer",
    dependencies: ({}) => ({
      serviceAccounts: ["sa-test-example"],
    }),
  },
  {
    type: "ServiceAccount",
    group: "iam",
    name: "sa-test-example",
    properties: ({}) => ({
      serviceAccount: {
        displayName: "SA dev",
        description: "Managed By GruCloud",
      },
    }),
  },
];
