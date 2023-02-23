const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  assign,
  fork,
  pick,
  omit,
} = require("rubico");
const { defaultsDeep, forEach, pluck, size } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "IamUser" });
const { throwIfNotAwsError, buildTags } = require("../AwsCommon");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

const {
  tagResourceIam,
  untagResourceIam,
  ignoreErrorCodes,
  filterAttachedPolicies,
} = require("./AwsIamCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#tagUser-property
const tagResource = tagResourceIam({ field: "UserName", method: "tagUser" });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagUser-property
const untagResource = untagResourceIam({
  field: "UserName",
  method: "untagUser",
});

const pickId = pipe([
  pick(["UserName"]),
  tap(({ UserName }) => {
    assert(UserName);
  }),
]);

const decorate =
  ({ endpoint }) =>
  ({ UserName, Arn }) =>
    pipe([
      () => ({ UserName }),
      assign({
        Arn: () => Arn,
        AttachedPolicies: pipe([
          pickId,
          defaultsDeep({ MaxItems: 1e3 }),
          endpoint().listAttachedUserPolicies,
          get("AttachedPolicies"),
        ]),
        // Policies: pipe([
        //   pick(["UserName"]),
        //   defaultsDeep({ MaxItems: 1e3 }),
        //   endpoint().listUserPolicies,
        //   get("PolicyNames"),
        //   map(
        //     pipe([
        //       (PolicyName) => ({ PolicyName, UserName }),
        //       endpoint().getUserPolicy,
        //       get("PolicyDocument"),
        //       decodeURIComponent,
        //       JSON.parse,
        //     ])
        //   ),
        // ]),
        Groups: pipe([
          pickId,
          endpoint().listGroupsForUser,
          get("Groups"),
          pluck("GroupName"),
        ]),
        AccessKeys: pipe([
          pickId,
          endpoint().listAccessKeys,
          get("AccessKeyMetadata"),
        ]),
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listSigningCertificates-property
        // listSigningCertificates
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listSSHPublicKeys-property
        SSHPublicKeys: pipe([
          pickId,
          endpoint().listSSHPublicKeys,
          tap((params) => {
            assert(params);
          }),
          get("SSHPublicKeys"),
        ]),
        LoginProfile: fetchLoginProfile({ endpoint }),
        Tags: pipe([pickId, endpoint().listUserTags, get("Tags")]),
      }),
      omitIfEmpty([
        //
        "SSHPublicKeys",
        "Groups",
        "AttachedPolicies",
        "AccessKeys",
        //"Policies",
      ]),
    ])();

const fetchLoginProfile = ({ endpoint }) =>
  tryCatch(
    pipe([pick(["UserName"]), endpoint().getLoginProfile, get("LoginProfile")]),
    throwIfNotAwsError("NoSuchEntityException")
  );

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#attachUserPolicy-property
const attachUserPolicy = ({ endpoint, name }) =>
  pipe([
    tap((params) => {
      assert(name);
      assert(endpoint);
    }),
    forEach(
      pipe([
        tap(({ PolicyArn }) => {
          assert(PolicyArn);
        }),
        pick(["PolicyArn"]),
        defaultsDeep({ UserName: name }),
        endpoint().attachUserPolicy,
      ])
    ),
  ]);

const findId = () =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    get("Arn"),
    tap((Arn) => {
      assert(Arn);
    }),
  ]);

