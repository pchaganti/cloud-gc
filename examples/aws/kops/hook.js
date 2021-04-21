const assert = require("assert");

module.exports = ({ resources: {}, provider }) => {
  assert(provider);
  const { config } = provider;
  return {
    onDeployed: {
      init: async () => {
        return {};
      },
      /*actions: [
        {
          name: "TODO",
          command: async () => {},
        },
      ],*/
    },
    onDestroyed: {
      init: () => {},
    },
  };
};
