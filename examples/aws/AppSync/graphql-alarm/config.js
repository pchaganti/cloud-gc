const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["AppSync", "CloudWatch", "DynamoDB", "SNS"],
});
