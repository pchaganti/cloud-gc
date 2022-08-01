// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "testlambdatest-",
      retentionInDays: 30,
    }),
  },
  {
    type: "LogStream",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logStreamName:
        "log_stream_created_by_aws_to_validate_log_delivery_subscriptions",
    }),
    dependencies: ({}) => ({
      cloudWatchLogGroup: "testlambdatest-",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpcStack/test-VPC",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "vpcStack/test-VPC" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
      internetGateway: "vpcStack/test-VPC",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: ({ config }) =>
      `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}a`,
    dependencies: ({ config }) => ({
      subnet: `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}a`,
      eip: `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}a`,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) =>
      `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 8,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) =>
      `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 8,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) =>
      `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
      NewBits: 8,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) =>
      `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
      NewBits: 8,
      NetworkNumber: 3,
    }),
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "vpcStack/test-VPC::vpcStack/test-VPC/test-isolated-subnet-1Subnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 8,
      NetworkNumber: 4,
    }),
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "vpcStack/test-VPC::vpcStack/test-VPC/test-isolated-subnet-1Subnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 8,
      NetworkNumber: 5,
    }),
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) =>
      `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) =>
      `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}b`,
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) =>
      `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) =>
      `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}b`,
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "vpcStack/test-VPC::vpcStack/test-VPC/test-isolated-subnet-1Subnet1",
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "vpcStack/test-VPC::vpcStack/test-VPC/test-isolated-subnet-1Subnet2",
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}a`,
      subnet: `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}b`,
      subnet: `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}b`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}a`,
      subnet: `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}b`,
      subnet: `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}b`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "vpcStack/test-VPC::vpcStack/test-VPC/test-isolated-subnet-1Subnet1",
      subnet:
        "vpcStack/test-VPC::vpcStack/test-VPC/test-isolated-subnet-1Subnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "vpcStack/test-VPC::vpcStack/test-VPC/test-isolated-subnet-1Subnet2",
      subnet:
        "vpcStack/test-VPC::vpcStack/test-VPC/test-isolated-subnet-1Subnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      routeTable: `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}a`,
      natGateway: `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}a`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      routeTable: `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}b`,
      natGateway: `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}a`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      routeTable: `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}a`,
      ig: "vpcStack/test-VPC",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      routeTable: `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}b`,
      ig: "vpcStack/test-VPC",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "test-vpcSG",
      Description: "Security Group for all AWS Services within VPC",
    }),
    dependencies: ({}) => ({
      vpc: "vpcStack/test-VPC",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 443,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
          Description: "allow HTTPS traffic",
        },
        {
          CidrIp: "10.0.0.0/16",
          Description: "from 10.0.0.0/16:443",
        },
      ],
      ToPort: 443,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpcStack/test-VPC::test-vpcSG",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 80,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
          Description: "allow HTTP traffic",
        },
      ],
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpcStack/test-VPC::test-vpcSG",
    }),
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: ({ config }) =>
      `vpcStack/test-VPC::test-VPC-test-public-subnet-1-${config.region}a`,
  },
  {
    type: "VpcEndpoint",
    group: "EC2",
    name: ({ config }) =>
      `vpce::vpcStack/test-VPC::com.amazonaws.${config.region}.states`,
    properties: ({ config }) => ({
      PolicyDocument: {
        Statement: [
          {
            Action: "*",
            Effect: "Allow",
            Principal: "*",
            Resource: `*`,
          },
        ],
      },
      PrivateDnsEnabled: true,
      RequesterManaged: false,
      VpcEndpointType: "Interface",
      ServiceName: `com.amazonaws.${config.region}.states`,
    }),
    dependencies: ({ config }) => ({
      vpc: "vpcStack/test-VPC",
      subnets: [
        `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}a`,
        `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}b`,
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "lambdaStack-LogRetentionaae0aa3c5b4d4f87b02d85b201-130PK942BIJRK",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `lambda.amazonaws.com`,
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
                Action: [
                  "logs:PutRetentionPolicy",
                  "logs:DeleteRetentionPolicy",
                ],
                Resource: `*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName:
            "LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "lambdaStack-testLambdaServiceRole955E2289-1GZAHWTU2CITG",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `lambda.amazonaws.com`,
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
                Action: [
                  "ec2:CreateNetworkInterface",
                  "ec2:DescribeNetworkInterfaces",
                  "ec2:DeleteNetworkInterface",
                  "ec2:AssignPrivateIpAddresses",
                  "ec2:UnassignPrivateIpAddresses",
                ],
                Resource: `arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:test-lambdaFunction`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "testlNetworkPolicy7DDC8305",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
        {
          PolicyName: "AWSLambdaVPCAccessExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sfnStack-testtestMachineFlowRoleE75B9154-Y7HS9EGY2IQE",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `states.${config.region}.amazonaws.com`,
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
                Action: [
                  "logs:CreateLogDelivery",
                  "logs:GetLogDelivery",
                  "logs:UpdateLogDelivery",
                  "logs:DeleteLogDelivery",
                  "logs:ListLogDeliveries",
                  "logs:PutResourcePolicy",
                  "logs:DescribeResourcePolicies",
                  "logs:DescribeLogGroups",
                ],
                Resource: `*`,
                Effect: "Allow",
              },
              {
                Action: "lambda:InvokeFunction",
                Resource: [
                  `arn:aws:lambda:${
                    config.region
                  }:${config.accountId()}:function:test-lambdaFunction`,
                  `arn:aws:lambda:${
                    config.region
                  }:${config.accountId()}:function:test-lambdaFunction:*`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "testtestMachineFlowRoleDefaultPolicy7CDF0CE5",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName:
          "lambdaStack-LogRetentionaae0aa3c5b4d4f87b02d85b201-c8VHz1jOeFFc",
        Handler: "index.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "lambdaStack-LogRetentionaae0aa3c5b4d4f87b02d85b201-130PK942BIJRK",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Architectures: ["arm64"],
        FunctionName: "test-lambdaFunction",
        Handler: "app.lambdaHandler",
        MemorySize: 512,
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({ config }) => ({
      role: "lambdaStack-testLambdaServiceRole955E2289-1GZAHWTU2CITG",
      subnets: [
        `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}a`,
        `vpcStack/test-VPC::test-VPC-test-private-subnet-1-${config.region}b`,
      ],
      securityGroups: ["sg::vpcStack/test-VPC::test-vpcSG"],
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({ config, getId }) => ({
      definition: {
        StartAt: "test-stepLambda",
        States: {
          "test-stepLambda": {
            End: true,
            Retry: [
              {
                ErrorEquals: [
                  "Lambda.ServiceException",
                  "Lambda.AWSLambdaException",
                  "Lambda.SdkClientException",
                ],
                IntervalSeconds: 2,
                MaxAttempts: 6,
                BackoffRate: 2,
              },
            ],
            Type: "Task",
            OutputPath: "$.Payload",
            Resource: `arn:aws:states:::lambda:invoke`,
            Parameters: {
              FunctionName: `arn:aws:lambda:${
                config.region
              }:${config.accountId()}:function:test-lambdaFunction`,
              "Payload.$": "$",
            },
          },
        },
      },
      loggingConfiguration: {
        destinations: [
          {
            cloudWatchLogsLogGroup: {
              logGroupArn: `${getId({
                type: "LogGroup",
                group: "CloudWatchLogs",
                name: "testlambdatest-",
              })}:*`,
            },
          },
        ],
        level: "ALL",
      },
      name: "test-testMachineFlow",
    }),
    dependencies: ({}) => ({
      role: "sfnStack-testtestMachineFlowRoleE75B9154-Y7HS9EGY2IQE",
      logGroups: ["testlambdatest-"],
      lambdaFunctions: ["test-lambdaFunction"],
    }),
  },
];
