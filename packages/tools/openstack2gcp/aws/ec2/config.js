const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  vpcEc2Example: {
    name: "vpc-ec2-example",
    properties: {
      CidrBlock: "10.1.0.0/16",
      DnsSupport: true,
      DnsHostnames: false,
    },
  },
  subnet: {
    name: "subnet",
    properties: {
      CidrBlock: "10.1.0.0/24",
    },
  },
});
