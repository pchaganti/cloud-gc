const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudFront", "IAM", "Lambda", "S3"],
});
