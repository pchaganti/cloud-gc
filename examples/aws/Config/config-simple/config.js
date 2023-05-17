const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudFormation", "Config", "S3", "SSM"],
});
