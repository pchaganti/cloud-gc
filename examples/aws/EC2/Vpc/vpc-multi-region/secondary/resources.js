// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "non-prod",
    properties: ({}) => ({
      CidrBlock: "10.1.0.0/16",
      Tags: [
        {
          Key: "Environment",
          Value: "nonprod",
        },
      ],
      DnsHostnames: true,
    }),
  },
];
