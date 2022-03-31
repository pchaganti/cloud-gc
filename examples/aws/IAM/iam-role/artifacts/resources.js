// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    name: "role-ec2-read-only",
    properties: ({}) => ({
      Description: "Allows EC2 instances to call AWS services on your behalf.",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonEC2FullAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEC2FullAccess",
        },
      ],
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "role-ec2-read-only",
    dependencies: () => ({
      roles: ["role-ec2-read-only"],
    }),
  },
];
