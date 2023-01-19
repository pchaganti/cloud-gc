const assert = require("assert");
const { pipe, tap, get, map } = require("rubico");
const { defaultsDeep, unless, isEmpty } = require("rubico/x");

const { createAwsResource } = require("../AwsClient");
const { Tagger } = require("./ApiGatewayCommon");
const { buildTagsObject, getByNameCore } = require("@grucloud/core/Common");

const findId = () => pipe([get("id")]);

const buildArn =
  ({ config }) =>
  ({ id }) =>
    `arn:aws:apigateway:${config.region}::/usageplans/${id}`;

const pickId = pipe([({ id }) => ({ usagePlanId: id })]);

const model = ({ config }) => ({
  package: "api-gateway",
  client: "APIGateway",
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getUsagePlan-property
  getById: {
    method: "getUsagePlan",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getUsagePlans-property
  getList: {
    method: "getUsagePlans",
    getParam: "items",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createUsagePlan-property
  create: {
    method: "createUsagePlan",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(params);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateUsagePlan-property
  update: {
    method: "updateUsagePlan",
    // TODO build patchOperations
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ usagePlanId: live.id })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteUsagePlan-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap((live) =>
        pipe([
          () => live,
          get("apiStages"),
          map(({ apiId, stage }) => ({
            op: "remove",
            path: "/apiStages",
            value: `${apiId}:${stage}`,
          })),
          unless(
            isEmpty,
            pipe([
              (patchOperations) => ({
                usagePlanId: live.id,
                patchOperations,
              }),
              endpoint().updateUsagePlan,
            ])
          ),
        ])()
      ),
    method: "deleteUsagePlan",
    pickId,
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html
exports.UsagePlan = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("name")]),
    findId,
    getByName: getByNameCore,
    ...Tagger({ buildArn: buildArn({ config }) }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {},
      config,
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
      ])(),
  });
