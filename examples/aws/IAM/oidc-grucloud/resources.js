// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "OpenIDConnectProvider",
    group: "IAM",
    properties: ({}) => ({
      ClientIDList: ["aws.workload.identity"],
      Url: "demo.grucloud.com",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ getId }) => ({
      RoleName: "role-grucloud",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: `${getId({
                type: "OpenIDConnectProvider",
                group: "IAM",
                name: "oidp::demo.grucloud.com",
              })}`,
            },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                [`${getId({
                  type: "OpenIDConnectProvider",
                  group: "IAM",
                  name: "oidp::demo.grucloud.com",
                  path: "live.Url",
                })}:aud`]: "aws.workload.identity",
              },
              StringLike: {
                [`${getId({
                  type: "OpenIDConnectProvider",
                  group: "IAM",
                  name: "oidp::demo.grucloud.com",
                  path: "live.Url",
                })}:sub`]: "organization:my-org:*",
              },
            },
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyArn: "arn:aws:iam::aws:policy/AdministratorAccess",
          PolicyName: "AdministratorAccess",
        },
      ],
    }),
    dependencies: ({}) => ({
      openIdConnectProvider: "oidp::demo.grucloud.com",
    }),
  },
];