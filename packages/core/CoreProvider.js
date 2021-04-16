const assert = require("assert");

const {
  pipe,
  tap,
  map,
  flatMap,
  filter,
  tryCatch,
  switchCase,
  get,
  assign,
  any,
  reduce,
  fork,
  eq,
  not,
  and,
  or,
  transform,
  omit,
} = require("rubico");

const {
  first,
  isEmpty,
  isString,
  flatten,
  pluck,
  forEach,
  find,
  defaultsDeep,
  isDeepEqual,
  includes,
  isFunction,
} = require("rubico/x");

const logger = require("./logger")({ prefix: "CoreProvider" });
const { tos } = require("./tos");
const { checkConfig, checkEnv } = require("./Utils");
const { SpecDefault } = require("./SpecDefault");
const { retryCall } = require("./Retry");
const {
  mapPoolSize,
  convertError,
  HookType,
  TitleListing,
  TitleQuery,
  TitleDeploying,
  TitleDestroying,
  typeFromResources,
  planToResourcesPerType,
} = require("./Common");
const { Lister } = require("./Lister");
const { Planner, mapToGraph } = require("./Planner");
const {
  nextStateOnError,
  hasResultError,
  PlanDirection,
  isTypesMatch,
  isTypeMatch,
  isValidPlan,
  filterReadClient,
  filterReadWriteClient,
  contextFromClient,
  contextFromProvider,
  contextFromProviderInit,
  contextFromResourceType,
  contextFromPlanner,
  contextFromResource,
  contextFromHook,
  contextFromHookAction,
  liveToUri,
  providerRunning,
} = require("./ProviderCommon");

const configProviderDefault = {
  tag: "ManagedByGru",
  managedByKey: "ManagedBy",
  managedByValue: "GruCloud",
  managedByDescription: "Managed By GruCloud",
  createdByProviderKey: "CreatedByProvider",
  stageTagKey: "stage",
  stage: "dev",
  retryCount: 30,
  retryDelay: 10e3,
};

const identity = (x) => x;

const createClient = ({ spec, providerName, config, mapTypeToResources }) =>
  pipe([
    () => spec.Client({ providerName, spec, config, mapTypeToResources }),
    tap((client) => {
      assert(providerName);
      assert(client.spec);
      assert(client.findName);
      //assert(client.getByName);
    }),
    defaultsDeep({
      resourceKey: pipe([
        tap((resource) => {
          assert(resource.providerName);
          assert(resource.type);
          assert(
            resource.name || resource.id,
            `no name or id in resource ${tos(resource)}`
          );
        }),
        ({ providerName, type, name, id }) =>
          `${providerName}::${type}::${name || JSON.stringify(id)}`,
      ]),
      displayName: get("name"),
      displayNameResource: get("name"),
      findMeta: () => undefined,
      cannotBeDeleted: () => false,
      configDefault: () => ({}),
      isInstanceUp: not(isEmpty),
      providerName,
    }),
  ])();

