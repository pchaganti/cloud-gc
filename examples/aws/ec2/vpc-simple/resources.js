// Generated by 'gc gencode'
const { pipe, tap, get, eq, and } = require("rubico");
const { find } = require("rubico/x");

const createResources = ({ provider }) => {
  provider.EC2.makeVpc({
    name: "my-vpc",
    properties: ({ config }) => ({
      CidrBlock: "10.0.0.0/16",
    }),
  });
};

exports.createResources = createResources;