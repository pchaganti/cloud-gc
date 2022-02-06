// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

const createResources = ({ provider }) => {
  provider.Compute.makeSshPublicKey({
    name: "rg-ssh-public-key::my-key-pair",
    properties: ({}) => ({
      name: "my-key-pair",
      publicKeyFile: "keys/my-key-pair.pub",
    }),
    dependencies: () => ({
      resourceGroup: "rg-ssh-public-key",
    }),
  });

  provider.Resources.makeResourceGroup({
    name: "rg-ssh-public-key",
    properties: ({}) => ({
      name: "rg-ssh-public-key",
    }),
  });
};

exports.createResources = createResources;
