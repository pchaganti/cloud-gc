// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Queue",
    group: "MediaConvert",
    properties: ({}) => ({
      Name: "my-queue",
      PricingPlan: "ON_DEMAND",
    }),
  },
];