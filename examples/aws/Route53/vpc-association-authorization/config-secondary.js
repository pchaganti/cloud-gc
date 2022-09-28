const pkg = require("./package.json");

// https://www.npmjs.com/package/@aws-sdk/credential-providers#fromini
module.exports = () => ({
  projectName: pkg.name,
  credentials: { profile: "account_secondary" },
});
