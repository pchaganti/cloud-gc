// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "myip",
    properties: ({}) => ({
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    name: "grucloud.org.",
    properties: ({}) => ({
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: () => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    properties: ({ getId }) => ({
      Name: "grucloud.org.",
      Type: "A",
      TTL: 300,
      ResourceRecords: [
        {
          Value: getId({
            type: "ElasticIpAddress",
            group: "EC2",
            name: "myip",
            path: "live.PublicIp",
          }),
        },
      ],
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: () => ({
      hostedZone: "grucloud.org.",
      elasticIpAddress: "myip",
    }),
  },
  {
    type: "Domain",
    group: "Route53Domains",
    name: "grucloud.org",
    readOnly: true,
  },
];