// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Application",
    group: "EMRServerless",
    properties: ({}) => ({
      name: "My_First_Application",
      releaseLabel: "emr-6.8.0",
      type: "Spark",
    }),
  },
];