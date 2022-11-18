const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const pickId = pipe([pick(["BrokerId", "Username"])]);

const model = ({ config }) => ({
  package: "mq",
  client: "Mq",
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#describeUser-property
  getById: {
    method: "describeUser",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#createUser-property
  create: {
    method: "createUser",
    pickCreated: ({ payload }) => identity,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#updateUser-property
  update: {
    method: "updateUser",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ BrokerId: live.BrokerId })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#deleteUser-property
  destroy: {
    method: "deleteUser",
    pickId,
    isInstanceDown: eq(get("Pending.PendingChange"), "DELETE"),
  },
});

exports.MQUser = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    //TODO find broker name from id
    findName: pipe([get("live.Username")]),
    findId: pipe([
      get("live"),
      ({ BrokerId, Username }) => `${BrokerId}::${Username}`,
    ]),
    getByName: getByNameCore,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#listUsers-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () =>
          client.getListWithParent({
            parent: { type: "Broker", group: "MQ" },
            pickKey: pipe([pick(["BrokerId"])]),
            method: "listUsers",
            getParam: "Users",
            config,
            decorate: ({ parent }) =>
              pipe([
                defaultsDeep({
                  BrokerId: parent.BrokerId,
                }),
                getById,
              ]),
          }),
      ])(),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {},
    }) => pipe([() => otherProps, defaultsDeep({})])(),
  });