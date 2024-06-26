// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "EventBus",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Name: "my-event-bus-dev",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Description: "EventRule",
      EventPattern: {
        "detail-type": ["something"],
        source: ["custom.myApp"],
      },
      Name: "bus-2-MyEventRule-XJJTMZ62JXD1",
    }),
    dependencies: ({}) => ({
      eventBus: "my-event-bus-dev",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "MySqsQueueArn-dev",
      InputPath: "$.detail",
    }),
    dependencies: ({}) => ({
      rule: "bus-2-MyEventRule-XJJTMZ62JXD1",
      sqsQueue: "sam-app-MySqsQueue-pDjpKlNsbbpE",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "sam-app-MySqsQueue-pDjpKlNsbbpE",
      tags: {
        mame: "sam-app",
      },
    }),
  },
];
