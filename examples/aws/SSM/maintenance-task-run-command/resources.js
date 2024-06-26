// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "MetricAlarm",
    group: "CloudWatch",
    properties: ({ config }) => ({
      AlarmActions: [
        `arn:aws:sns:${
          config.region
        }:${config.accountId()}:Default_CloudWatch_Alarms_Topic`,
      ],
      AlarmName: "maintenance-window-alarm",
      ComparisonOperator: "GreaterThanThreshold",
      DatapointsToAlarm: 1,
      EvaluationPeriods: 1,
      MetricName: "CommandsSucceeded",
      Namespace: "AWS/SSM-RunCommand",
      Period: 300,
      Statistic: "Average",
      Threshold: 1,
      TreatMissingData: "missing",
    }),
    dependencies: ({}) => ({
      snsTopicAlarmActions: "Default_CloudWatch_Alarms_Topic",
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "my-maintenance-window-role-policy",
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "ssm:SendCommand",
              "ssm:CancelCommand",
              "ssm:ListCommands",
              "ssm:ListCommandInvocations",
              "ssm:GetCommandInvocation",
              "ssm:GetAutomationExecution",
              "ssm:StartAutomationExecution",
              "ssm:ListTagsForResource",
              "ssm:GetParameters",
            ],
            Effect: "Allow",
            Resource: "*",
          },
          {
            Action: ["states:DescribeExecution", "states:StartExecution"],
            Effect: "Allow",
            Resource: [
              "arn:aws:states:*:*:execution:*:*",
              "arn:aws:states:*:*:stateMachine:*",
            ],
          },
          {
            Action: ["lambda:InvokeFunction"],
            Effect: "Allow",
            Resource: ["arn:aws:lambda:*:*:function:*"],
          },
          {
            Action: [
              "resource-groups:ListGroups",
              "resource-groups:ListGroupResources",
            ],
            Effect: "Allow",
            Resource: ["*"],
          },
          {
            Action: ["tag:GetResources"],
            Effect: "Allow",
            Resource: ["*"],
          },
          {
            Action: "iam:PassRole",
            Condition: {
              StringEquals: {
                "iam:PassedToService": ["ssm.amazonaws.com"],
              },
            },
            Effect: "Allow",
            Resource: "*",
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "my-sns-publish-permissions",
      PolicyDocument: {
        Statement: [
          {
            Action: ["sns:Publish"],
            Effect: "Allow",
            Resource: `arn:aws:sns:${
              config.region
            }:${config.accountId()}:maintenance-window-topic`,
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "my-maintenance-window-role",
      Description: "Allows SSM to call AWS services on your behalf",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "ssm.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: ["my-maintenance-window-role-policy"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "my-sns-role",
      Description: "Allows SSM to call AWS services on your behalf",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "ssm.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: ["my-sns-publish-permissions"],
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "gc-maintenance-window-run-command",
    }),
  },
  { type: "Topic", group: "SNS", name: "Default_CloudWatch_Alarms_Topic" },
  { type: "Topic", group: "SNS", name: "maintenance-window-topic" },
  {
    type: "MaintenanceWindow",
    group: "SSM",
    properties: ({}) => ({
      AllowUnassociatedTargets: false,
      Cutoff: 0,
      Duration: 3,
      Name: "my-maintenance-window",
      Schedule: "cron(0 */30 * * * ? *)",
    }),
  },
  {
    type: "MaintenanceWindowTarget",
    group: "SSM",
    properties: ({}) => ({
      Name: "my-target",
      ResourceType: "INSTANCE",
      Targets: [
        {
          Key: "tag:mykey",
          Values: ["myvalue"],
        },
      ],
    }),
    dependencies: ({}) => ({
      maintenanceWindow: "my-maintenance-window",
    }),
  },
  {
    type: "MaintenanceWindowTask",
    group: "SSM",
    properties: ({ getId }) => ({
      AlarmConfiguration: {
        Alarms: [
          {
            Name: "maintenance-window-alarm",
          },
        ],
        IgnorePollAlarmFailure: false,
      },
      MaxConcurrency: "1",
      MaxErrors: "0",
      Name: "run-command-task",
      Priority: 1,
      Targets: [
        {
          Key: "WindowTargetIds",
          Values: [
            `${getId({
              type: "MaintenanceWindowTarget",
              group: "SSM",
              name: "my-target",
            })}`,
          ],
        },
      ],
      TaskArn: "AWS-RunShellScript",
      TaskInvocationParameters: {
        RunCommand: {
          CloudWatchOutputConfig: {
            CloudWatchLogGroupName: "my-maintenance-window-rin-command",
            CloudWatchOutputEnabled: true,
          },
          NotificationConfig: {
            NotificationEvents: ["All"],
            NotificationType: "Invocation",
          },
          OutputS3BucketName: "gc-maintenance-window-run-command",
          Parameters: {
            commands: ['echo "hello grucloud"'],
          },
        },
      },
      TaskParameters: {},
      TaskType: "RUN_COMMAND",
    }),
    dependencies: ({}) => ({
      alarms: ["maintenance-window-alarm"],
      iamRoleService: "my-maintenance-window-role",
      iamRoleSnsTopic: "my-sns-role",
      maintenanceWindow: "my-maintenance-window",
      maintenanceWindowTargets: ["my-target"],
      snsTopic: "maintenance-window-topic",
      s3Bucket: "gc-maintenance-window-run-command",
    }),
  },
];
