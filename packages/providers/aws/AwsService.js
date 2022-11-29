const assert = require("assert");
const { pipe, tap } = require("rubico");

const { createAwsResource } = require("./AwsClient");

exports.createAwsService = ({
  package,
  client,
  type,
  propertiesDefault,
  omitProperties,
  inferName,
  dependencies,
  isDefault,
  cannotBeDeleted,
  managedByOther,
  filterLive,
  findName,
  findId,
  ignoreErrorCodes,
  ignoreErrorMessages,
  getById,
  getList,
  create,
  update,
  destroy,
  getByName,
  configDefault,
  compare,
  environmentVariables,
  ignoreResource,
  tagger = () => ({}),
  ...other
}) =>
  pipe([
    tap((params) => {
      assert(other);
    }),
    () => ({
      type,
      propertiesDefault,
      omitProperties,
      inferName,
      dependencies,
      filterLive,
      compare,
      environmentVariables,
      ignoreResource,
      Client: ({ spec, config }) =>
        createAwsResource({
          model: {
            package,
            client,
            getById,
            getList,
            create,
            update,
            destroy,
            ignoreErrorCodes,
            ignoreErrorMessages,
          },
          getById,
          spec,
          config,
          isDefault,
          cannotBeDeleted,
          managedByOther,
          findName,
          findId,
          getList,
          create,
          update,
          destroy,
          getByName,
          configDefault,
          ...tagger({ config }),
        }),
    }),
  ])();
