exports.iacTpl = ({ resourcesCode, resourcesVarNames = [] }) => `
// Generated by aws2gc
const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = async ({ provider }) => {
  const {config} = provider;
  
  ${resourcesCode}
  return {
    ${resourcesVarNames.join(",")}
  };
};

exports.createResources = createResources;

exports.createStack = async () => {
  const provider = AwsProvider({ config: require("./config") });
  const resources = await createResources({
    provider,
  });

  return {
    provider,
    resources,
  };
};

`;
