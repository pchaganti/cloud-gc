// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "MetricAlarm",
    group: "CloudWatch",
    properties: ({}) => ({
      AlarmName: "my-ec2-alarm",
      ComparisonOperator: "GreaterThanThreshold",
      DatapointsToAlarm: 1,
      EvaluationPeriods: 1,
      MetricName: "CPUUtilization",
      Namespace: "AWS/EC2",
      Period: 300,
      Statistic: "Average",
      Threshold: 50,
      TreatMissingData: "missing",
    }),
  },
  {
    type: "ExperimentTemplate",
    group: "Fis",
    properties: ({ getId }) => ({
      actions: {
        terminate: {
          actionId: "aws:ec2:stop-instances",
          parameters: {},
          targets: {
            Instances: "Instances-Target-1",
          },
        },
      },
      description: "my fis",
      stopConditions: [
        {
          source: "aws:cloudwatch:alarm",
          value: `${getId({
            type: "MetricAlarm",
            group: "CloudWatch",
            name: "my-ec2-alarm",
          })}`,
        },
      ],
      targets: {
        "Instances-Target-1": {
          resourceTags: {
            env: "dev",
          },
          resourceType: "aws:ec2:instance",
          selectionMode: "ALL",
        },
      },
    }),
    dependencies: ({}) => ({
      cloudWatchAlarm: ["my-ec2-alarm"],
      iamRole: "AWSFISIAMRole-1683043319064",
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "FIS-Console-EC2-1683043319064",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "AllowFISExperimentRoleEC2Actions",
            Effect: "Allow",
            Action: [
              "ec2:RebootInstances",
              "ec2:StopInstances",
              "ec2:StartInstances",
              "ec2:TerminateInstances",
            ],
            Resource: `arn:aws:ec2:${
              config.region
            }:${config.accountId()}:instance/*`,
          },
          {
            Sid: "AllowFISExperimentRoleSpotInstanceActions",
            Effect: "Allow",
            Action: ["ec2:SendSpotInstanceInterruptions"],
            Resource: `arn:aws:ec2:${
              config.region
            }:${config.accountId()}:instance/*`,
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "AWSFISIAMRole-1683043319064",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "fis.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: ["FIS-Console-EC2-1683043319064"],
    }),
  },
];
