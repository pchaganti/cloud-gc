// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Instance",
    group: "EC2",
    name: "web-iam",
    properties: ({ config }) => ({
      InstanceType: "t2.micro",
      ImageId: "ami-02e136e904f3da870",
      Placement: {
        AvailabilityZone: `${config.region}d`,
      },
    }),
    dependencies: () => ({
      iamInstanceProfile: "my-profile",
    }),
  },
  {
    type: "User",
    group: "IAM",
    name: "Alice",
    properties: ({}) => ({
      Path: "/",
    }),
    dependencies: () => ({
      iamGroups: ["Admin"],
      policies: ["myPolicy-to-user"],
    }),
  },
  {
    type: "Group",
    group: "IAM",
    name: "Admin",
    properties: ({}) => ({
      Path: "/",
    }),
    dependencies: () => ({
      policies: ["myPolicy-to-group"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "role-allow-assume-role",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: `ec2.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonEKSWorkerNodePolicy",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
        },
      ],
    }),
    dependencies: () => ({
      policies: ["myPolicy-to-role"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "myPolicy-to-group",
    properties: ({}) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["s3:*"],
            Effect: "Allow",
            Resource: `*`,
          },
        ],
      },
      Path: "/",
      Description: "Allow ec2:Describe",
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "myPolicy-to-role",
    properties: ({}) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["s3:*"],
            Effect: "Allow",
            Resource: `*`,
          },
        ],
      },
      Path: "/",
      Description: "Allow ec2:Describe",
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "myPolicy-to-user",
    properties: ({}) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["s3:*"],
            Effect: "Allow",
            Resource: `*`,
          },
        ],
      },
      Path: "/",
      Description: "Allow ec2:Describe",
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "my-profile",
    dependencies: () => ({
      roles: ["role-allow-assume-role"],
    }),
  },
];