const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  and,
  fork,
  switchCase,
  tryCatch,
} = require("rubico");
const {
  defaultsDeep,
  callProp,
  when,
  find,
  last,
  append,
  includes,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "IntegrationV2",
});
const { throwIfNotAwsError } = require("../AwsCommon");
const { tos } = require("@grucloud/core/tos");

const { createEndpoint } = require("../AwsCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { dependencyIdApi, ignoreErrorCodes } = require("./ApiGatewayV2Common");

const pickId = pick(["ApiId", "IntegrationId"]);
const lambdaUriToName = pipe([
  callProp("split", ":"),
  last,
  callProp("replace", "/invocations", ""),
]);

const listenerUriToName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(config);
      }),
      () => live,
      get("IntegrationUri"),
      lives.getById({
        type: "Listener",
        group: "ElasticLoadBalancingV2",
        providerName: config.providerName,
      }),
      get("name", live.IntegrationUri),
      tap((name) => {
        assert(name);
      }),
    ])();

const eventBusUriToName = pipe([callProp("split", "/"), last]);

const findName = ({ lives, config }) =>
  pipe([
    fork({
      apiName: pipe([({ ApiName }) => `integration::${ApiName}::`]),
      integration: switchCase([
        get("IntegrationUri"),
        pipe([
          switchCase([
            eq(get("ConnectionType"), "VPC_LINK"),
            pipe([listenerUriToName({ lives, config })]),
            pipe([get("IntegrationUri"), lambdaUriToName]),
          ]),
        ]),
        get("RequestParameters.EventBusName"),
        pipe([get("RequestParameters.EventBusName"), eventBusUriToName]),
        () => "NO-INTEGRATION",
      ]),
    }),
    ({ apiName, integration }) => `${apiName}${integration}`,
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#removePermission-property
const lambdaRemovePermission = ({ endpoint, config }) =>
  pipe([
    tap.if(
      and([
        eq(get("IntegrationType"), "AWS_PROXY"),
        get("IntegrationUri"),
        get("IntegrationId"),
      ]),
      pipe([
        ({ IntegrationUri, IntegrationId }) => ({
          FunctionName: IntegrationUri,
          StatementId: IntegrationId,
        }),
        tryCatch(
          createEndpoint("lambda", "Lambda")(config)().removePermission,
          (error) =>
            pipe([
              tap(() => {
                logger.info(`lambdaRemovePermission ${tos(error)}`);
              }),
              () => error,
              throwIfNotAwsError("ResourceNotFoundException"),
            ])()
        ),
      ])
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html
exports.ApiGatewayV2Integration = ({}) => ({
  type: "Integration",
  package: "apigatewayv2",
  client: "ApiGatewayV2",
  inferName: ({
    dependenciesSpec: { api, lambdaFunction, listener, eventBus },
  }) =>
    pipe([
      //TODO other target
      tap(() => {
        assert(api);
      }),
      () =>
        pipe([
          () => `integration::${api}`,
          switchCase([
            () => lambdaFunction,
            append(`::${lambdaFunction}`),
            () => eventBus,
            append(`::${eventBus}`),
            () => listener,
            append(`::${listener}`),
            append(`::NO-INTEGRATION`),
          ]),
        ])(),
    ]),
  findName,
  findId: () =>
    pipe([
      get("IntegrationId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  propertiesDefault: { TimeoutInMillis: 30e3, Description: "" },
  omitProperties: [
    "RouteId",
    "ConnectionId",
    "IntegrationId",
    "IntegrationUri",
    "ApiName",
    "RequestParameters.EventBusName",
    "CredentialsArn",
    "ApiId",
  ],
  dependencies: {
    api: {
      type: "Api",
      group: "ApiGatewayV2",
      parent: true,
      dependencyId: dependencyIdApi,
    },
    listener: {
      type: "Listener",
      group: "ElasticLoadBalancingV2",
      parent: true,
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            lives.getByType({
              type: "Listener",
              group: "ElasticLoadBalancingV2",
              providerName: config.providerName,
            }),
            find(eq(get("id"), live.IntegrationUri)),
          ])(),
    }, //Integration name depends on listener name
    vpcLink: {
      type: "VpcLink",
      group: "ApiGatewayV2",
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            lives.getByType({
              type: "VpcLink",
              group: "ApiGatewayV2",
              providerName: config.providerName,
            }),
            find(eq(get("id"), live.ConnectionId)),
          ])(),
    },
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            lives.getByType({
              type: "Function",
              group: "Lambda",
              providerName: config.providerName,
            }),
            find(pipe([get("id"), (id) => includes(id)(live.IntegrationUri)])),
          ])(),
    },
    eventBus: {
      type: "EventBus",
      group: "CloudWatchEvents",
      dependencyId: ({ lives, config }) =>
        get("RequestParameters.EventBusName"),
    },
    role: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("CredentialsArn"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getIntegration-property
  getById: {
    method: "getIntegration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#listIntegrations-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Api", group: "ApiGatewayV2" },
          pickKey: pipe([pick(["ApiId"])]),
          method: "getIntegrations",
          getParam: "Items",
          config,
          decorate:
            ({ parent: { ApiId, Name, Tags } }) =>
            (live) =>
              pipe([() => live, defaultsDeep({ ApiId, ApiName: Name })])(),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createIntegration-property
  create: {
    method: "createIntegration",
    pickCreated: ({ payload }) =>
      pipe([defaultsDeep({ ApiId: payload.ApiId })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateIntegration-property
  update: {
    method: "updateIntegration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteIntegration-property
  destroy: {
    preDestroy: lambdaRemovePermission,
    method: "deleteIntegration",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { api, lambdaFunction, eventBus, role, listener, vpcLink },
  }) =>
    pipe([
      tap(() => {
        assert(api, "missing 'api' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        ApiId: getField(api, "ApiId"),
      }),
      when(
        () => vpcLink,
        defaultsDeep({
          ConnectionId: getField(vpcLink, "VpcLinkId"),
        })
      ),
      when(
        () => listener,
        defaultsDeep({
          IntegrationUri: getField(listener, "ListenerArn"),
        })
      ),
      when(
        () => lambdaFunction,
        defaultsDeep({
          IntegrationUri: getField(lambdaFunction, "Configuration.FunctionArn"),
        })
      ),
      when(
        () => eventBus,
        defaultsDeep({
          RequestParameters: { EventBusName: getField(eventBus, "Arn") },
        })
      ),
      when(
        () => role,
        defaultsDeep({
          CredentialsArn: getField(role, "Arn"),
        })
      ),
    ])(),
});
