// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "MetricAlarm",
    group: "CloudWatch",
    properties: ({ config }) => ({
      AlarmName: "maintenance-window-alarm",
      AlarmActions: [
        `arn:aws:sns:${
          config.region
        }:${config.accountId()}:Default_CloudWatch_Alarms_Topic`,
      ],
      MetricName: "CommandsSucceeded",
      Namespace: "AWS/SSM-RunCommand",
      Statistic: "Average",
      Dimensions: [],
      Period: 300,
      EvaluationPeriods: 1,
      DatapointsToAlarm: 1,
      Threshold: 1,
      ComparisonOperator: "GreaterThanThreshold",
      TreatMissingData: "missing",
    }),
    dependencies: ({}) => ({
      snsTopic: "Default_CloudWatch_Alarms_Topic",
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
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "my-maintenance-window-role-policy",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
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
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["states:DescribeExecution", "states:StartExecution"],
            Resource: [
              "arn:aws:states:*:*:execution:*:*",
              "arn:aws:states:*:*:stateMachine:*",
            ],
          },
          {
            Effect: "Allow",
            Action: ["lambda:InvokeFunction"],
            Resource: ["arn:aws:lambda:*:*:function:*"],
          },
          {
            Effect: "Allow",
            Action: [
              "resource-groups:ListGroups",
              "resource-groups:ListGroupResources",
            ],
            Resource: ["*"],
          },
          {
            Effect: "Allow",
            Action: ["tag:GetResources"],
            Resource: ["*"],
          },
          {
            Effect: "Allow",
            Action: "iam:PassRole",
            Resource: "*",
            Condition: {
              StringEquals: {
                "iam:PassedToService": ["ssm.amazonaws.com"],
              },
            },
          },
        ],
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
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["sns:Publish"],
            Resource: `arn:aws:sns:${
              config.region
            }:${config.accountId()}:maintenance-window-topic`,
          },
        ],
      },
      Path: "/",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "gc-maintenance-window-run-command",
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
          },
        ],
      },
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
      TaskType: "RUN_COMMAND",
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
