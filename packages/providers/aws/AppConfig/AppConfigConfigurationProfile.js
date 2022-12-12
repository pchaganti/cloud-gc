const assert = require("assert");
const { pipe, tap, get, assign, map, pick } = require("rubico");
const { defaultsDeep, when, append, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource, assignTags } = require("./AppConfigCommon");

const pickId = pipe([
  ({ Id, ApplicationId }) => ({ ConfigurationProfileId: Id, ApplicationId }),
]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        ({ Id, ApplicationId }) =>
          `arn:aws:appconfig:${
            config.region
          }:${config.accountId()}:application/${ApplicationId}/configurationprofile/${Id}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

const model = ({ config }) => ({
  package: "appconfig",
  client: "AppConfig",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#getConfigurationProfile-property
  getById: {
    method: "getConfigurationProfile",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#createConfigurationProfile-property
  create: {
    method: "createConfigurationProfile",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#updateConfigurationProfile-property
  update: {
    method: "updateConfigurationProfile",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ ConfigurationProfileId: live.Id }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#deleteConfigurationProfile-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      pipe([
        ({ Id, ApplicationId }) => ({
          ConfigurationProfileId: Id,
          ApplicationId,
        }),
        endpoint().listHostedConfigurationVersions,
        get("Items"),
        map(
          pipe([
            pick(["VersionNumber", "ApplicationId", "ConfigurationProfileId"]),
            endpoint().deleteHostedConfigurationVersion,
          ])
        ),
      ]),
    method: "deleteConfigurationProfile",
    pickId,
  },
});

exports.AppConfigConfigurationProfile = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName:
      ({ lives, config }) =>
      (live) =>
        pipe([
          () => live,
          get("ApplicationId"),
          lives.getById({
            type: "Application",
            group: "AppConfig",
            providerName: config.providerName,
          }),
          get("name", live.ApplicationId),
          append(`::${live.Name}`),
        ])(),
    findId: () => pipe([get("Id")]),
    getByName: getByNameCore,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listConfigurationProfiles-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () =>
          client.getListWithParent({
            parent: { type: "Application", group: "AppConfig" },
            pickKey: pipe([({ Id }) => ({ ApplicationId: Id })]),
            method: "listConfigurationProfiles",
            getParam: "Items",
            config,
            decorate,
          }),
      ])(),
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { application, iamRole },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          ApplicationId: getField(application, "Id"),
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
        when(
          () => iamRole,
          assign({ RetrievalRoleArn: getField(iamRole, "Arn") })
        ),
      ])(),
  });
