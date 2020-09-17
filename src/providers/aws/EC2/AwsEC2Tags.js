const logger = require("../../../logger")({ prefix: "EC2TAG" });
const assert = require("assert");
const { tos } = require("../../../tos");

exports.isOurMinion = ({ resource, config }) => {
  const { managedByKey, managedByValue } = config;
  assert(resource);
  assert(resource.Tags);

  let minion = false;
  if (
    resource.Tags.find(
      (tag) => tag.Key === managedByKey && tag.Value === managedByValue
    )
  ) {
    minion = true;
  }

  logger.debug(
    `isOurMinion ${tos({
      minion,
      resource,
    })}`
  );
  return minion;
};
// Remove it, same as above
exports.isOurMinionEc2 = ({ resource, config }) => {
  const { managedByKey, managedByValue } = config;
  assert(resource);
  assert(resource.Tags);

  const isMinion = resource.Tags.find(
    (tag) => tag.Key === managedByKey && tag.Value === managedByValue
  );

  logger.debug(
    `isOurMinion ec2: ${tos({
      isMinion,
      resource,
    })}`
  );
  return isMinion;
};
