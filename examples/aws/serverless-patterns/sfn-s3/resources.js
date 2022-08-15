// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-WorkflowExecutionRole-7I137IX4DEEI",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "states.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["s3:PutObject"],
                Resource: "arn:aws:s3:::gc-my-sfn-bucket-destination/*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "S3Write",
        },
      ],
    }),
  },
  { type: "Bucket", group: "S3", name: "gc-my-sfn-bucket-destination" },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({}) => ({
      definition: {
        StartAt: "SendCustomEvent",
        States: {
          SendCustomEvent: {
            End: true,
            Parameters: {
              Body: "Hello World",
              Bucket: "gc-my-sfn-bucket-destination",
              Key: "filename.txt",
            },
            Resource: "arn:aws:states:::aws-sdk:s3:putObject",
            Type: "Task",
          },
        },
      },
      name: "MyStateMachine-SwVayjQIlTdv",
      tags: [
        {
          key: "stateMachine:createdBy",
          value: "SAM",
        },
      ],
    }),
    dependencies: ({}) => ({
      role: "sam-app-WorkflowExecutionRole-7I137IX4DEEI",
    }),
  },
];
