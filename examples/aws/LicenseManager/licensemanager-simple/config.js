const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["IAM", "EC2", "LicenseManager"],
});