// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "DelegationSet",
    group: "Route53",
    properties: ({}) => ({
      CallerReference: "1674073235N",
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "grucloud.org.",
    }),
    dependencies: ({}) => ({
      delegationSet: "1674073235N",
      domain: "grucloud.org",
    }),
  },
  {
    type: "Domain",
    group: "Route53Domains",
    name: "grucloud.org",
    readOnly: true,
  },
];
