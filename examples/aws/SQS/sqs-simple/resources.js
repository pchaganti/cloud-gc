// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "my-queue",
      Tags: {
        "my-tag": "my-value",
      },
    }),
  },
];