const findName = () =>
  pipe([
    get("UserName"),
    tap((UserName) => {
      assert(UserName);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#addUserToGroup-property
const addUserToGroup = ({ endpoint, name }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(name);
    }),
    forEach(
      pipe([
        (GroupName) => ({ GroupName, UserName: name }),
        endpoint().addUserToGroup,
      ])
    ),
  ]);

const updateAttachedPolicies = ({ endpoint, name, diff }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    () => diff,
    get("liveDiff.added.AttachedPolicies", []),
    attachUserPolicy({ endpoint, name }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteAccessKey-property
const destroyAccessKey =
  ({ endpoint }) =>
  ({ UserName }) =>
    pipe([
      () => ({ UserName }),
      endpoint().listAccessKeys,
      get("AccessKeyMetadata"),
      forEach(({ AccessKeyId }) => {
        endpoint().deleteAccessKey({
          AccessKeyId,
          UserName,
        });
      }),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteSSHPublicKey-property
const deleteSSHPublicKey =
  ({ endpoint }) =>
  ({ UserName, SSHPublicKeys = [] }) =>
    pipe([
      tap(() => {
        assert(UserName);
      }),
      () => SSHPublicKeys,
      map(({ SSHPublicKeyId }) =>
        pipe([
          tap(() => {
            assert(SSHPublicKeyId);
          }),
          () => ({ UserName, SSHPublicKeyId }),
          endpoint().deleteSSHPublicKey,
        ])()
      ),
    ])();

// TODO DeleteSigningCertificate
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteSigningCertificate-property
// TODO deleteServiceSpecificCredential
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteServiceSpecificCredential-property

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteLoginProfile-property
const deleteLoginProfile =
  ({ endpoint }) =>
  ({ UserName }) =>
    tryCatch(
      pipe([() => ({ UserName }), endpoint().deleteLoginProfile]),
      throwIfNotAwsError("NoSuchEntityException")
    )();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteUserPolicy-property
const deleteUserPolicy =
  ({ endpoint }) =>
  ({ UserName }) =>
    pipe([
      tap((params) => {
        assert(endpoint);
        assert(UserName);
      }),
      () => ({ UserName, MaxItems: 1e3 }),
      endpoint().listUserPolicies,
      get("PolicyNames"),
      tap((PolicyNames = []) => {
        logger.debug(`deleteUserPolicy: ${PolicyNames.length}`);
      }),
      forEach((PolicyName) => {
        endpoint().deleteUserPolicy({
          PolicyName,
          UserName,
        });
      }),
    ])();

const detachUserPolicy =
  ({ endpoint }) =>
  ({ UserName }) =>
    pipe([
      tap((params) => {
        assert(endpoint);
        assert(UserName);
      }),
      () => ({ UserName, MaxItems: 1e3 }),
      endpoint().listAttachedUserPolicies,
      get("AttachedPolicies"),
      tap((AttachedPolicies = []) => {
        logger.debug(`detachUserPolicy: ${AttachedPolicies.length}`);
      }),
      forEach(({ PolicyArn }) => {
        endpoint().detachUserPolicy({
          PolicyArn,
          UserName,
        });
      }),
    ])();

const removeUserFromGroup =
  ({ endpoint }) =>
  ({ UserName }) =>
    pipe([
      tap((params) => {
        assert(endpoint);
        assert(UserName);
      }),
      () => ({ UserName }),
      endpoint().listGroupsForUser,
      get("Groups"),
      tap((Groups = []) => {
        logger.debug(`removeUserFromGroup: ${size(Groups)}`);
      }),
      forEach(({ GroupName }) => {
        endpoint().removeUserFromGroup({
          GroupName,
          UserName,
        });
      }),
    ])();

exports.IAMUser = ({}) => ({
  type: "User",
  package: "iam",
  client: "IAM",
  propertiesDefault: {},
  omitProperties: [
    "UserId",
    "Arn",
    "CreateDate",
    "LoginProfile",
    "Policies",
    "AccessKeys",
    "PasswordLastUsed",
    "SSHPublicKeys",
  ],
  inferName: findName,
  findName,
  findId,
  propertiesDefault: { Path: "/" },
  filterLive: ({ lives }) =>
    pipe([
      pick(["UserName", "Path", "AttachedPolicies"]),
      filterAttachedPolicies({ lives }),
    ]),
  dependencies: {
    iamGroups: {
      type: "Group",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) => get("Groups"),
    },
    policies: {
      type: "Policy",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("AttachedPolicies"), pluck("PolicyArn")]),
    },
  },
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#getUser-property
  getById: {
    pickId,
    method: "getUser",
    getField: "User",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listUsers-property
  getList: {
    method: "listUsers",
    getParam: "Users",
    decorate: ({ getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createUser-property
  create: {
    method: "createUser",
    filterPayload: omit(["AttachedPolicies", "Groups"]),
    pickCreated: () => get("User"),
    postCreate: ({ endpoint, name, payload }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
        }),
        fork({
          groups: pipe([
            () => payload,
            get("Groups", []),
            addUserToGroup({ endpoint, name }),
          ]),
          policies: pipe([
            () => payload,
            get("AttachedPolicies", []),
            attachUserPolicy({ endpoint, name }),
          ]),
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#updateMyResource-property
  update:
    ({ endpoint }) =>
    ({ name, diff }) =>
      pipe([updateAttachedPolicies({ endpoint, name, diff })])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteUser-property
  destroy: {
    pickId,
    preDestroy: ({ endpoint }) =>
      tap(
        pipe([
          tap(({ UserName }) => {
            assert(endpoint);
            assert(UserName);
          }),
          fork({
            userFromGroup: removeUserFromGroup({ endpoint }),
            deletePolicy: pipe([
              tap(detachUserPolicy({ endpoint })),
              deleteUserPolicy({ endpoint }),
            ]),

            sshPublicKeys: deleteSSHPublicKey({ endpoint }),
            loginProfile: deleteLoginProfile({ endpoint }),
            accessKey: destroyAccessKey({ endpoint }),
          }),
        ])
      ),
    method: "deleteUser",
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource,
    untagResource,
  }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    config,
  }) =>
    pipe([
      () => ({}),
      defaultsDeep(otherProps),
      defaultsDeep({
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
    ])(),
});
