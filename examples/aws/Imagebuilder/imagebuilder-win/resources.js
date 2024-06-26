// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "EC2InstanceProfileForImageBuilder",
    dependencies: ({}) => ({
      roles: ["EC2InstanceProfileForImageBuilder"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "EC2InstanceProfileForImageBuilder",
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
          PolicyArn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
          PolicyName: "AmazonSSMManagedInstanceCore",
        },
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/EC2InstanceProfileForImageBuilder",
          PolicyName: "EC2InstanceProfileForImageBuilder",
        },
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/EC2InstanceProfileForImageBuilderECRContainerBuilds",
          PolicyName: "EC2InstanceProfileForImageBuilderECRContainerBuilds",
        },
      ],
    }),
  },
  {
    type: "DistributionConfiguration",
    group: "Imagebuilder",
    properties: ({ config }) => ({
      distributions: [
        {
          amiDistributionConfiguration: {},
          region: `${config.region}`,
        },
      ],
      name: "my-pipeline-46d4672f-d8ff-49d5-9474-a961f4b4f72c",
    }),
  },
  {
    type: "ImagePipeline",
    group: "Imagebuilder",
    properties: ({}) => ({
      name: "my-pipeline",
      platform: "Linux",
      schedule: {
        pipelineExecutionStartCondition: "EXPRESSION_MATCH_ONLY",
        scheduleExpression: "cron(0 9 ? * mon)",
      },
    }),
    dependencies: ({}) => ({
      distributionConfiguration:
        "my-pipeline-46d4672f-d8ff-49d5-9474-a961f4b4f72c",
      imageRecipe: "my-recipe",
      infrastructureConfiguration:
        "my-pipeline-46d4672f-d8ff-49d5-9474-a961f4b4f72c",
    }),
  },
  {
    type: "ImageRecipe",
    group: "Imagebuilder",
    properties: ({}) => ({
      additionalInstanceConfiguration: {
        systemsManagerAgent: {
          uninstallAfterBuild: false,
        },
      },
      blockDeviceMappings: [
        {
          deviceName: "/dev/xvda",
          ebs: {
            deleteOnTermination: true,
            encrypted: false,
            volumeSize: 8,
            volumeType: "gp2",
          },
        },
      ],
      components: [
        {
          componentArn:
            "arn:aws:imagebuilder:us-east-1:aws:component/amazon-cloudwatch-agent-linux/x.x.x",
        },
      ],
      name: "my-recipe",
      parentImage:
        "arn:aws:imagebuilder:us-east-1:aws:image/amazon-linux-2-x86/x.x.x",
      platform: "Linux",
      semanticVersion: "1.0.0",
      workingDirectory: "/tmp",
    }),
  },
  {
    type: "InfrastructureConfiguration",
    group: "Imagebuilder",
    properties: ({}) => ({
      name: "my-pipeline-46d4672f-d8ff-49d5-9474-a961f4b4f72c",
    }),
    dependencies: ({}) => ({
      instanceProfile: "EC2InstanceProfileForImageBuilder",
    }),
  },
];
