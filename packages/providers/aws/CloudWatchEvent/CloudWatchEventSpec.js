const assert = require("assert");
const { tap, pipe, map, omit, pick, get, assign } = require("rubico");
const { defaultsDeep, unless, callProp, when } = require("rubico/x");

const {
  compareAws,
  isOurMinion,
  replaceAccountAndRegion,
} = require("../AwsCommon");

const { CloudWatchEventConnection } = require("./CloudWatchEventConnection");
const { CloudWatchEventBus } = require("./CloudWatchEventBus");
const { CloudWatchEventRule } = require("./CloudWatchEventRule");
const { CloudWatchEventTarget } = require("./CloudWatchEventTarget");
const {
  CloudWatchEventApiDestination,
} = require("./CloudWatchEventApiDestination");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html
const GROUP = "CloudWatchEvents";
const compareCloudWatchEvent = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "ApiDestination",
      Client: CloudWatchEventApiDestination,
      dependencies: {
        connection: { type: "Connection", group: GROUP, parent: true },
      },
      omitProperties: [
        "Name",
        "ConnectionArn",
        "ApiDestinationArn",
        "ApiDestinationState",
        "CreationTime",
        "LastModifiedTime",
      ],
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
    },
    {
      type: "Connection",
      Client: CloudWatchEventConnection,
      dependencies: {
        //secret: { type: "Secret", group: "SecretsManager", autoCreated:true },
      },
      omitProperties: [
        "Name",
        "ConnectionArn",
        "CreationTime",
        "LastAuthorizedTime",
        "LastModifiedTime",
        "ConnectionState",
        "SecretArn",
      ],
      environmentVariables: [
        {
          path: "AuthParameters.ApiKeyAuthParameters.ApiKeyValue",
          suffix: "API_KEY_VALUE",
        },
      ],
      compare: compareCloudWatchEvent({
        filterAll: () =>
          pipe([omit(["AuthParameters.ApiKeyAuthParameters.ApiKeyValue"])]),
      }),
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
    },
    {
      type: "EventBus",
      Client: CloudWatchEventBus,
      omitProperties: ["Arn"],
      filterLive: () => pipe([pick([])]),
    },
    {
      type: "Rule",
      Client: CloudWatchEventRule,
      omitProperties: ["Name", "Arn", "CreatedBy", "EventBusName"],
      compare: compareCloudWatchEvent({
        filterTarget: () => pipe([defaultsDeep({ EventBusName: "default" })]),
        filterLive: () => pipe([omit(["Arn", "CreatedBy"])]),
      }),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            EventPattern: pipe([
              get("EventPattern"),
              when(
                get("account"),
                assign({
                  account: pipe([
                    get("account"),
                    map(replaceAccountAndRegion({ providerConfig })),
                  ]),
                })
              ),
            ]),
          }),
        ]),
      dependencies: {
        eventBus: { type: "EventBus", group: "CloudWatchEvents", parent: true },
      },
    },
    {
      type: "Target",
      Client: CloudWatchEventTarget,
      inferName: ({ properties: { Id }, dependenciesSpec: { rule } }) =>
        pipe([
          tap((params) => {
            assert(Id);
            assert(rule);
          }),
          () => `target::${rule}::${Id}`,
        ])(),
      omitProperties: ["EventBusName", "Rule", "RoleArn"],
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          unless(
            pipe([get("Arn"), callProp("startsWith", "arn:aws:autoscaling")]),
            omit(["Arn"])
          ),
        ]),
      dependencies: {
        rule: { type: "Rule", group: "CloudWatchEvents", parent: true },
        role: { type: "Role", group: "IAM" },
        //TODO https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#putTargets-property
        logGroup: { type: "LogGroup", group: "CloudWatchLogs" },
        sqsQueue: { type: "Queue", group: "SQS" },
        snsTopic: { type: "Topic", group: "SNS" },
        apiGatewayRest: { type: "RestApi", group: "APIGateway" },
        eventBus: { type: "EventBus", group: "CloudWatchEvents" },
        ecsTask: { type: "Task", group: "ECS" },
        lambdaFunction: { type: "Function", group: "Lambda" },
        sfnStateMachine: { type: "StateMachine", group: "StepFunctions" },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compareCloudWatchEvent({}),
      isOurMinion,
    })
  ),
]);
