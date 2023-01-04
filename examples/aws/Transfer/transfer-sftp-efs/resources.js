// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "Vpc", group: "EC2", name: "vpc-default", isDefault: true },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-a",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "sg::vpc-default::default",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "FileSystem",
    group: "EFS",
    name: "myfs",
    properties: ({ config }) => ({
      AvailabilityZoneId: "use1-az4",
      AvailabilityZoneName: `${config.region}a`,
      Encrypted: true,
      PerformanceMode: "generalPurpose",
      ThroughputMode: "bursting",
    }),
  },
  {
    type: "MountTarget",
    group: "EFS",
    properties: ({ config }) => ({
      AvailabilityZoneName: `${config.region}a`,
    }),
    dependencies: ({}) => ({
      fileSystem: "myfs",
      subnet: "vpc-default::subnet-default-a",
      securityGroups: ["sg::vpc-default::default"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "AWSTransferLoggingAccess",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "transfer.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AWSTransferLoggingAccess",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSTransferLoggingAccess",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "role-transfer",
      Description: "Allow AWS Transfer to call AWS services on your behalf.",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "transfer.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AWSTransferFullAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AWSTransferFullAccess",
        },
      ],
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "grucloud.org.",
    }),
    dependencies: ({}) => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: ({}) => ({
      hostedZone: "grucloud.org.",
      transferServer: "EFS::PUBLIC",
    }),
  },
  {
    type: "Domain",
    group: "Route53Domains",
    name: "grucloud.org",
    readOnly: true,
  },
  {
    type: "Server",
    group: "Transfer",
    properties: ({}) => ({
      Domain: "EFS",
      EndpointType: "PUBLIC",
      IdentityProviderType: "SERVICE_MANAGED",
      Protocols: ["SFTP"],
      Tags: [
        {
          Key: "transfer:customHostname",
          Value: "sftp.grucloud.org",
        },
      ],
    }),
    dependencies: ({}) => ({
      iamRoleLogging: "AWSTransferLoggingAccess",
    }),
  },
  {
    type: "User",
    group: "Transfer",
    properties: ({ getId }) => ({
      HomeDirectory: `/${getId({
        type: "FileSystem",
        group: "EFS",
        name: "myfs",
        path: "live.FileSystemId",
      })}/my-user`,
      HomeDirectoryType: "PATH",
      PosixProfile: {
        Gid: 65534,
        SecondaryGids: [],
        Uid: 65534,
      },
      SshPublicKeys: [
        {
          SshPublicKeyBody:
            "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDvgA5na1mOXg/sn/wG950KAP9X0u2mWLLGeJVB/IECb1rHZN/x6lLfomEc8uCpFPj7wT1tZYq9iYkJXF7sWqvyRfHdvnSXLlVf2q4scgixsvxZYRu0B+Iwr8w2jL2gR81T3m/cD5PflCUHpgI5QF0TAfGQYPvdoWAH46JfwLS5gpZ4sULyVt6JksiED1gHG/rKhKwUaVxJLA0QqxlKxqF1P2Vj7EWjZF2QPVJB7tJ5JZIAA9DYCvUeqEqUEajPYFpuVJLicBPSuo9AN7YDbsvzVsoteB5tVZcEjfS6WAxWQ6zrdNCKfLFu50rFWY7bWQfLxcldTWNvueBXchxR2PqF",
        },
      ],
      UserName: "my-user",
    }),
    dependencies: ({}) => ({
      efsFileSystem: "myfs",
      iamRole: "role-transfer",
      server: "EFS::PUBLIC",
    }),
  },
];