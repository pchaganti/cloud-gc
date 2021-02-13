const assert = require("assert");
const {
  pipe,
  tap,
  map,
  get,
  filter,
  tryCatch,
  switchCase,
  assign,
} = require("rubico");
const { defaultsDeep } = require("rubico/x");

const GoogleClient = require("../../GoogleClient");
const { GCP_STORAGE_BASE_URL } = require("./GcpStorageCommon");
const { buildLabel } = require("../../GoogleCommon");
const logger = require("../../../../logger")({ prefix: "GcpBucket" });
const { tos } = require("../../../../tos");
const { retryCallOnError } = require("../../../Retry");
const { mapPoolSize } = require("../../../Common");

const findTargetId = get("id");

// https://cloud.google.com/storage/docs/json_api/v1/buckets
// https://cloud.google.com/storage/docs/json_api/v1/buckets/insert

exports.GcpBucket = ({ spec, config: configProvider }) => {
  assert(spec);
  assert(configProvider);
  const { projectId, region } = configProvider;
  const queryParam = () => `/?project=${projectId(configProvider)}`;
  const pathList = queryParam;
  const pathCreate = queryParam;

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      name,
      location: region,
      labels: buildLabel(configProvider),
    })(properties);

  const client = GoogleClient({
    spec,
    baseURL: GCP_STORAGE_BASE_URL,
    url: `/b`,
    config: configProvider,
    findTargetId,
    pathList,
    pathCreate,
    configDefault,
  });

  const { axios } = client;

  const getIam = assign({
    iam: pipe([
      tap((item) => {
        assert(item.name, "item.name");
        logger.debug(`getIam name: ${tos(item.name)}`);
      }),
      (item) =>
        retryCallOnError({
          name: `getIam ${item.name}`,
          fn: () => axios.get(`/${item.name}/iam`),
          config: configProvider,
        }),
      get("data"),
      tap((result) => {
        logger.debug(`getIam result: ${tos(result)}`);
      }),
    ]),
  });

  const getById = async ({ id, name, deep }) =>
    pipe([
      tap(() => {
        logger.info(`getById ${JSON.stringify({ id, name })}`);
      }),
      () => client.getById({ id, name }),
      switchCase([(result) => result && deep, getIam, (result) => result]),
      tap((result) => {
        logger.debug(`getById result: ${tos(result)}`);
      }),
    ])();

  const getByName = ({ name, deep }) => getById({ id: name, name, deep });

  const create = async ({ name, payload, dependencies }) =>
    pipe([
      tap(() => {
        logger.info(`create bucket ${name}`);
        logger.debug(`bucket create payload ${tos(payload)}`);
      }),
      () => client.create({ name, payload, dependencies }),
      tap((result) => {
        logger.debug(`created bucket ${name}`);
      }),
      tap(
        switchCase([
          () => payload.iam,
          () =>
            retryCallOnError({
              name: `setIam`,
              fn: () => axios.put(`/${name}/iam`, { data: payload.iam }),
              config: configProvider,
            }),
          () => {},
        ])
      ),
    ])();

  const getList = async ({ deep }) =>
    pipe([
      tap(() => {
        logger.info(`getList bucket, deep: ${deep}`);
      }),
      () => client.getList({ deep }),
      tap((result) => {
        logger.debug(`getList #items ${result.items.length}`);
      }),
      switchCase([
        () => deep,
        pipe([
          ({ items }) => map.pool(mapPoolSize, getIam)(items),
          (items) => ({ items, total: items.length }),
        ]),
        (result) => result,
      ]),
      tap((result) => {
        logger.debug(`getList bucket result: ${tos(result)}`);
      }),
    ])();

  const destroy = async ({ id: bucketName }) =>
    pipe([
      tap(() => {
        assert(bucketName, `destroy invalid id`);
        logger.debug(`destroy bucket ${bucketName}`);
      }),
      () =>
        retryCallOnError({
          name: `list object to destroy on bucket ${bucketName}`,
          fn: () => axios.get(`/${bucketName}/o`),
          config: configProvider,
        }),
      get("data.items"),
      tap((items = []) => {
        logger.debug(`destroy objects in bucket: ${items.length}`);
      }),
      tap((items = []) =>
        map.pool(mapPoolSize, (item) =>
          retryCallOnError({
            name: `destroy objects in ${bucketName}`,
            fn: () => axios.delete(item.selfLink),
            config: configProvider,
          })
        )(items)
      ),
      () =>
        retryCallOnError({
          name: `destroy ${bucketName}`,
          fn: () => axios.delete(`/${bucketName}`),
          config: configProvider,
          //TODO may not need that
          isExpectedException: (error) => {
            return [404].includes(error.response?.status);
          },
        }),
      get("data"),
      tap((xx) => {
        logger.debug(`destroy done: ${bucketName}`);
      }),
    ])();

  return {
    ...client,
    getById,
    getByName,
    getList,
    create,
    destroy,
  };
};
