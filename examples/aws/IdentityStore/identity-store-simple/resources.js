// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Group",
    group: "IdentityStore",
    properties: ({}) => ({
      DisplayName: "my-group",
    }),
    dependencies: ({}) => ({
      identityStore: "default",
    }),
  },
  {
    type: "Instance",
    group: "SSOAdmin",
    name: "default",
    readOnly: true,
    properties: ({}) => ({
      Name: "default",
    }),
  },
];
