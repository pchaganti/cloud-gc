const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
});
