const assert = require("assert");
const {
  pipe,
  tap,
  get,
  map,
  eq,
  switchCase,
  reduce,
  filter,
  set,
  assign,
  and,
} = require("rubico");
const {
  identity,
  isFunction,
  find,
  callProp,
  keys,
  unless,
  isEmpty,
  defaultsDeep,
  when,
  last,
  values,
  includes,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildGetId } = require("@grucloud/core/Common");

const AxiosMaker = require("@grucloud/core/AxiosMaker");

exports.AZURE_MANAGEMENT_BASE_URL = "https://management.azure.com";
exports.AZURE_KEYVAULT_AUDIENCE = "https://vault.azure.net";
exports.AZURE_STORAGE_AUDIENCE = "https://storage.azure.com/";

exports.createAxiosAzure = ({ baseURL, bearerToken }) =>
  pipe([
    tap(() => {
      assert(baseURL);
      assert(isFunction(bearerToken));
    }),
    () =>
      AxiosMaker({
        baseURL,
        onHeaders: () => ({
          Authorization: `Bearer ${bearerToken()}`,
        }),
      }),
  ])();

exports.shortName = pipe([
  callProp("split", "::"),
  last,
  //TODO
  //callProp("toLowerCase"),
]);

exports.isSubstituable = callProp("startsWith", "{");

const findResourceById =
  ({ groupType, lives }) =>
  (idToMatch) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(groupType);
        assert(idToMatch);
      }),
      () => lives,
      find(
        and([
          eq(get("groupType"), groupType),
          pipe([
            get("id"),
            callProp("toUpperCase"),
            (id) =>
              pipe([
                () => idToMatch,
                callProp("toUpperCase"),
                callProp("startsWith", id),
              ])(),
          ]),
        ])
      ),
    ])();

exports.assignDependenciesId = ({
  group,
  type,
  lives,
  propertyName = "id",
  providerConfig,
}) =>
  pipe([
    tap((params) => {
      assert(group);
      assert(type);
      assert(lives);
      assert(providerConfig);
    }),
    assign({
      [propertyName]: pipe([
        get(propertyName),
        tap((id) => {
          if (!id) {
            assert(id, `no id for ${type}, propertyName: ${propertyName}`);
          }
        }),
        (id) =>
          pipe([
            () => id,
            findResourceById({
              groupType: `${group}::${type}`,
              lives,
            }),
            tap((resource) => {
              assert(resource);
            }),
            buildGetId({ id, providerConfig }),
            (result) => () => result,
          ])(),
      ]),
    }),
  ]);

const buildTags = ({ managedByKey, managedByValue, stageTagKey, stage }) => ({
  [managedByKey]: managedByValue,
  [stageTagKey]: stage,
});
exports.buildTags = buildTags;

exports.findDependenciesResourceGroup = ({ live, lives, config }) => ({
  type: "ResourceGroup",
  group: "Resources",
  ids: [
    pipe([
      () => live,
      get("id"),
      callProp("split", "/"),
      callProp("slice", 0, 5),
      callProp("join", "/"),
      callProp("replace", "resourcegroups", "resourceGroups"),
      tap((params) => {
        assert(true);
      }),
    ])(),
  ],
});

exports.findDependenciesUserAssignedIdentity = ({ live, lives, config }) =>
  pipe([
    () => live,
    get("identity.userAssignedIdentities", []),
    keys,
    switchCase([
      isEmpty,
      () => undefined,
      pipe([
        (ids) => ({
          type: "UserAssignedIdentity",
          group: "ManagedIdentity",
          ids,
        }),
      ]),
    ]),
  ])();

const isInstanceUp = switchCase([
  get("properties.provisioningState"),
  eq(get("properties.provisioningState"), "Succeeded"),
  // for DBforPostgreSQL::Server,
  get("properties.state"),
  pipe([
    get("properties.state"),
    (state) => pipe([() => ["Ready", "Running"], includes(state)])(),
  ]),
  get("id"), // Last resort
]);

exports.isInstanceUp = isInstanceUp;

const configDefaultDependenciesId = ({ dependencies, spec }) =>
  pipe([
    tap(() => {
      assert(spec);
      assert(dependencies);
    }),
    () => spec,
    get("dependencies"),
    filter(get("pathId")),
    map.entries(([varName, { list, pathId }]) => [
      varName,
      pipe([
        tap((params) => {
          assert(pathId);
        }),
        () => ({}),
        when(
          () => dependencies[varName],
          pipe([
            tap((params) => {
              assert(true);
            }),
            switchCase([
              () => list,
              pipe([
                tap((params) => {
                  assert(true);
                }),
              ]),
              pipe([set(pathId, getField(dependencies[varName], "id"))]),
            ]),
          ])
        ),
      ])(),
    ]),
    values,
    reduce((acc, value) => pipe([() => acc, defaultsDeep(value)])(), {}),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.configDefaultDependenciesId = configDefaultDependenciesId;

const configDefaultGeneric = ({ properties, dependencies, config, spec }) =>
  pipe([
    tap(() => {
      assert(config.location);
      assert(spec);
    }),
    () => properties,
    defaultsDeep({
      location: config.location,
      tags: buildTags(config),
    }),
    when(
      () => dependencies.managedIdentities,
      defaultsDeep({
        identity: {
          //TODO could be 'SystemAssigned, UserAssigned',
          type: "UserAssigned",
          userAssignedIdentities: pipe([
            () => dependencies.managedIdentities,
            tap((params) => {
              assert(true);
            }),
            map((managedIdentity) => getField(managedIdentity, "id")),
            tap((params) => {
              assert(true);
            }),
            unless(
              isEmpty,
              reduce((acc, id) => ({ ...acc, [id]: {} }), {})
            ),
            tap((params) => {
              assert(true);
            }),
          ])(),
        },
      })
    ),
    defaultsDeep(
      configDefaultDependenciesId({
        dependencies,
        spec,
      })
    ),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.configDefaultGeneric = configDefaultGeneric;

const hasBracket = includes("[]");
const removeBracket = pipe([callProp("replace", "[]", "")]);

const findIdsByKeys =
  ([key, ...otherKeys]) =>
  (live) =>
    pipe([
      () => live,
      get(removeBracket(key)),
      switchCase([
        () => isEmpty(otherKeys),
        // Last key
        pipe([identity]),
        // Go down
        pipe([
          switchCase([
            () => hasBracket(key),
            pipe([
              tap((values) => {
                //assert(Array.isArray(values));
              }),
              map(findIdsByKeys(otherKeys)),
            ]),
            findIdsByKeys(otherKeys),
          ]),
        ]),
      ]),
    ])();

exports.findIdsByPath =
  ({ pathId }) =>
  (live) =>
    pipe([
      tap(() => {
        assert(live);
        assert(pathId);
      }),
      () => pathId,
      callProp("split", "."),
      (keys) => findIdsByKeys(keys)(live),
      unless(Array.isArray, (id) => [id]),
    ])();
