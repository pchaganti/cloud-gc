// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "ParameterGroup",
    group: "MemoryDB",
    properties: ({}) => ({
      Description: " ",
      Family: "memorydb_redis6",
      ParameterGroupName: "my-parameter-group-redis6",
      ParameterNameValues: [],
    }),
  },
  {
    type: "ParameterGroup",
    group: "MemoryDB",
    properties: ({}) => ({
      Description: " ",
      Family: "memorydb_redis7",
      ParameterGroupName: "my-parameter-group-redis7",
      ParameterNameValues: [
        {
          ParameterName: "acllog-max-len",
          ParameterValue: "64",
        },
      ],
    }),
  },
];