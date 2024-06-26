const assert = require("assert");
const { pipe, tap, get, flatMap, map, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");
const { Tagger } = require("./OrganisationsCommon");

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id }) => ({ OrganizationalUnitId: Id }),
]);

const buildArn = () => pipe([get("Id")]);

const listOrganizationalUnitsForParent =
  ({ endpoint }) =>
  ({ ParentId }) =>
    pipe([
      tap((params) => {
        assert(ParentId);
      }),
      () => ({ ParentId }),
      endpoint().listOrganizationalUnitsForParent,
      get("OrganizationalUnits", []),
      map(
        assign({
          ParentId: () => ParentId,
          Tags: pipe([
            ({ Id }) => ({ ResourceId: Id }),
            endpoint().listTagsForResource,
            get("Tags"),
          ]),
        })
      ),
      flatMap((organizationalUnit) =>
        pipe([
          tap((params) => {
            assert(organizationalUnit.Id);
          }),
          () => ({ ParentId: organizationalUnit.Id }),
          listOrganizationalUnitsForParent({ endpoint }),
          (units) => [organizationalUnit, ...units],
        ])()
      ),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html
exports.OrganisationsOrganisationalUnit = ({}) => ({
  type: "OrganisationalUnit",
  package: "organizations",
  client: "Organizations",
  ignoreErrorCodes: ["OrganizationalUnitNotFoundException"],
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("Id")]),
  managedByOther: () => () => true,
  cannotBeDeleted: () => () => true,
  dependencies: {
    root: {
      type: "Root",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) => get("ParentId"),
    },
    organisationalUnitParent: {
      type: "OrganisationalUnit",
      group: "Organisations",
      dependencyId: ({ lives, config }) => get("ParentId"),
    },
  },
  omitProperties: ["Id", "Arn", "ParentId"],
  inferName: () => get("Name"),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#describeOrganizationalUnit-property
  getById: {
    method: "describeOrganizationalUnit",
    getField: "OrganizationalUnit",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#listOrganizationalUnitsForParent-property
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
        lives.getByType({
          providerName: config.providerName,
          type: "Root",
          group: "Organisations",
        }),
        flatMap(
          pipe([
            get("live.Id"),
            (Id) => ({ ParentId: Id }),
            listOrganizationalUnitsForParent({ endpoint }),
          ])
        ),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#createOrganizationalUnit-property
  create: {
    method: "createOrganizationalUnit",
    pickCreated: ({ payload }) => pipe([get("OrganizationalUnit")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#deleteOrganizationalUnit-property
  destroy: {
    method: "deleteOrganizationalUnit",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { root, organisationalUnitParent },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
      when(() => root, defaultsDeep({ ParentId: getField(root, "Id") })),
      when(
        () => organisationalUnitParent,
        defaultsDeep({ ParentId: getField(organisationalUnitParent, "Id") })
      ),
    ])(),
});
