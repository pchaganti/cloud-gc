// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "DelegatedAdminAccount",
    group: "Inspector2",
    dependencies: ({}) => ({
      account: "test account",
    }),
  },
  {
    type: "Enabler",
    group: "Inspector2",
    properties: ({}) => ({
      resourceTypes: ["EC2", "ECR", "LAMBDA"],
    }),
  },
  {
    type: "Account",
    group: "Organisations",
    name: "test account",
    readOnly: true,
    properties: ({}) => ({
      Email: "test@grucloud.com",
      Name: "test account",
    }),
  },
];
