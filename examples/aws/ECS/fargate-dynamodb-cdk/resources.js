// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName:
        "CdkStack-MyFargateServiceTaskDefwebLogGroup4A6C44E8-gASMJdvFOK38",
    }),
  },
  {
    type: "Table",
    group: "DynamoDB",
    properties: ({}) => ({
      TableName: "CdkStack-DynamoTableB2B22E15-1T1CPCS57NG64",
      AttributeDefinitions: [
        {
          AttributeName: "ID",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "ID",
          KeyType: "HASH",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "CdkStack/MyVpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "CdkStack/MyVpc" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
      internetGateway: "CdkStack/MyVpc",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet1",
    properties: ({}) => ({
      PrivateIpAddressIndex: 10810,
    }),
    dependencies: ({}) => ({
      subnet: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
      eip: "CdkStack/MyVpc/PublicSubnet1",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet2",
    properties: ({}) => ({
      PrivateIpAddressIndex: 6108,
    }),
    dependencies: ({}) => ({
      subnet: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
      eip: "CdkStack/MyVpc/PublicSubnet2",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/MyVpc/PrivateSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 2,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/MyVpc/PrivateSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 2,
      NetworkNumber: 3,
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
      NewBits: 2,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
      NewBits: 2,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/MyVpc/PrivateSubnet1",
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/MyVpc/PrivateSubnet2",
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet1",
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet2",
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet1",
      subnet: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet2",
      subnet: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet2",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
      subnet: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
      subnet: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet1",
      vpcEndpoint: `CdkStack/MyVpc::com.amazonaws.${config.region}.dynamodb`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "CdkStack/MyVpc/PublicSubnet1",
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet2",
      vpcEndpoint: `CdkStack/MyVpc::com.amazonaws.${config.region}.dynamodb`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "CdkStack/MyVpc/PublicSubnet2",
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
      vpcEndpoint: `CdkStack/MyVpc::com.amazonaws.${config.region}.dynamodb`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "CdkStack/MyVpc",
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
      vpcEndpoint: `CdkStack/MyVpc::com.amazonaws.${config.region}.dynamodb`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "CdkStack/MyVpc",
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName:
        "CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-1XNRVLAOSZHKP",
      Description:
        "Automatically created Security Group for ELB CdkStackMyFargateServiceLBE7D87832",
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "CdkStack-MyFargateServiceSecurityGroup7016792A-1V6IURFEVP447",
      Description: "CdkStack/MyFargateService/Service/SecurityGroup",
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
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
          Description: "Allow from anyone on port 80",
        },
      ],
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::CdkStack/MyVpc::CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-1XNRVLAOSZHKP",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 80,
      IpProtocol: "tcp",
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::CdkStack/MyVpc::CdkStack-MyFargateServiceSecurityGroup7016792A-1V6IURFEVP447",
      securityGroupFrom: [
        "sg::CdkStack/MyVpc::CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-1XNRVLAOSZHKP",
      ],
    }),
  },
  {
    type: "SecurityGroupRuleEgress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 80,
      IpProtocol: "tcp",
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::CdkStack/MyVpc::CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-1XNRVLAOSZHKP",
      securityGroupFrom: [
        "sg::CdkStack/MyVpc::CdkStack-MyFargateServiceSecurityGroup7016792A-1V6IURFEVP447",
      ],
    }),
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet1",
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet2",
  },
  {
    type: "VpcEndpoint",
    group: "EC2",
    properties: ({ config }) => ({
      VpcEndpointType: "Gateway",
      ServiceName: `com.amazonaws.${config.region}.dynamodb`,
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              AWS: "*",
            },
            Action: "dynamodb:PutItem",
            Resource: `arn:aws:dynamodb:${
              config.region
            }:${config.accountId()}:table/CdkStack-DynamoTableB2B22E15-1T1CPCS57NG64`,
            Condition: {
              ArnEquals: {
                "aws:PrincipalArn": `arn:aws:iam::${config.accountId()}:role/CdkStack-MyFargateServiceTaskDefTaskRole62C7D397-GTVVNX6JAX97`,
              },
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
      routeTables: [
        "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet1",
        "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet2",
        "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
        "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
      ],
      iamRoles: [
        "CdkStack-MyFargateServiceTaskDefTaskRole62C7D397-GTVVNX6JAX97",
      ],
    }),
  },
  {
    type: "Cluster",
    group: "ECS",
    properties: ({}) => ({
      clusterName: "CdkStack-MyCluster4C1BA579-gFx7BmvFASaM",
    }),
  },
  {
    type: "TaskDefinition",
    group: "ECS",
    properties: ({ config }) => ({
      containerDefinitions: [
        {
          cpu: 0,
          environment: [
            {
              name: "region",
              value: `${config.region}`,
            },
            {
              name: "databaseTable",
              value: "CdkStack-DynamoTableB2B22E15-1T1CPCS57NG64",
            },
          ],
          essential: true,
          image: `${config.accountId()}.dkr.ecr.${
            config.region
          }.amazonaws.com/cdk-hnb659fds-container-assets-${config.accountId()}-${
            config.region
          }:5f0d6af37f2e5e2de73406f38ad80da5fd1c53e73fc4758019cf420950426066`,
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-group":
                "CdkStack-MyFargateServiceTaskDefwebLogGroup4A6C44E8-gASMJdvFOK38",
              "awslogs-region": `${config.region}`,
              "awslogs-stream-prefix": "MyFargateService",
            },
          },
          name: "web",
          portMappings: [
            {
              containerPort: 80,
              hostPort: 80,
              protocol: "tcp",
            },
          ],
        },
      ],
      cpu: "512",
      family: "CdkStackMyFargateServiceTaskDef846A07DE",
      memory: "2048",
      networkMode: "awsvpc",
      requiresCompatibilities: ["FARGATE"],
    }),
    dependencies: ({}) => ({
      taskRole: "CdkStack-MyFargateServiceTaskDefTaskRole62C7D397-GTVVNX6JAX97",
      executionRole:
        "CdkStack-MyFargateServiceTaskDefExecutionRoleD6305-12UZ2O2VLJ5O5",
    }),
  },
  {
    type: "Listener",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Port: 80,
      Protocol: "HTTP",
    }),
    dependencies: ({}) => ({
      loadBalancer: "CdkSt-MyFar-13HHQXA9K9QSK",
      targetGroup: "CdkSta-MyFar-I3RIWZZQ5WYA",
    }),
  },
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "CdkSt-MyFar-13HHQXA9K9QSK",
      Scheme: "internet-facing",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: ({}) => ({
      subnets: [
        "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
        "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
      ],
      securityGroups: [
        "sg::CdkStack/MyVpc::CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-1XNRVLAOSZHKP",
      ],
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "CdkSta-MyFar-I3RIWZZQ5WYA",
      Protocol: "HTTP",
      Port: 80,
      HealthCheckProtocol: "HTTP",
      HealthCheckPort: "traffic-port",
      TargetType: "ip",
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName:
        "CdkStack-MyFargateServiceTaskDefExecutionRoleD6305-12UZ2O2VLJ5O5",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ecs-tasks.amazonaws.com",
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
                  "ecr:BatchCheckLayerAvailability",
                  "ecr:GetDownloadUrlForLayer",
                  "ecr:BatchGetImage",
                ],
                Resource: `arn:aws:ecr:${
                  config.region
                }:${config.accountId()}:repository/cdk-hnb659fds-container-assets-${config.accountId()}-${
                  config.region
                }`,
                Effect: "Allow",
              },
              {
                Action: "ecr:GetAuthorizationToken",
                Resource: "*",
                Effect: "Allow",
              },
              {
                Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
                Resource: `arn:aws:logs:${
                  config.region
                }:${config.accountId()}:log-group:CdkStack-MyFargateServiceTaskDefwebLogGroup4A6C44E8-gASMJdvFOK38:*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName:
            "MyFargateServiceTaskDefExecutionRoleDefaultPolicyEC22B20F",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "CdkStack-MyFargateServiceTaskDefTaskRole62C7D397-GTVVNX6JAX97",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ecs-tasks.amazonaws.com",
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
                  "dynamodb:BatchWriteItem",
                  "dynamodb:PutItem",
                  "dynamodb:UpdateItem",
                  "dynamodb:DeleteItem",
                  "dynamodb:DescribeTable",
                ],
                Resource: [
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/CdkStack-DynamoTableB2B22E15-1T1CPCS57NG64`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "MyFargateServiceTaskDefTaskRoleDefaultPolicy4E7DAAD7",
        },
      ],
    }),
  },
];
