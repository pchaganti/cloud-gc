const assert = require("assert");
const {
  flatMap,
  pipe,
  tap,
  get,
  not,
  eq,
  filter,
  tryCatch,
  switchCase,
  assign,
  map,
  or,
  pick,
} = require("rubico");
const {
  first,
  defaultsDeep,
  isEmpty,
  pluck,
  find,
  identity,
  prepend,
  append,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const logger = require("@grucloud/core/logger")({ prefix: "ELBRule" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { isUpByIdCore, isDownByIdCore } = require("@grucloud/core/Common");
const {
  ELBv2New,
  buildTags,
  findNamespaceInTags,
  shouldRetryOnException,
} = require("../AwsCommon");

const findId = get("live.RuleArn");

const pickId = pick(["RuleArn"]);

const { AwsClient } = require("../AwsClient");

const { ELBListener } = require("./ELBListener");
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html
exports.ELBRule = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const elb = ELBv2New(config);
  const elbListener = ELBListener({ spec, config });
  const { providerName } = config;

  const findName = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(live.ListenerArn);
      }),
      () =>
        lives.getById({
          type: "Listener",
          group: "ELBv2",
          id: live.ListenerArn,
          providerName,
        }),
      tap((listener) => {
        assert(listener);
      }),
      get("name"),
      tap((listenerName) => {
        assert(listenerName);
      }),
      switchCase([
        () => live.IsDefault,
        prepend("rule-default-"),
        prepend("rule::"),
      ]),
      append(`::${live.Priority}`),
    ])();

  const isDefault = get("live.IsDefault");

  const managedByOther = pipe([
    tap((params) => {
      assert(true);
    }),
    or([
      isDefault,
      ({ live, lives }) =>
        pipe([
          tap(() => {
            assert(lives);
            assert(live.ListenerArn);
          }),
          () =>
            lives.getById({
              type: "Listener",
              group: "ELBv2",
              providerName,
              id: live.ListenerArn,
            }),
          tap((listener) => {
            assert(listener);
          }),
          get("live.LoadBalancerArn"),
          tap((LoadBalancerArn) => {
            assert(LoadBalancerArn);
          }),
          (LoadBalancerArn) =>
            lives.getById({
              type: "LoadBalancer",
              group: "ELBv2",
              providerName,
              id: LoadBalancerArn,
            }),
          get("managedByOther"),
        ])(),
    ]),
    tap((params) => {
      assert(true);
    }),
  ]);

  const findDependencies = ({ live }) => [
    { type: "Listener", group: "ELBv2", ids: [live.ListenerArn] },
    {
      type: "TargetGroup",
      group: "ELBv2",
      ids: pipe([() => live, get("Actions"), pluck("TargetGroupArn"), ,])(),
    },
  ];

  const findNamespaceInListener =
    (config) =>
    ({ live, lives }) =>
      pipe([
        () => live,
        get("ListenerArn"),
        (ListenerArn) =>
          lives.getById({
            providerName: config.providerName,
            type: "Listener",
            group: "ELBv2",
            id: ListenerArn,
          }),
        tap((listener) => {
          assert(listener);
        }),
        get("namespace"),
        tap((namespace) => {
          assert(true);
        }),
      ])();

  const findNamespace = ({ live, lives }) =>
    pipe([
      () => findNamespaceInTags(config)({ live }),
      switchCase([
        not(isEmpty),
        identity,
        () => findNamespaceInListener(config)({ live, lives }),
      ]),
      tap((namespace) => {
        logger.debug(`findNamespace rules ${namespace}`);
      }),
    ])();

  const describeAllRules = pipe([
    () => elbListener.getList({}),
    pluck("ListenerArn"),
    flatMap((ListenerArn) =>
      pipe([
        () => elb().describeRules({ ListenerArn }),
        get("Rules"),
        map(assign({ ListenerArn: () => ListenerArn })),
      ])()
    ),
    filter(not(isEmpty)),
    map(
      assign({
        Tags: pipe([
          ({ RuleArn }) => elb().describeTags({ ResourceArns: [RuleArn] }),
          get("TagDescriptions"),
          first,
          get("Tags"),
        ]),
      })
    ),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeRules-property
  const getList = () =>
    pipe([
      tap(() => {
        logger.info(`getList rule`);
      }),
      describeAllRules,
    ])();

  const getByName = ({ name, lives }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      describeAllRules,
      tap((rules) => {
        logger.debug(`getByName rules ${name}, #rules: ${tos(rules)}`);
      }),
      find(eq((live) => findName({ live, lives }), name)),
      tap((result) => {
        logger.debug(`getByName ${name}, result: ${tos(result)}`);
      }),
    ])();

  const getById = client.getById({
    pickId: ({ RuleArn }) => ({ RuleArns: [RuleArn] }),
    method: "describeRules",
    getField: "Rules",
    ignoreErrorCodes: ["RuleNotFound"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createRule-property
  const create = client.create({
    method: "createRule",
    pickId,
    getById,
    config,
    pickCreated: () => pipe([get("Rules"), first]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#deleteRule-property
  const destroy = client.destroy({
    pickId,
    method: "deleteRule",
    ignoreErrorCodes: ["RuleNotFound"],
    getById,
    config,
  });

  const targetGroupProperties = ({ targetGroup }) =>
    switchCase([
      () => targetGroup,
      () => ({
        Actions: [
          {
            Type: "forward",
            TargetGroupArn: getField(targetGroup, "TargetGroupArn"),
            Order: 1,
            ForwardConfig: {
              TargetGroups: [
                {
                  TargetGroupArn: getField(targetGroup, "TargetGroupArn"),
                  Weight: 1,
                },
              ],
              TargetGroupStickinessConfig: {
                Enabled: false,
              },
            },
          },
        ],
      }),
      identity,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createRule-property
  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { listener, targetGroup },
  }) =>
    pipe([
      tap(() => {
        assert(listener);
      }),
      () => ({}),
      defaultsDeep(targetGroupProperties({ targetGroup })),
      defaultsDeep(properties),
      defaultsDeep({
        ListenerArn: getField(listener, "ListenerArn"),
        Tags: buildTags({ name, namespace, config }),
      }),
    ])();

  const cannotBeDeleted = isDefault;

  return {
    spec,
    findId,
    findDependencies,
    findNamespace,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
    isDefault,
    cannotBeDeleted,
    managedByOther,
  };
};
