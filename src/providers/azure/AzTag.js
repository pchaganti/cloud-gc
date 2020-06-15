const assert = require("assert");
const _ = require("lodash");
const logger = require("../../logger")({ prefix: "AzTag" });
const toString = (x) => JSON.stringify(x, null, 4);
const hasTag = (name = "", tag) => name && name.includes(tag);

exports.toTagName = (name, tag) => `${name}${tag}`;
exports.fromTagName = (name, tag) => name && name.replace(tag, "");
exports.hasTag = hasTag;

exports.isOurMinion = ({ resource, config }) => {
  logger.info(`isOurMinion ? ${toString({ config, resource })}`);
  const { managedByKey, managedByValue } = config;
  assert(managedByKey);
  const { tags = {} } = resource;
  let isMinion = false;

  const isGruLabel = (key, value) =>
    key === managedByKey && value === managedByValue;

  if (_.find(tags, (value, key) => isGruLabel(key, value))) {
    isMinion = true;
  }

  logger.info(
    `isOurMinion isMinion: ${isMinion}, ${toString({ config, resource })}`
  );
  return isMinion;
};
