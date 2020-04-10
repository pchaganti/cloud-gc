const GoogleClient = require("../GoogleClient");

const type = "compute";

module.exports = ({ name, provider }, config) => {
  const { project, region } = config;
  const client = GoogleClient({
    config,
    url: `/projects/${project}/regions/${region}/addresses/`,
  });

  const plan = async (resource) => {
    try {
      return [];
    } catch (ex) {
      console.log(`resource ${resource.name} not found `);
      return [
        {
          action: "CREATE",
          resource,
        },
      ];
    }
  };

  return {
    name,
    type,
    client,
    provider,
    plan,
  };
};
