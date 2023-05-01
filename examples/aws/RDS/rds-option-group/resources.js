// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "OptionGroup",
    group: "RDS",
    properties: ({}) => ({
      EngineName: "mariadb",
      MajorEngineVersion: "10.6",
      OptionGroupDescription: "my group",
      OptionGroupName: "my-option-group",
      Options: [
        {
          OptionDescription: "MariaDB Audit Plugin",
          OptionName: "MARIADB_AUDIT_PLUGIN",
          OptionSettings: [
            {
              AllowedValues: "0-2147483647",
              ApplyType: "DYNAMIC",
              DataType: "INTEGER",
              DefaultValue: "1024",
              Description:
                "Limit on the length of the query string in a record.",
              IsCollection: false,
              IsModifiable: true,
              Name: "SERVER_AUDIT_QUERY_LOG_LIMIT",
              Value: "1024",
            },
            {
              AllowedValues:
                "CONNECT,QUERY,TABLE,QUERY_DDL,QUERY_DML,QUERY_DCL,QUERY_DML_NO_SELECT",
              ApplyType: "DYNAMIC",
              DataType: "STRING",
              DefaultValue: "CONNECT,QUERY",
              Description:
                "Types of actions to be logged (connect, query, or table)",
              IsCollection: true,
              IsModifiable: true,
              Name: "SERVER_AUDIT_EVENTS",
              Value: "CONNECT,QUERY",
            },
          ],
          Permanent: false,
          Persistent: false,
        },
      ],
    }),
  },
];
