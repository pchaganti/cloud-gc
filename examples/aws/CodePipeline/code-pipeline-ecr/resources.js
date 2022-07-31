// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Description:
        "Amazon CloudWatch Events rule to automatically start your pipeline when a change occurs in the Amazon ECR image tag. Deleting this may prevent changes from being detected in that pipeline. Read more: http://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-about-starting.html",
      EventPattern: {
        source: ["aws.ecr"],
        detail: {
          "action-type": ["PUSH"],
          "image-tag": ["latest"],
          "repository-name": ["starhackit"],
          result: ["SUCCESS"],
        },
        "detail-type": ["ECR Image Action"],
      },
      Name: "codepipeline-starha-latest-615512-rule",
      State: "ENABLED",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "codepipeline-my-pipeline",
    }),
    dependencies: ({ config }) => ({
      rule: "codepipeline-starha-latest-615512-rule",
      role: `cwe-role-${config.region}-my-pipeline`,
      codePipeline: "my-pipeline",
    }),
  },
  {
    type: "Project",
    group: "CodeBuild",
    properties: ({}) => ({
      artifacts: {
        encryptionDisabled: false,
        name: "my-project",
        packaging: "NONE",
        type: "CODEPIPELINE",
      },
      environment: {
        computeType: "BUILD_GENERAL1_SMALL",
        environmentVariables: [],
        image: "aws/codebuild/amazonlinux2-x86_64-standard:4.0",
        imagePullCredentialsType: "CODEBUILD",
        privilegedMode: true,
        type: "LINUX_CONTAINER",
      },
      logsConfig: {
        cloudWatchLogs: {
          status: "ENABLED",
        },
        s3Logs: {
          encryptionDisabled: false,
          status: "DISABLED",
        },
      },
      name: "my-project",
      source: {
        type: "CODEPIPELINE",
      },
    }),
    dependencies: ({}) => ({
      serviceRole: "codebuild-my-project-service-role",
    }),
  },
  {
    type: "Pipeline",
    group: "CodePipeline",
    properties: ({}) => ({
      pipeline: {
        artifactStore: {
          location: "codepipeline-us-east-1-149415713660",
          type: "S3",
        },
        name: "my-pipeline",
        stages: [
          {
            actions: [
              {
                actionTypeId: {
                  category: "Source",
                  owner: "AWS",
                  provider: "ECR",
                  version: "1",
                },
                configuration: {
                  RepositoryName: "starhackit",
                },
                inputArtifacts: [],
                name: "Source",
                namespace: "SourceVariables",
                outputArtifacts: [
                  {
                    name: "SourceArtifact",
                  },
                ],
                region: "us-east-1",
                runOrder: 1,
              },
            ],
            name: "Source",
          },
          {
            actions: [
              {
                actionTypeId: {
                  category: "Build",
                  owner: "AWS",
                  provider: "CodeBuild",
                  version: "1",
                },
                configuration: {
                  ProjectName: "my-project",
                },
                inputArtifacts: [
                  {
                    name: "SourceArtifact",
                  },
                ],
                name: "Build",
                namespace: "BuildVariables",
                outputArtifacts: [
                  {
                    name: "BuildArtifact",
                  },
                ],
                region: "us-east-1",
                runOrder: 1,
              },
            ],
            name: "Build",
          },
        ],
        version: 1,
      },
    }),
    dependencies: ({}) => ({
      role: "AWSCodePipelineServiceRole-my-pipeline",
      codeBuildProject: ["my-project"],
      ecrRepository: ["starhackit"],
    }),
  },
  {
    type: "Repository",
    group: "ECR",
    properties: ({}) => ({
      repositoryName: "starhackit",
      imageTagMutability: "MUTABLE",
      imageScanningConfiguration: {
        scanOnPush: false,
      },
      encryptionConfiguration: {
        encryptionType: "AES256",
      },
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "AWSCodePipelineServiceRole-my-pipeline",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `codepipeline.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({ config }) => ({
      policies: [`AWSCodePipelineServiceRole-${config.region}-my-pipeline`],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "codebuild-my-project-service-role",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `codebuild.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({ config }) => ({
      policies: [`CodeBuildBasePolicy-my-project-${config.region}`],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: `cwe-role-${config.region}-my-pipeline`,
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `events.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({ config }) => ({
      policies: [`start-pipeline-execution-${config.region}-my-pipeline`],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: `AWSCodePipelineServiceRole-${config.region}-my-pipeline`,
      PolicyDocument: {
        Statement: [
          {
            Action: ["iam:PassRole"],
            Resource: `*`,
            Effect: "Allow",
            Condition: {
              StringEqualsIfExists: {
                "iam:PassedToService": [
                  "cloudformation.amazonaws.com",
                  "elasticbeanstalk.amazonaws.com",
                  "ec2.amazonaws.com",
                  "ecs-tasks.amazonaws.com",
                ],
              },
            },
          },
          {
            Action: [
              "codecommit:CancelUploadArchive",
              "codecommit:GetBranch",
              "codecommit:GetCommit",
              "codecommit:GetRepository",
              "codecommit:GetUploadArchiveStatus",
              "codecommit:UploadArchive",
            ],
            Resource: `*`,
            Effect: "Allow",
          },
          {
            Action: [
              "codedeploy:CreateDeployment",
              "codedeploy:GetApplication",
              "codedeploy:GetApplicationRevision",
              "codedeploy:GetDeployment",
              "codedeploy:GetDeploymentConfig",
              "codedeploy:RegisterApplicationRevision",
            ],
            Resource: `*`,
            Effect: "Allow",
          },
          {
            Action: ["codestar-connections:UseConnection"],
            Resource: `*`,
            Effect: "Allow",
          },
          {
            Action: [
              "elasticbeanstalk:*",
              "ec2:*",
              "elasticloadbalancing:*",
              "autoscaling:*",
              "cloudwatch:*",
              "s3:*",
              "sns:*",
              "cloudformation:*",
              "rds:*",
              "sqs:*",
              "ecs:*",
            ],
            Resource: `*`,
            Effect: "Allow",
          },
          {
            Action: ["lambda:InvokeFunction", "lambda:ListFunctions"],
            Resource: `*`,
            Effect: "Allow",
          },
          {
            Action: [
              "opsworks:CreateDeployment",
              "opsworks:DescribeApps",
              "opsworks:DescribeCommands",
              "opsworks:DescribeDeployments",
              "opsworks:DescribeInstances",
              "opsworks:DescribeStacks",
              "opsworks:UpdateApp",
              "opsworks:UpdateStack",
            ],
            Resource: `*`,
            Effect: "Allow",
          },
          {
            Action: [
              "cloudformation:CreateStack",
              "cloudformation:DeleteStack",
              "cloudformation:DescribeStacks",
              "cloudformation:UpdateStack",
              "cloudformation:CreateChangeSet",
              "cloudformation:DeleteChangeSet",
              "cloudformation:DescribeChangeSet",
              "cloudformation:ExecuteChangeSet",
              "cloudformation:SetStackPolicy",
              "cloudformation:ValidateTemplate",
            ],
            Resource: `*`,
            Effect: "Allow",
          },
          {
            Action: [
              "codebuild:BatchGetBuilds",
              "codebuild:StartBuild",
              "codebuild:BatchGetBuildBatches",
              "codebuild:StartBuildBatch",
            ],
            Resource: `*`,
            Effect: "Allow",
          },
          {
            Effect: "Allow",
            Action: [
              "devicefarm:ListProjects",
              "devicefarm:ListDevicePools",
              "devicefarm:GetRun",
              "devicefarm:GetUpload",
              "devicefarm:CreateUpload",
              "devicefarm:ScheduleRun",
            ],
            Resource: `*`,
          },
          {
            Effect: "Allow",
            Action: [
              "servicecatalog:ListProvisioningArtifacts",
              "servicecatalog:CreateProvisioningArtifact",
              "servicecatalog:DescribeProvisioningArtifact",
              "servicecatalog:DeleteProvisioningArtifact",
              "servicecatalog:UpdateProduct",
            ],
            Resource: `*`,
          },
          {
            Effect: "Allow",
            Action: ["cloudformation:ValidateTemplate"],
            Resource: `*`,
          },
          {
            Effect: "Allow",
            Action: ["ecr:DescribeImages"],
            Resource: `*`,
          },
          {
            Effect: "Allow",
            Action: [
              "states:DescribeExecution",
              "states:DescribeStateMachine",
              "states:StartExecution",
            ],
            Resource: `*`,
          },
          {
            Effect: "Allow",
            Action: [
              "appconfig:StartDeployment",
              "appconfig:StopDeployment",
              "appconfig:GetDeployment",
            ],
            Resource: `*`,
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/service-role/",
      Description: "Policy used in trust relationship with CodePipeline",
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: `CodeBuildBasePolicy-my-project-${config.region}`,
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Resource: [
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/codebuild/my-project`,
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/codebuild/my-project:*`,
            ],
            Action: [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents",
            ],
          },
          {
            Effect: "Allow",
            Resource: [`arn:aws:s3:::codepipeline-${config.region}-*`],
            Action: [
              "s3:PutObject",
              "s3:GetObject",
              "s3:GetObjectVersion",
              "s3:GetBucketAcl",
              "s3:GetBucketLocation",
            ],
          },
          {
            Effect: "Allow",
            Action: [
              "codebuild:CreateReportGroup",
              "codebuild:CreateReport",
              "codebuild:UpdateReport",
              "codebuild:BatchPutTestCases",
              "codebuild:BatchPutCodeCoverages",
            ],
            Resource: [
              `arn:aws:codebuild:${
                config.region
              }:${config.accountId()}:report-group/my-project-*`,
            ],
          },
        ],
      },
      Path: "/service-role/",
      Description: "Policy used in trust relationship with CodeBuild",
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: `start-pipeline-execution-${config.region}-my-pipeline`,
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["codepipeline:StartPipelineExecution"],
            Resource: [
              `arn:aws:codepipeline:${
                config.region
              }:${config.accountId()}:my-pipeline`,
            ],
          },
        ],
      },
      Path: "/service-role/",
      Description:
        "Allows Amazon CloudWatch Events to automatically start a new execution in the my-pipeline pipeline when a change occurs",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    name: ({ config }) => `codepipeline-${config.region}-149415713660`,
    properties: ({ config }) => ({
      Policy: {
        Version: "2012-10-17",
        Id: "SSEAndSSLPolicy",
        Statement: [
          {
            Sid: "DenyUnEncryptedObjectUploads",
            Effect: "Deny",
            Principal: "*",
            Action: "s3:PutObject",
            Resource: `arn:aws:s3:::codepipeline-${config.region}-149415713660/*`,
            Condition: {
              StringNotEquals: {
                "s3:x-amz-server-side-encryption": "aws:kms",
              },
            },
          },
          {
            Sid: "DenyInsecureConnections",
            Effect: "Deny",
            Principal: "*",
            Action: "s3:*",
            Resource: `arn:aws:s3:::codepipeline-${config.region}-149415713660/*`,
            Condition: {
              Bool: {
                "aws:SecureTransport": "false",
              },
            },
          },
        ],
      },
    }),
  },
];
