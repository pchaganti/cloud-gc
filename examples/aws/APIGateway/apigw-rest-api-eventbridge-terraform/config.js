const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["APIGateway", "CloudWatchEvents", "CloudWatchLogs"],
});
