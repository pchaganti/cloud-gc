const assert = require("assert");
const { map, pipe, tap, get, eq, not, assign, omit, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "ApiMapping",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.ApiMappingId");
const findName = pipe([
  tap((params) => {
    assert(true);
  }),
  get("live"),
  ({ ApiName, DomainName, Stage, ApiMappingKey }) =>
    `apimapping::${DomainName}::${ApiName}::${Stage}::${ApiMappingKey}`,
  tap((params) => {
    assert(true);
  }),
]);
const pickId = pick(["ApiMappingId", "DomainName"]);

exports.ApiMapping = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const apiGateway = () =>
    createEndpoint({ endpointName: "ApiGatewayV2" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Api",
      group: "ApiGatewayV2",
      ids: [live.ApiId],
    },
    {
      type: "DomainName",
      group: "ApiGatewayV2",
      ids: [live.DomainName],
    },
    {
      type: "Stage",
      group: "ApiGatewayV2",
      ids: [live.Stage],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getApiMapping-property
  const getById = client.getById({
    pickId,
    method: "getApiMapping",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getApiMappings-property
  const getList = client.getListWithParent({
    parent: { type: "DomainName", group: "ApiGatewayV2" },
    pickKey: pipe([
      tap((params) => {
        assert(true);
      }),
      pick(["DomainName"]),
    ]),
    method: "getApiMappings",
    getParam: "Items",
    config,
    decorate:
      ({ lives, parent: { DomainName, Tags } }) =>
      (live) =>
        pipe([
          () => live,
          tap((params) => {
            assert(lives);
          }),
          defaultsDeep({ DomainName }),
          assign({
            ApiName: pipe([
              ({ ApiId }) =>
                lives.getById({
                  id: ApiId,
                  providerName: config.providerName,
                  type: "Api",
                  group: "ApiGatewayV2",
                }),
              get("name"),
            ]),
          }),
          assign({
            Tags: pipe([() => Tags, omit(["Name"])]),
          }),
        ])(),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createApiMapping-property
  const create = client.create({
    method: "createApiMapping",
    pickCreated:
      ({ payload }) =>
      (result) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          () => result,
          defaultsDeep({ DomainName: payload.DomainName }),
        ])(),
    pickId,
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateApiMapping-property
  const update = client.update({
    pickId,
    method: "updateApiMapping",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteApiMapping-property
  const destroy = client.destroy({
    pickId,
    method: "deleteApiMapping",
    getById,
    ignoreError: eq(get("code"), "NotFoundException"),
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { api, stage, domainName },
  }) =>
    pipe([
      tap(() => {
        assert(api, "missing 'api' dependency");
        assert(domainName, "missing 'domainName' dependency");
        assert(stage, "missing 'stage' dependency");
      }),
      () => properties,
      defaultsDeep({
        ApiId: getField(api, "ApiId"),
        DomainName: getField(domainName, "DomainName"),
        Stage: getField(stage, "StageName"),
      }),
    ])();

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getByName,
    getById,
    getList,
    configDefault,
    shouldRetryOnException,
    findDependencies,
  };
};