const ResourceMaker = ({
  name: resourceName,
  meta = {},
  dependencies = {},
  filterLives,
  properties = () => ({}),
  attributes = () => ({}),
  spec,
  provider,
  config,
}) => {
  const { type } = spec;
  assert(resourceName, `missing 'name' property for type: ${type}`);
  logger.debug(`ResourceMaker: ${tos({ type, resourceName, meta })}`);

  const client = createClient({
    providerName: provider.name,
    provider,
    spec,
    config,
  });
  const usedBySet = new Set();

  const getLive = async ({ deep = true, lives } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getLive ${toString()}, deep: ${deep}`);
      }),
      () =>
        client.getByName({
          provider,
          meta,
          name: resourceName,
          dependencies,
          resolveConfig,
          deep,
          resources: provider.getResourcesByType({ type }),
          properties,
          lives,
        }),
      tap((live) => {
        logger.info(`getLive ${toString()} hasLive: ${!!live}`);
        logger.debug(`getLive ${toString()} live: ${tos(live)}`);
      }),
    ])();

  const findLive = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
      }),
      () => lives.getByType({ providerName: provider.name, type }),
      switchCase([
        not(isEmpty),
        pipe([
          tap((xxx) => {
            logger.debug(`findLive`);
          }),
          tap(({ type, resources }) => {
            assert(type);
            //assert(resources);
          }),
          ({ type, resources = [] }) =>
            pipe([
              () => resources,
              find(({ live }) =>
                pipe([
                  () => provider.clientByType({ type }).findName(live),
                  tap((liveName) => {
                    logger.debug(
                      `findLive ${JSON.stringify({ type, liveName })}`
                    );
                  }),
                  (liveName) => isDeepEqual(resourceName, liveName),
                ])()
              ),
            ])(),
        ]),
        (result) => {
          logger.error(`findLive cannot find type ${type}`);
        },
      ]),
      get("live"),
      tap((live) => {
        logger.debug(
          `findLive ${tos({ type, resourceName, hasLive: !!live })}`
        );
      }),
    ])();

  const planUpdate = async ({ resource, target, live, lives }) => {
    logger.debug(
      `planUpdate resource: ${tos(resource.toJSON())}, target: ${tos(
        target
      )}, live: ${tos(live)}`
    );

    if (isEmpty(target)) {
      //TODO do we need this ?
      return;
    }
    const diff = await spec.compare({
      usedBySet,
      target,
      live,
      dependencies: resource.dependencies,
      lives,
    });
    logger.info(`planUpdate diff ${tos(diff)}`);
    // TODO unify
    if (
      diff.needUpdate ||
      !isEmpty(diff.added) ||
      !isEmpty(diff.updated) ||
      !isEmpty(diff.deleted)
    ) {
      return [
        {
          action: "UPDATE",
          resource: resource.toJSON(),
          target: target,
          live,
          diff,
          providerName: resource.toJSON().providerName,
        },
      ];
    }
  };
  const getDependencyList = () =>
    pipe([
      filter(not(isString)),
      transform(
        map((dep) => dep),
        () => []
      ),
      tap((result) => {
        logger.info(`getDependencyList `);
      }),
      tap(
        forEach((dep) => {
          assert(dep, "dep");
          assert(dep.type, "dep.type");
        })
      ),
    ])(dependencies);

  const resolveDependencies = ({
    lives,
    dependencies,
    dependenciesMustBeUp = false,
  }) =>
    pipe([
      tap(() => {
        logger.info(
          `resolveDependencies for ${toString()}: ${Object.keys(
            dependencies
          )}, dependenciesMustBeUp: ${dependenciesMustBeUp}`
        );
        if (!lives) {
          assert(true);
        }
      }),
      map(async (dependency) => {
        if (isString(dependency)) {
          return dependency;
        }
        //TODO isArray
        if (!dependency.getLive) {
          return tryCatch(
            () =>
              resolveDependencies({
                lives,
                dependencies: dependency,
                dependenciesMustBeUp,
              }),
            (error) => {
              logger.error(
                `resolveDependencies: ${toString()}, dep ${dependency.toString()}, error: ${tos(
                  error
                )}`
              );
              return {
                error,
              };
            }
          )();
        }
        return tryCatch(
          (dependency) =>
            pipe([
              tap((live) => {
                logger.debug(
                  `resolveDependencies ${toString()}, dep ${dependency.toString()}, has live: ${isEmpty(
                    lives
                  )}`
                );
              }),
              switchCase([
                () => dependency.filterLives,
                () => dependency.resolveConfig(),
                switchCase([
                  () => isEmpty(lives),
                  () => dependency.getLive({ deep: true }),
                  () => dependency.findLive({ lives }),
                ]),
              ]),
              tap.if(
                (live) => {
                  if (dependenciesMustBeUp) {
                    if (!dependency.isUp({ live })) {
                      return true;
                    }
                    return false;
                  }
                },
                () => {
                  throw {
                    message: `${toString()} dependency ${dependency.toString()} is not up`,
                  };
                }
              ),
              async (live) => ({
                resource: dependency,
                config: await dependency.resolveConfig({
                  deep: true,
                  live,
                  lives,
                }),
                live,
              }),
            ])(),
          (error, dependency) => {
            logger.error(`resolveDependencies: ${tos(error)}`);
            return {
              item: { resource: dependency.toString() },
              error,
            };
          }
        )(dependency);
      }),
      tap((result) => {
        /*logger.debug(
          `resolveDependencies for ${toString()}, result: ${tos(result)}`
        );*/
      }),
      tap.if(any(get("error")), (resolvedDependencies) => {
        logger.error(
          `resolveDependencies ${toString()} error in resolveDependencies`
        );
        const results = filter(get("error"))(resolvedDependencies);

        throw {
          message: pipe([
            pluck("error"),
            reduce((acc, value) => [...acc, value.message], []),
            (messages) => messages.join("\n"),
            tap((message) => {
              logger.debug(
                `resolveDependencies ${toString()}, error message: ${message}`
              );
            }),
          ])(results),
          errorClass: "Dependency",
          results,
        };
      }),
      tap((result) => {
        /*logger.debug(
          `resolveDependencies for ${toString()}, result: ${tos(result)}`
        );*/
      }),
    ])(dependencies);

  const resolveConfig = async ({
    live,
    lives,
    resolvedDependencies,
    deep = false,
  } = {}) =>
    pipe([
      tap(() => {
        logger.debug(
          `resolveConfig ${toString()}, ${tos({
            deep,
            hasLive: !!live, //TODO
          })}`
        );
        if (!live) {
          assert(true);
        }
        assert(client.configDefault);
        assert(spec.propertiesDefault);
      }),
      switchCase([
        () => !deep,
        () => ({}),
        () => !isEmpty(resolvedDependencies),
        () => resolvedDependencies,
        () =>
          resolveDependencies({
            resourceName,
            dependencies,
            lives,
          }),
      ]),
      async (resolvedDependencies) => {
        const config = await client.configDefault({
          name: resourceName,
          meta,
          properties: defaultsDeep(spec.propertiesDefault)(
            await properties({ dependencies: resolvedDependencies })
          ),
          dependencies: resolvedDependencies,
          live,
        });
        // TODO out of resolveConfig
        const finalConfig = await switchCase([
          () => filterLives,
          pipe([
            () =>
              client.getList({
                //TODO use client.key()
                resources: provider.getResourcesByType({
                  type: client.spec.type,
                }),
                lives,
              }),
            ({ items }) =>
              filterLives({
                dependencies: resolvedDependencies,
                items,
                config,
                configProvider: provider.config,
                live,
                lives,
              }),
          ]),
          () => config,
        ])();

        return finalConfig;
      },
    ])();

  const create = async ({ payload, resolvedDependencies, lives }) =>
    pipe([
      tap(() => {
        logger.info(`create ${tos({ resourceName, type })}`);
        logger.debug(`create ${tos({ payload })}`);
        assert(payload);
        assert(resolvedDependencies);
        assert(lives);
      }),
      //TODO
      /*tap.if(
        () => getLive({ deep: false }),
        () => {
          throw Error(`Resource ${toString()} already exists`);
        }
      ),*/
      () =>
        client.create({
          meta,
          name: resourceName,
          payload,
          dependencies,
          attributes,
          resolvedDependencies,
        }),
      () => getLive({ deep: true, lives }),
      tap((live) => {
        logger.info(`created: ${toString()}`);
        logger.debug(`created: live: ${tos(live)}`);
      }),
    ])();

  const update = async ({
    payload,
    diff,
    live,
    lives,
    resolvedDependencies,
  }) => {
    logger.info(`update ${tos({ resourceName, type, payload })}`);
    if (!(await getLive())) {
      throw Error(`Resource ${toString()} does not exist`);
    }

    // Update now
    const instance = await retryCall({
      name: `update ${toString()}`,
      fn: () =>
        client.update({
          name: resourceName,
          payload,
          dependencies,
          resolvedDependencies,
          diff,
          live,
          lives,
          id: client.findId(live),
        }),
      shouldRetryOnException: client.shouldRetryOnException,
      config: provider.config,
    });

    logger.info(`updated: ${toString()}`);
    return instance;
  };

  const planUpsert = async ({ resource, lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`planUpsert resource: ${resource.toString()}`);
      }),
      assign({
        live: () => resource.findLive({ lives }),
      }),
      tap(({ live }) => {}),
      assign({
        target: pipe([
          ({ live }) => resource.resolveConfig({ live, lives, deep: true }),
        ]),
      }),
      tap(({ live, target }) => {
        logger.info(`planUpsert resource: ${resource.toString()}`);
      }),
      switchCase([
        pipe([get("live"), isEmpty]),
        ({ target, live }) => [
          {
            action: "CREATE",
            resource: resource.toJSON(),
            target,
            live,
            providerName: resource.toJSON().providerName,
          },
        ],
        ({ live, target }) => planUpdate({ live, target, resource, lives }),
      ]),
    ])({});

  const toString = () =>
    client.resourceKey({
      providerName: provider.name,
      type,
      name: resourceName,
      meta,
      dependencies,
    });

  const toJSON = () => ({
    providerName: provider.name,
    type,
    name: resourceName,
    meta,
    displayName: client.displayNameResource({
      name: resourceName,
      meta,
      dependencies,
    }),
    uri: toString(),
  });

  const addUsedBy = (usedBy) => {
    usedBySet.add(usedBy);
  };

  const resourceMaker = {
    type,
    provider,
    name: resourceName,
    meta,
    dependencies,
    addUsedBy,
    usedBy: () => usedBySet,
    spec,
    client,
    toJSON,
    toString,
    attributes,
    resolveConfig,
    create,
    update,
    planUpsert,
    filterLives,
    getLive: filterLives ? resolveConfig : getLive,
    findLive,
    getDependencyList,
    resolveDependencies: ({ lives, dependenciesMustBeUp }) =>
      resolveDependencies({
        resourceName,
        dependencies,
        lives,
        dependenciesMustBeUp,
      }),
    isUp: ({ live }) =>
      pipe([
        tap(() => {
          assert(client.isInstanceUp);
        }),
        () => client.isInstanceUp(live),
        tap((isUp) => {
          logger.debug(`isUp ${type}/${resourceName}: ${!!isUp}`);
        }),
      ])(),
  };
  forEach((dependency) => {
    if (isString(dependency)) {
      return;
    }
    if (!dependency) {
      throw {
        code: 422,
        message: `missing dependency for ${type}/${resourceName}`,
      };
    }
    if (!dependency.addUsedBy) {
      forEach((item) => {
        if (item.addUsedBy) {
          item.addUsedBy(resourceMaker);
        }
      })(dependency);
    } else {
      dependency.addUsedBy(resourceMaker);
    }
  })(dependencies);
  return resourceMaker;
};

const createResourceMakers = ({ specs, config: configProvider, provider }) =>
  pipe([
    () => specs,
    filter(not(get("listOnly"))),
    reduce((acc, spec) => {
      assert(spec.type);
      acc[`make${spec.type}`] = async ({
        name,
        meta = {},
        config: configUser = {},
        dependencies,
        properties,
        attributes,
        filterLives,
      }) => {
        const config = defaultsDeep(configProvider)(configUser);
        const resource = ResourceMaker({
          meta,
          name,
          filterLives,
          properties,
          attributes,
          dependencies,
          spec: defaultsDeep(SpecDefault({ config }))(spec),
          provider,
          config,
        });
        provider.targetResourcesAdd(resource);

        //TODO move it somewhere else to remove async.

        if (resource.client.validate) {
          await resource.client.validate({ name });
        }

        return resource;
      };
      return acc;
    }, {}),
  ])();

const createResourceMakersListOnly = ({
  specs,
  config: configProvider,
  provider,
}) =>
  pipe([
    () => specs,
    reduce((acc, spec) => {
      assert(spec.type);
      acc[`use${spec.type}`] = async ({
        name,
        meta = {},
        config: configUser = {},
        dependencies,
        properties,
        attributes,
        filterLives,
      }) => {
        const config = defaultsDeep(configProvider)(configUser);
        const resource = ResourceMaker({
          meta,
          name,
          filterLives,
          properties,
          attributes,
          dependencies,
          spec: pipe([
            () => ({ listOnly: true }),
            defaultsDeep(SpecDefault({ config })),
            defaultsDeep(spec),
          ])(),
          provider,
          config,
        });
        provider.targetResourcesAdd(resource);

        return resource;
      };
      return acc;
    }, {}),
  ])();
function CoreProvider({
  name: providerName,
  dependencies = {},
  type,
  mandatoryEnvs = [],
  mandatoryConfigKeys = [],
  fnSpecs,
  config,
  info = () => ({}),
  init = () => {},
  unInit = () => {},
  start = () => {},
}) {
  const providerConfig = pipe([
    defaultsDeep({ providerName }),
    defaultsDeep(configProviderDefault),
  ])(config);
  logger.debug(
    `CoreProvider name: ${providerName}, type ${type}, config: ${tos(
      providerConfig
    )}`
  );

  const hookMap = new Map();

  const hookAdd = ({ name, hookInstance }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(hookInstance);
        logger.info(`hookAdd ${name}`);
      }),
      () => hookInstance,
      defaultsDeep({
        name,
        onDeployed: {
          init: () => {},
          actions: [],
        },
        onDestroyed: {
          init: () => {},
          actions: [],
        },
      }),
      tap.if(
        () => hookMap.has(name),
        () => {
          logger.error(`hook ${name} already added`);
        }
      ),
      (newHook) => hookMap.set(name, newHook),
    ])();

  // Target Resources
  const mapNameToResource = new Map();
  const getMapNameToResource = () => mapNameToResource;

  const mapTypeToResources = new Map();

  const getTargetTypes = () => [...mapTypeToResources.keys()];

  const targetResourcesAdd = (resource) => {
    assert(resource.name);
    assert(resource.type);
    assert(resource.spec.providerName);

    const resourceKey = resource.toString();
    if (mapNameToResource.has(resourceKey) && !resource.spec.listOnly) {
      throw {
        code: 400,
        message: `resource '${resourceKey}' already exists`,
      };
    }
    mapNameToResource.set(resourceKey, resource);

    mapTypeToResources.set(resource.type, [
      ...getResourcesByType({ type: resource.type }),
      resource,
    ]);

    tap.if(get("hook"), (client) =>
      hookAdd({
        name: client.spec.type,
        hookInstance: client.hook({ resource }),
      })
    )(resource.client);
  };

  const getTargetResources = () => [...mapNameToResource.values()];
  const resourceNames = () => pluck(["name"])([...mapNameToResource.values()]);

  const getResource = pipe([
    get("uri"),
    tap((uri) => {
      assert(uri, "getResource no uri");
    }),
    (uri) => mapNameToResource.get(uri),
  ]);

  const specs = fnSpecs(providerConfig).map((spec) =>
    defaultsDeep(SpecDefault({ config: providerConfig, providerName }))(spec)
  );
  const getSpecs = () => specs;

  const clients = specs.map((spec) =>
    createClient({
      mapTypeToResources,
      spec,
      config: providerConfig,
      providerName,
    })
  );

  const getClients = () => clients;

  const clientByType = ({ type }) => find(eq(get("spec.type"), type))(clients);

  const listTargets = () =>
    pipe([
      map(async (resource) => ({
        ...resource.toJSON(),
        data: await resource.getLive(),
      })),
      filter((x) => x.data),
      tap((list) => {
        logger.debug(`listTargets ${tos(list)}`);
      }),
    ])(getTargetResources());

  const listConfig = () =>
    pipe([
      map(async (resource) => ({
        resource: resource.toJSON(),
      })),
      tap((list) => {
        logger.debug(`listConfig ${tos(list)}`);
      }),
    ])(getTargetResources());

  const runScriptCommands = ({ onStateChange, hookType, hookName }) =>
    pipe([
      tap((x) => {
        assert(hookType, "hookType");
        assert(hookName, "hookName");
        logger.info(
          `runScriptCommands hookName: ${hookName}, type: ${hookType}`
        );
      }),
      tap((x) =>
        onStateChange({
          context: contextFromHook({ providerName, hookName, hookType }),
          nextState: "RUNNING",
        })
      ),
      tryCatch(
        pipe([
          assign({ payload: (script) => script.init() }),
          ({ actions, payload }) =>
            map.pool(
              mapPoolSize,
              tryCatch(
                pipe([
                  tap((action) => {
                    onStateChange({
                      context: contextFromHookAction({
                        providerName,
                        hookType,
                        hookName,
                        name: action.name,
                      }),
                      nextState: "RUNNING",
                    });
                  }),
                  tap(async (action) => {
                    if (action.command) {
                      await action.command(payload);
                    } else {
                      throw `${action} does not have a command function`;
                    }
                  }),
                  tap((action) => {
                    onStateChange({
                      context: contextFromHookAction({
                        providerName,
                        hookType,
                        hookName,
                        name: action.name,
                      }),
                      nextState: "DONE",
                    });
                  }),
                ]),
                (error, action) => {
                  logger.error(
                    `runScriptCommands ${hookType}, error for ${action.name}`
                  );
                  logger.error(tos(error));
                  error.stack && logger.error(error.stack);

                  onStateChange({
                    context: contextFromHookAction({
                      providerName,
                      hookType,
                      hookName,
                      name: action.name,
                    }),
                    nextState: "ERROR",
                    error: convertError({ error }),
                  });

                  return {
                    error,
                    action: action.name,
                    hookType,
                    hookName,
                    providerName,
                  };
                }
              )
            )(actions),
          tap((xx) => {
            logger.debug(
              `runScriptCommands ${tos({ hookName, hookType })} ${tos(xx)}`
            );
          }),
          (results) =>
            assign({
              error: ({ results }) => any(({ error }) => error)(results),
            })({
              results,
            }),
          tap((xx) => {
            logger.debug(
              `runScriptCommands ${tos({ hookName, hookType })} ${tos(xx)}`
            );
          }),
          tap(({ error }) =>
            onStateChange({
              context: contextFromHook({ providerName, hookName, hookType }),
              nextState: nextStateOnError(error),
            })
          ),
          tap((xx) => {
            logger.info(`runScriptCommands DONE ${tos(xx)}`);
          }),
        ]),
        (error, script) => {
          logger.debug(
            `runScriptCommands error: ${hookName}, type: ${hookType}, script ${tos(
              script
            )}`
          );
          onStateChange({
            context: contextFromHook({ providerName, hookName, hookType }),
            nextState: "ERROR",
            error: error,
          });
          return {
            results: [{ error, hookType, hookName, providerName, script }],
            error: true,
          };
        }
      ),
    ]);
  const runHook = ({ onStateChange, hookType, onHook, skip }) =>
    switchCase([
      () => !skip,
      () =>
        pipe([
          tap((hooks) => {
            logger.info(
              `runHook hookType: ${hookType}, #hooks ${hooks.length}`
            );
            assert(onStateChange);
            assert(hookType);
            assert(onHook);
          }),
          map((hook) =>
            pipe([
              tap(() => {
                assert(hook.name, "name");
                assert(hook[onHook], `hook[onHook]: ${onHook}`);
                logger.info(`runHook start ${hook.name}`);
              }),
              () => hook[onHook],
              runScriptCommands({
                onStateChange,
                hookType,
                hookName: hook.name,
              }),
              tap((obj) => {
                logger.info(`runHook ${hookType} stop`);
              }),
            ])()
          ),
          (results) => ({ error: any(get("error"))(results), results }),
          tap((result) => {
            logger.info(`runHook DONE`);
          }),
        ])([...hookMap.values()]),
      () => {
        logger.debug(`runHook skipped`);
      },
    ])();

  const runOnDeployed = ({ onStateChange, skip }) =>
    runHook({
      onStateChange,
      skip,
      onHook: "onDeployed",
      hookType: HookType.ON_DEPLOYED,
    });

  const runOnDestroyed = ({ onStateChange, skip }) =>
    runHook({
      onStateChange,
      skip,
      onHook: "onDestroyed",
      hookType: HookType.ON_DESTROYED,
    });

  const setHookWaitingState = ({ onStateChange, hookType, hookName }) =>
    pipe([
      tap(({ actions }) => {
        logger.debug(
          `setHookWaitingState ${hookName}::${hookType}, #actions ${actions.length}`
        );
        assert(hookName, "hookName");
        assert(hookType, "hookType");
      }),
      tap(() => {
        onStateChange({
          context: contextFromHook({ providerName, hookType, hookName }),
          nextState: "WAITING",
          indent: 2,
        });
      }),
      ({ actions }) =>
        map((action) =>
          onStateChange({
            context: contextFromHookAction({
              providerName,
              hookType,
              hookName,
              name: action.name,
            }),
            nextState: "WAITING",
            indent: 4,
          })
        )(actions),
    ]);

  const spinnersStartProvider = ({ onStateChange }) =>
    tap(
      pipe([
        () =>
          onStateChange({
            context: contextFromProvider({ providerName }),
            nextState: "WAITING",
          }),
        () =>
          onStateChange({
            context: contextFromProviderInit({ providerName }),
            nextState: "WAITING",
            indent: 2,
          }),
      ])
    );

  const spinnersStopProvider = ({ onStateChange, error }) =>
    tap(() =>
      onStateChange({
        context: contextFromProvider({ providerName }),
        nextState: nextStateOnError(error),
        error,
      })
    )();

  const spinnersStartResources = ({ onStateChange, title, resourcesPerType }) =>
    tap(
      pipe([
        tap(() => {
          assert(title, "title");
          assert(resourcesPerType, "resourcesPerType");
          assert(
            Array.isArray(resourcesPerType),
            "resourcesPerType must be an array"
          );
          logger.info(
            `spinnersStartResources ${title}, #resourcesPerType ${resourcesPerType.length}`
          );
          logger.debug(
            `spinnersStartResources ${title}, ${tos(resourcesPerType)}`
          );
        }),
        () =>
          onStateChange({
            context: contextFromPlanner({
              providerName,
              title,
              total: resourcesPerType.length,
            }),
            nextState: "WAITING",
            indent: 2,
          }),
        () =>
          onStateChange({
            context: contextFromPlanner({ providerName, title }),
            nextState: "RUNNING",
          }),
        () =>
          pipe([
            map((resourcesPerType) =>
              onStateChange({
                context: contextFromResourceType({
                  operation: title,
                  resourcesPerType,
                }),
                nextState: "WAITING",
                indent: 4,
              })
            ),
          ])(resourcesPerType),
      ])
    );
  const spinnersStartClient = ({ onStateChange, title, clients }) =>
    tap(
      pipe([
        tap(() => {
          assert(title, "title");
          assert(Array.isArray(clients), "clients must be an array");
          logger.info(
            `spinnersStartClient ${title}, #client ${clients.length}`
          );
        }),
        tap(() =>
          onStateChange({
            context: contextFromPlanner({
              providerName,
              title,
              total: clients.length,
            }),
            nextState: "WAITING",
            indent: 2,
          })
        ),
        () =>
          pipe([
            map((client) =>
              onStateChange({
                context: contextFromClient({ client, title }),
                nextState: "WAITING",
                indent: 4,
              })
            ),
          ])(clients),
      ])
    );
  const spinnersStopClient = ({ onStateChange, title, clients, error }) =>
    tap(
      pipe([
        tap(() => {
          assert(title, "title");
          assert(Array.isArray(clients), "clients must be an array");
          logger.info(
            `spinnersStopClient ${title}, #clients ${clients.length}`
          );
        }),
        tap(() =>
          onStateChange({
            context: contextFromPlanner({ providerName, title }),
            nextState: nextStateOnError(error),
          })
        ),
      ])
    );
  const spinnersStartHooks = ({ onStateChange, hookType }) =>
    pipe([
      () => [...hookMap.values()],
      tap((hooks) => {
        logger.info(`spinnersStart #hooks ${hooks.length}`);
      }),
      tap(
        map(({ name, onDeployed, onDestroyed }) =>
          pipe([
            tap(() => {
              logger.debug(`spinnersStart hook`);
            }),
            switchCase([
              () => hookType === HookType.ON_DEPLOYED,
              () => onDeployed,
              () => hookType === HookType.ON_DESTROYED,
              () => onDestroyed,
              () => assert(`Invalid hook type '${hookType}'`),
            ]),
            setHookWaitingState({ onStateChange, hookType, hookName: name }),
          ])()
        )
      ),
    ]);

  const spinnersStartQuery = ({ onStateChange, options }) =>
    pipe([
      () => [...mapTypeToResources.values()],
      tap((resourcesPerType) => {
        logger.debug("spinnersStartQuery");
      }),
      filter(pipe([first, not(get("spec.listOnly"))])),
      map((resources) => ({
        provider: providerName,
        type: typeFromResources(resources),
        resources: map((resource) => ({
          type: resource.type,
          name: resource.name,
        }))(resources),
      })),
      spinnersStartProvider({ onStateChange }),
      spinnersStartClient({
        onStateChange,
        title: TitleListing,
        clients: filterReadClient({ options, targetTypes: getTargetTypes() })(
          clients
        ),
      }),
      (resourcesPerType) =>
        spinnersStartResources({
          onStateChange,
          title: TitleQuery,
          resourcesPerType,
        })(),
    ])();

  const spinnersStartListLives = ({ onStateChange, options }) =>
    tap(
      pipe([
        tap(() => {
          logger.debug(`spinnersStartListLives ${options.types}`);
        }),
        spinnersStartProvider({ onStateChange }),
        spinnersStartClient({
          onStateChange,
          planQueryDestroy,
          title: TitleListing,
          clients: filterReadClient({ options, targetTypes: getTargetTypes() })(
            clients
          ),
        }),
      ])
    )();

  const spinnersStopListLives = ({ onStateChange, options, error }) =>
    tap(
      pipe([
        tap(() => {
          logger.debug("spinnersStopListLives");
        }),
        spinnersStopClient({
          onStateChange,
          title: TitleListing,
          clients: filterReadClient({ options, targetTypes: getTargetTypes() })(
            clients
          ),
          error,
        }),
        //TODO
        //() => spinnersStopProvider({ onStateChange, error }),
      ])
    )();

  const spinnersStartDeploy = ({ onStateChange, plan }) =>
    tap(
      pipe([
        tap(() => {
          logger.debug("spinnersStartDeploy");
          assert(plan);
        }),
        spinnersStartProvider({ onStateChange }),
        tap(
          switchCase([
            () => isValidPlan(plan.resultCreate),
            pipe([
              tap(() => {
                assert(Array.isArray(plan.resultCreate));
              }),
              spinnersStartResources({
                onStateChange,
                title: TitleDeploying,
                resourcesPerType: planToResourcesPerType({
                  providerName,
                  plans: plan.resultCreate,
                }),
              }),
            ]),
            () => {
              logger.debug("no newOrUpdate ");
            },
          ])
        ),
        tap(
          switchCase([
            () => isValidPlan(plan.resultDestroy),
            pipe([
              spinnersStartResources({
                onStateChange,
                title: TitleDestroying,
                resourcesPerType: planToResourcesPerType({
                  providerName,
                  plans: plan.resultDestroy,
                }),
              }),
            ]),
            () => {
              logger.debug("no destroy ");
            },
          ])
        ),
        spinnersStartHooks({
          onStateChange,
          hookType: HookType.ON_DEPLOYED,
        }),
      ])
    )();

  const spinnersStartDestroyQuery = ({ onStateChange, options }) =>
    pipe([
      tap(() => {
        logger.debug(`spinnersStartDestroyQuery #clients: ${clients.length}`);
      }),
      spinnersStartProvider({ onStateChange }),
      spinnersStartClient({
        onStateChange,
        title: TitleListing,
        clients: filterReadWriteClient({
          options,
          targetTypes: getTargetTypes(),
        })(clients),
      }),
    ])();

  const spinnersStartDestroy = ({ onStateChange, plans }) => {
    assert(plans, "plans");
    assert(Array.isArray(plans), "plans !isArray");

    const resources = pipe([filter(({ error }) => !error), pluck("resource")])(
      plans
    );

    logger.debug(`spinnersStartDestroy #resources: ${resources.length}`);
    return pipe([
      spinnersStartProvider({ onStateChange }),
      spinnersStartResources({
        onStateChange,
        title: TitleDestroying,
        resourcesPerType: planToResourcesPerType({
          providerName,
          plans,
        }),
      }),
      spinnersStartHooks({
        onStateChange,
        hookType: HookType.ON_DESTROYED,
      }),
    ])();
  };

  const spinnersStartHook = ({ onStateChange, hookType }) =>
    pipe([
      tap(() => {
        logger.debug(`spinnersStartHook hookType: ${hookType}`);
        assert(hookType);
      }),
      spinnersStartProvider({ onStateChange }),
      spinnersStartHooks({
        onStateChange,
        hookType,
      }),
    ])();

  checkEnv(mandatoryEnvs);
  checkConfig(config, mandatoryConfigKeys);

  const toType = () => type || providerName;

  const register = ({ resources, hooks = [] }) =>
    pipe([
      () => hooks,
      tap(() => {
        logger.debug(`register #hooks ${hooks.length}`);
      }),
      map((hook) =>
        pipe([
          tap(() => {
            assert(isFunction(hook), "hook must be a function.");
          }),
          () =>
            hook({
              resources,
              config: providerConfig,
              provider,
            }),
          tap((hookInstance) => {
            assert(
              !isFunction(hookInstance),
              "hook instance must be not a function."
            );
          }),
          (hookInstance) =>
            pipe([
              () => hookInstance,
              get("name", "default"),
              tap((name) => {
                logger.debug(`register hook ${name}`);
              }),
              (name) => hookAdd({ name, hookInstance }),
            ])(),
          tap(() => {
            logger.debug(`register done`);
          }),
        ])()
      ),
      tap(() => {
        logger.debug(`register done`);
      }),
    ])();

  /*(hookInstance) =>
            pipe([
              tap(() => {
               
              }),

              () => hookInstance,
              get("name", "default"),
              tap((name) => {
                logger.debug(`register hook ${name}`);
              }),
              (name) => hookAdd({ name, hookInstance }),
            ])(),*/
  const getResourcesByType = ({ type }) => mapTypeToResources.get(type) || [];

  const startBase = ({ onStateChange = identity } = {}) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(onStateChange);
          logger.debug(`start`);
        }),
        tap(() =>
          onStateChange({
            context: contextFromProviderInit({ providerName }),
            nextState: "RUNNING",
          })
        ),
        () => start(),
        tap(() =>
          onStateChange({
            context: contextFromProviderInit({ providerName }),
            nextState: "DONE",
          })
        ),
        tap(() => {
          logger.debug(`start done`);
        }),
      ]),
      (error) => {
        logger.error(`start error ${tos(convertError({ error }))}`);
        onStateChange({
          context: contextFromProviderInit({ providerName }),
          nextState: "ERROR",
          error: convertError({ error }),
        });
        onStateChange({
          context: contextFromProvider({ providerName }),
          nextState: "ERROR",
        });
        throw error;
      }
    )();

  const filterClient = async ({
    result,
    client,
    options: { our, name, id, canBeDeleted, provider: providerNames },
    lives,
  }) =>
    switchCase([
      get("error"),
      () => result,
      pipe([
        tap((result) => {
          logger.info(
            `filterClient ${JSON.stringify({
              our,
              name,
              id,
              canBeDeleted,
              providerName,
              type: client.spec.type,
            })}`
          );
        }),
        get("items"),
        filter(not(get("error"))),
        map((live) => ({
          uri: liveToUri({ client, live }),
          name: client.findName(live),
          displayName: client.displayName({
            name: client.findName(live),
            meta: client.findMeta(live),
          }),
          meta: client.findMeta(live),
          id: client.findId(live),
          managedByUs: client.spec.isOurMinion({
            resource: live,
            lives,
            //TODO remove resourceNames
            resourceNames: resourceNames(),
            resources: getResourcesByType({ type: client.spec.type }),
            config: providerConfig,
          }),
          providerName: client.spec.providerName,
          type: client.spec.type,
          live,
          cannotBeDeleted: client.cannotBeDeleted({
            resource: live,
            name: client.findName(live),
            //TODO remove resourceNames
            resourceNames: resourceNames(),
            resources: getResourcesByType({ type: client.spec.type }),
            config: providerConfig,
          }),
        })),
        filter((item) => (our ? item.managedByUs : true)),
        filter((item) => (name ? item.name === name : true)),
        filter((item) => (id ? item.id === id : true)),
        filter((item) =>
          providerName && !isEmpty(providerNames)
            ? includes(item.providerName)(providerNames)
            : true
        ),
        filter((item) => (canBeDeleted ? !item.cannotBeDeleted : true)),
        (resources) => ({
          type: client.spec.type,
          resources,
          providerName: client.providerName,
        }),
        tap((xxx) => {
          assert(xxx);
        }),
      ]),
    ])(result);

  const listLives = async ({
    onStateChange = identity,
    options = {},
    title = TitleListing,
    readWrite = false,
    lives,
  } = {}) =>
    pipe([
      () => getClients(),
      tap((clients) => {
        logger.info(
          `listLives #clients: ${clients.length}, ${JSON.stringify({
            providerName,
            title,
            readWrite,
            options,
          })}`
        );
      }),
      switchCase([
        () => readWrite,
        filterReadWriteClient({ options, targetTypes: getTargetTypes() }),
        filterReadClient({ options, targetTypes: getTargetTypes() }),
      ]),
      tap((clients) => {
        logger.info(`listLives #clients ${clients.length}`);
      }),
      map((client) => ({
        meta: {
          type: client.spec.type,
          providerName: client.spec.providerName,
        },
        key: `${client.spec.providerName}::${client.spec.type}`,
        dependsOn: map(
          (dependOn) => `${client.spec.providerName}::${dependOn}`
        )(client.spec.dependsOn),
        executor: ({ results }) =>
          pipe([
            () =>
              client.getList({
                lives,
                deep: true,
                resources: getResourcesByType({ type: client.spec.type }),
              }),
            tap((result) => {
              assert(true);
            }),
            (result) =>
              filterClient({
                result,
                client,
                onStateChange,
                options,
                //TODO live
                lives,
              }),
            tap((result) => {
              lives.addResources(result);
            }),
          ])(),
      })),
      (inputs) =>
        Lister({
          inputs,
          onStateChange: ({ key, meta, result, error, ...other }) => {
            assert(key);
            assert(meta.type);
            assert(meta.providerName);
            if (error) {
              assert(true);
              lives.addResources({ ...meta, error });
            }
            onStateChange({
              context: contextFromClient({
                client: clientByType({ type: meta.type }),
                title,
              }),
              error,
              ...other,
            });
          },
        }),
      tap((result) => {
        assert(result);
      }),
      assign({
        results: pipe([
          get("results"),
          filter(
            or([
              and([
                pipe([
                  get("type"),
                  (type) => isTypesMatch({ typeToMatch: type })(options.types),
                ]),
                pipe([get("resources"), not(isEmpty)]),
              ]),
              pipe([get("error"), not(isEmpty)]),
            ])
          ),
        ]),
      }),
      assign({ providerName: () => providerName }),
      tap(({ results }) => {
        logger.info(`listLives done`);
        lives.setByProvider({ providerName, livesPerProvider: results });
        //logger.debug(`listLives result: ${tos(result)}`);
      }),
    ])();

  const filterDestroyResources = ({
    client,
    resource,
    options: {
      all = false,
      name: nameToDelete = "",
      id: idToDelete = "",
      types = [],
    } = {},
    direction,
  }) => {
    const { spec } = client;
    const { type } = spec;
    const { name, id, cannotBeDeleted, managedByUs } = resource;

    assert(direction);
    logger.debug(
      `filterDestroyResources ${JSON.stringify({
        name,
        all,
        types,
        id,
        managedByUs,
      })}`
    );
    return switchCase([
      // Resource that cannot be deleted
      () => cannotBeDeleted,
      () => {
        logger.debug(
          `filterDestroyResources ${type}/${name}, default resource cannot be deleted`
        );
        return false;
      },
      // Delete all resources
      () => all,
      () => {
        logger.debug(`filterDestroyResources ${type}/${name}, delete all`);
        return true;
      },
      // Delete by id
      () => !isEmpty(idToDelete),
      () => id === idToDelete,
      // Delete by name
      () => !isEmpty(nameToDelete),
      () => name === nameToDelete,
      // Not our minion
      () => !managedByUs,
      () => {
        logger.debug(`filterDestroyResources ${type}/${name}, not our minion`);
        return false;
      },
      // Delete by type
      () => !isEmpty(types),
      () => any((type) => isTypeMatch({ type, typeToMatch: spec.type }))(types),
      // PlanDirection
      () => direction == PlanDirection.UP,
      () => false,
      () => true,
    ])();
  };

  const planFindDestroy = async ({
    options = {},
    direction = PlanDirection.DOWN,
    lives,
  }) =>
    pipe([
      tap(() => {
        logger.info(
          `planFindDestroy ${JSON.stringify({ options, direction })}`
        );
        assert(lives);
      }),
      () => lives.getByProvider({ providerName }),
      tap((livesPerProvider) => {
        assert(livesPerProvider);
      }),
      filter(not(get("error"))),
      flatMap(({ type, resources }) =>
        pipe([
          tap(() => {
            assert(type);
            assert(Array.isArray(resources));
          }),
          () => clientByType({ type }),
          (client) =>
            pipe([
              () => resources,
              filter((resource) =>
                filterDestroyResources({
                  client,
                  resource,
                  options,
                  direction,
                })
              ),
              map((resource) => ({
                resource: omit(["live"])(resource),
                action: "DESTROY",
                live: resource.live,
                providerName: resource.providerName,
              })),
            ])(),
        ])()
      ),
      tap((results) => {
        assert(results);
      }),
      filter(not(isEmpty)),
      tap((results) => {
        logger.debug(`planFindDestroy`);
      }),
    ])();

  const planQueryDestroy = async ({ options = {}, lives }) =>
    pipe([
      tap(() => {
        logger.info(
          `planQueryDestroy ${JSON.stringify({ providerName, options })}`
        );
        assert(lives);
      }),
      () => ({ providerName }),
      tap((result) => {
        assert(result);
      }),
      assign({
        //TODO
        plans: () => planFindDestroy({ options, lives }),
      }),
      assign({ error: any(get("error")) }),
      tap((result) => {
        logger.debug(`planQueryDestroy done`);
      }),
    ])();

  const planUpsert = async ({ onStateChange = noop, lives }) =>
    pipe([
      tap(() => {
        logger.info(`planUpsert`);
        assert(lives);
      }),
      tap(() =>
        onStateChange({
          context: contextFromPlanner({
            providerName: providerName,
            title: TitleQuery,
          }),
          nextState: "RUNNING",
        })
      ),
      () => getTargetResources(),
      filter(not(get("spec.listOnly"))),
      tap(
        map((resource) =>
          onStateChange({
            context: contextFromResource({
              operation: TitleQuery,
              resource: resource.toJSON(),
            }),
            nextState: "RUNNING",
          })
        )
      ),
      map.pool(
        mapPoolSize,
        tryCatch(
          async (resource) => {
            onStateChange({
              context: contextFromResource({
                operation: TitleQuery,
                resource: resource.toJSON(),
              }),
              nextState: "RUNNING",
            });
            const actions = await resource.planUpsert({ resource, lives });
            onStateChange({
              context: contextFromResource({
                operation: TitleQuery,
                resource: resource.toJSON(),
              }),
              nextState: "DONE",
            });
            return actions;
          },
          (error, resource) => {
            logger.error(`error query resource ${resource.toString()}`);
            logger.error(JSON.stringify(error, null, 4));
            logger.error(error.toString());
            error.stack && logger.error(error.stack);

            onStateChange({
              context: contextFromResource({
                operation: TitleQuery,
                resource: resource.toJSON(),
              }),
              nextState: "ERROR",
              error,
            });
            return [{ error, resource: resource.toJSON() }];
          }
        )
      ),
      filter(not(isEmpty)),
      flatten,
      tap((result) => {
        assert(result);
      }),
      tap((plans) =>
        onStateChange({
          context: contextFromPlanner({ providerName, title: TitleQuery }),
          nextState: nextStateOnError(hasResultError(plans)),
        })
      ),
      tap((result) => {
        logger.info(`planUpsert done`);
      }),
    ])();

  const planQuery = async ({
    onStateChange = identity,
    commandOptions = {},
    lives,
  } = {}) =>
    pipe([
      tap(() => {
        logger.info(`planQuery begins ${providerName}`);
        assert(lives);
      }),
      providerRunning({ onStateChange, providerName }),
      () => ({ providerName }),
      assign({
        resultDestroy: () =>
          planFindDestroy({
            direction: PlanDirection.UP,
            options: commandOptions,
            lives,
          }),
      }),
      assign({
        resultCreate: () =>
          planUpsert({
            onStateChange,
            lives,
          }),
      }),
      tap((result) => {
        assert(result);
      }),
      assign({ error: any(get("error")) }),
      tap((result) => {
        assert(result);
      }),
      tap(({ error }) =>
        onStateChange({
          context: contextFromProvider({ providerName }),
          nextState: nextStateOnError(error),
        })
      ),
      tap((result) => {
        logger.debug(`planQuery done ${providerName}`);
      }),
    ])({});

  const planApply = async ({ plan, lives, onStateChange = identity }) =>
    pipe([
      tap(() => {
        assert(plan);
        assert(lives);
        logger.info(`Apply Plan ${providerName}`);
      }),
      providerRunning({ onStateChange, providerName }),
      assign({
        resultDestroy: switchCase([
          () => isValidPlan(plan.resultDestroy),
          () =>
            planDestroy({
              plans: plan.resultDestroy,
              onStateChange,
              direction: PlanDirection.UP,
              title: TitleDestroying,
              lives,
            }),
          () => ({ error: false, results: [], plans: [] }),
        ]),
      }),
      assign({
        resultCreate: switchCase([
          () => isValidPlan(plan.resultCreate),
          pipe([
            () =>
              upsertResources({
                plans: plan.resultCreate,
                onStateChange,
                title: TitleDeploying,
                lives,
              }),
          ]),
          () => ({ error: false, plans: [] }),
        ]),
      }),
      tap((result) => {
        assert(result);
      }),
      (result) => ({
        providerName,
        lives,
        error: result.resultCreate.error || result.resultDestroy.error,
        resultCreate: result.resultCreate,
        resultDestroy: result.resultDestroy,
      }),
      tap((result) =>
        forEach((client) => {
          //TODO Refactor and
          client.onDeployed && client.onDeployed(result);
        })(getClients())
      ),
      tap((result) => {
        logger.info(`Apply done`);
      }),
    ])();

  const onStateChangeResource = ({ operation, onStateChange }) => {
    return ({ resource, error, ...other }) => {
      logger.debug(
        `onStateChangeResource resource:${tos(resource)}, ${tos(other)}`
      );

      assert(resource, "no resource");
      assert(resource.type, "no resource.type");

      onStateChange({
        context: contextFromResource({ operation, resource }),
        error,
        ...other,
      });
    };
  };
  const upsertResources = async ({ plans, onStateChange, title, lives }) => {
    assert(onStateChange);
    assert(title);
    assert(Array.isArray(plans));
    assert(lives);

    const executor = async ({ item }) => {
      const { resource, live, action, diff } = item;
      const engine = getResource(resource);
      assert(engine, `Cannot find resource ${tos(resource)}`);
      const resolvedDependencies = await engine.resolveDependencies({
        lives,
        dependenciesMustBeUp: true,
      });
      const input = await engine.resolveConfig({
        live,
        resolvedDependencies,
        lives,
        deep: true,
      });
      return switchCase([
        () => action === "UPDATE",
        async () => ({
          input,
          output: await engine.update({
            payload: input,
            live,
            diff,
            resolvedDependencies,
            lives,
          }),
        }),
        () => action === "CREATE",
        pipe([
          async () => ({
            input,
            output: await engine.create({
              payload: input,
              resolvedDependencies,
              lives,
            }),
          }),
          tap(({ output }) => {
            lives.addResource({
              providerName,
              type: engine.type,
              live: output,
            });
          }),
        ]),
        () => assert("action is not handled"),
      ])();
    };

    return switchCase([
      () => !isEmpty(plans),
      pipe([
        () =>
          Planner({
            plans,
            dependsOnType: getSpecs(),
            dependsOnInstance: mapToGraph(getMapNameToResource()),
            executor,
            onStateChange: onStateChangeResource({
              operation: TitleDeploying,
              onStateChange,
            }),
          }),
        (planner) => planner.run(),
        tap((result) =>
          onStateChange({
            context: contextFromPlanner({ providerName, title }),
            nextState: nextStateOnError(result.error),
          })
        ),
      ]),
      () => ({ error: false, plans }),
    ])();
  };

  const destroyByClient = async ({
    client,
    name,
    meta,
    resourcesPerType = [],
    live,
    lives,
  }) =>
    pipe([
      tap((x) => {
        logger.debug(
          `destroyByClient: ${tos({
            type: client.spec.type,
            name,
            meta,
            live,
            resourcesPerType,
          })}`
        );
        assert(client);
        assert(live);
        assert(lives);
        //assert(name);
      }),
      () => client.findId(live),
      tap((id) => {
        assert(id, `destroyByClient missing id in live: ${tos(live)}`);
      }),
      (id) =>
        pipe([
          find(eq(get("name"), name)),
          tap((resource) => {
            //assert(resource, `no resource for id ${id}`);
          }),
          tap((resource) =>
            retryCall({
              name: `destroy ${client.spec.type}/${id}/${name}`,
              fn: () =>
                client.destroy({
                  live,
                  id, // TODO remove id, only use live
                  name,
                  meta,
                  resource,
                  lives,
                }),
              isExpectedResult: () => true,
              //TODO isExpectedException: client.isExpectedExceptionDelete
              shouldRetryOnException: client.shouldRetryOnExceptionDelete,
              config: provider.config,
            })
          ),
        ])(resourcesPerType),
      tap(() => {
        logger.info(
          `destroyByClient: DONE ${JSON.stringify({
            type: client.spec.type,
            name,
          })}`
        );
      }),
    ])();

  const destroyById = async ({ type, live, lives, name, meta }) => {
    logger.debug(`destroyById: ${JSON.stringify({ type, name })}`);
    const client = clientByType({ type });
    assert(client, `Cannot find endpoint type ${type}}`);
    assert(client.spec);
    assert(live);
    assert(lives);

    return destroyByClient({
      client,
      name,
      meta,
      live,
      lives,
      resourcesPerType: getResourcesByType({ type }),
    });
  };

  const planDestroy = async ({
    plans,
    onStateChange = identity,
    direction = PlanDirection.DOWN,
    lives,
  }) =>
    pipe([
      tap(() => {
        assert(Array.isArray(plans), "plans must be an array");
        logger.info(`planDestroy #plans ${plans.length}`);
        logger.debug(`planDestroy ${tos({ plans, direction })}`);
        assert(lives);
      }),
      providerRunning({ onStateChange, providerName }),
      tap(() =>
        onStateChange({
          context: contextFromPlanner({
            providerName,
            title: TitleDestroying,
          }),
          nextState: "RUNNING",
        })
      ),
      () =>
        Planner({
          plans: plans,
          dependsOnType: getSpecs(),
          dependsOnInstance: mapToGraph(getMapNameToResource()),
          executor: ({ item }) =>
            destroyById({
              providerName: item.providerName,
              name: item.resource.name,
              meta: item.resource.meta,
              type: item.resource.type,
              live: item.live,
              lives,
            }),
          down: true,
          onStateChange: onStateChangeResource({
            operation: TitleDestroying,
            onStateChange,
          }),
        }),
      (planner) => planner.run(),
      tap((xxx) => {
        assert(xxx);
      }),
      tap(({ error }) =>
        onStateChange({
          context: contextFromPlanner({ providerName, title: TitleDestroying }),
          nextState: nextStateOnError(error),
        })
      ),
    ])();

  const toString = () => ({ name: providerName, type: toType() });

  const color = "#383838";
  const colorLigher = "#707070";
  const fontName = "Helvetica";

  const buildSubGraph = ({ options }) =>
    pipe([
      tap((xxx) => {
        logger.debug(`buildGraphNode`);
      }),
      () => getTargetResources(),
      reduce(
        (acc, resource) =>
          `${acc}"${resource.type}::${resource.name}" [label=<
          <table color='${color}' border="0">
             <tr><td align="text"><FONT color='${colorLigher}' POINT-SIZE="10"><B>${resource.type}</B></FONT><br align="left" /></td></tr>
             <tr><td align="text"><FONT color='${color}' POINT-SIZE="13">${resource.name}</FONT><br align="left" /></td></tr>
          </table>>];\n`,
        ""
      ),
      (result) =>
        `subgraph "cluster_${providerName}" {
fontname=${fontName}
color="${color}"
label=<<FONT color='${color}' POINT-SIZE="20"><B>${providerName}</B></FONT>>;
node [shape=box fontname=${fontName} color="${color}"]
${result}}
`,
    ])();

  const buildGraphAssociation = ({ options }) =>
    pipe([
      () => getTargetResources(),
      reduce(
        (acc, resource) =>
          `${acc}${map(
            (deps) =>
              `"${resource.type}::${resource.name}" -> "${deps.type}::${deps.name}" [color="${color}"];\n`
          )(resource.getDependencyList()).join("\n")}`,
        ""
      ),
      tap((result) => {
        logger.debug(`buildGraphAssociation ${result}`);
      }),
    ])();

  const provider = {
    toString,
    get config() {
      return providerConfig;
    },
    name: providerName,
    dependencies,
    type: toType,
    spinnersStopProvider,
    spinnersStartHook,
    spinnersStartQuery,
    spinnersStartDeploy,
    spinnersStartListLives,
    spinnersStopListLives,
    spinnersStartDestroyQuery,
    spinnersStartDestroy,
    planQueryDestroy,
    planDestroy,
    planFindDestroy,
    listLives,
    planQuery,
    planApply,
    listTargets,
    listConfig,
    targetResourcesAdd,
    clientByType,
    getResource,
    resourceNames,
    getResourcesByType,
    getTargetResources,
    getClients,
    register,
    runOnDeployed,
    runOnDestroyed,
    hookAdd,
    buildSubGraph,
    buildGraphAssociation,
    info: pipe([
      () => startBase({ onStateChange: identity }),
      () => ({
        provider: toString(),
        stage: providerConfig.stage,
        ...info(),
      }),
      tap((info) => {
        logger.debug(`info  ${tos(info)}`);
      }),
    ]),
    init,
    unInit,
    start: startBase,
    specs,
    mapNameToResource,
  };
  const enhanceProvider = {
    ...provider,
    get config() {
      return providerConfig;
    },
    ...createResourceMakers({ provider, config: providerConfig, specs }),
    ...createResourceMakersListOnly({
      provider,
      config: providerConfig,
      specs,
    }),
  };

  return enhanceProvider;
}

module.exports = CoreProvider;