// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    name: "ApigwFargate",
    properties: ({}) => ({
      Description:
        "Integration between apigw and Application Load-Balanced Fargate Service",
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    name: "$default",
    properties: ({}) => ({
      AutoDeploy: true,
    }),
    dependencies: () => ({
      api: "ApigwFargate",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "VPC_LINK",
      Description: "API Integration with AWS Fargate Service",
      IntegrationMethod: "GET",
      IntegrationType: "HTTP_PROXY",
      PayloadFormatVersion: "1.0",
      RequestTemplates: {},
    }),
    dependencies: () => ({
      api: "ApigwFargate",
      listener: "listener::CdkSt-MyFar-RZX6AW5H3B08::HTTP::80",
      vpcLink: "V2 VPC Link",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteKey: "GET /",
    }),
    dependencies: () => ({
      api: "ApigwFargate",
      integration:
        "integration::ApigwFargate::listener::CdkSt-MyFar-RZX6AW5H3B08::HTTP::80",
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Description:
        "Automatic deployment triggered by changes to the Api configuration",
      AutoDeployed: true,
    }),
    dependencies: () => ({
      api: "ApigwFargate",
      stage: "$default",
    }),
  },
  {
    type: "VpcLink",
    group: "ApiGatewayV2",
    name: "V2 VPC Link",
    dependencies: () => ({
      subnets: [
        "CdkStack/MyVpc/PrivateSubnet1",
        "CdkStack/MyVpc/PrivateSubnet2",
      ],
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "CdkStack-MyFargateServiceTaskDefwebLogGroup4A6C44E8-0cga6xIMrwPR",
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
  {
    type: "InternetGateway",
    group: "EC2",
    name: "CdkStack/MyVpc",
    dependencies: () => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet1",
    dependencies: () => ({
      subnet: "CdkStack/MyVpc/PublicSubnet1",
      eip: "CdkStack/MyVpc/PublicSubnet1",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet2",
    dependencies: () => ({
      subnet: "CdkStack/MyVpc/PublicSubnet2",
      eip: "CdkStack/MyVpc/PublicSubnet2",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/MyVpc/PrivateSubnet1",
    properties: ({ config }) => ({
      CidrBlock: "10.0.128.0/18",
      AvailabilityZone: `${config.region}a`,
    }),
    dependencies: () => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/MyVpc/PrivateSubnet2",
    properties: ({ config }) => ({
      CidrBlock: "10.0.192.0/18",
      AvailabilityZone: `${config.region}b`,
    }),
    dependencies: () => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet1",
    properties: ({ config }) => ({
      CidrBlock: "10.0.0.0/18",
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
    }),
    dependencies: () => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet2",
    properties: ({ config }) => ({
      CidrBlock: "10.0.64.0/18",
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
    }),
    dependencies: () => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/MyVpc/PrivateSubnet1",
    dependencies: () => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/MyVpc/PrivateSubnet2",
    dependencies: () => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet1",
    dependencies: () => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet2",
    dependencies: () => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "CdkStack/MyVpc/PrivateSubnet1",
      subnet: "CdkStack/MyVpc/PrivateSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "CdkStack/MyVpc/PrivateSubnet2",
      subnet: "CdkStack/MyVpc/PrivateSubnet2",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "CdkStack/MyVpc/PublicSubnet1",
      subnet: "CdkStack/MyVpc/PublicSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "CdkStack/MyVpc/PublicSubnet2",
      subnet: "CdkStack/MyVpc/PublicSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "CdkStack/MyVpc/PrivateSubnet1",
      natGateway: "CdkStack/MyVpc/PublicSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "CdkStack/MyVpc/PrivateSubnet2",
      natGateway: "CdkStack/MyVpc/PublicSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "CdkStack/MyVpc/PublicSubnet1",
      ig: "CdkStack/MyVpc",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "CdkStack/MyVpc/PublicSubnet2",
      ig: "CdkStack/MyVpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-ADIRE45C9XJE",
    properties: ({}) => ({
      Description:
        "Automatically created Security Group for ELB CdkStackMyFargateServiceLBE7D87832",
    }),
    dependencies: () => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "CdkStack-MyFargateServiceSecurityGroup7016792A-VTFXV0IBDK1Z",
    properties: ({}) => ({
      Description: "CdkStack/MyFargateService/Service/SecurityGroup",
    }),
    dependencies: () => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 80,
        IpProtocol: "tcp",
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
            Description: "Allow from anyone on port 80",
          },
        ],
        ToPort: 80,
      },
    }),
    dependencies: () => ({
      securityGroup:
        "CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-ADIRE45C9XJE",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 80,
        IpProtocol: "tcp",
        ToPort: 80,
      },
    }),
    dependencies: () => ({
      securityGroup:
        "CdkStack-MyFargateServiceSecurityGroup7016792A-VTFXV0IBDK1Z",
      securityGroupFrom: [
        "CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-ADIRE45C9XJE",
      ],
    }),
  },
  {
    type: "SecurityGroupRuleEgress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 80,
        IpProtocol: "tcp",
        ToPort: 80,
      },
    }),
    dependencies: () => ({
      securityGroup:
        "CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-ADIRE45C9XJE",
      securityGroupFrom: [
        "CdkStack-MyFargateServiceSecurityGroup7016792A-VTFXV0IBDK1Z",
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
    type: "Cluster",
    group: "ECS",
    name: "CdkStack-MyCluster4C1BA579-fZi4x9tf2fSV",
    properties: ({}) => ({
      settings: [
        {
          name: "containerInsights",
          value: "disabled",
        },
      ],
    }),
  },
  {
    type: "TaskDefinition",
    group: "ECS",
    name: "CdkStackMyFargateServiceTaskDef846A07DE",
    properties: ({ config }) => ({
      containerDefinitions: [
        {
          command: [],
          cpu: 0,
          dnsSearchDomains: [],
          dnsServers: [],
          dockerLabels: {},
          dockerSecurityOptions: [],
          entryPoint: [],
          environment: [],
          environmentFiles: [],
          essential: true,
          extraHosts: [],
          image:
            "840541460064.dkr.ecr.us-east-1.amazonaws.com/cdk-hnb659fds-container-assets-840541460064-us-east-1:c92a96870c09f92be4993ff173af782a6532353f176ae3a033f1b0a1c6bab043",
          links: [],
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-group":
                "CdkStack-MyFargateServiceTaskDefwebLogGroup4A6C44E8-0cga6xIMrwPR",
              "awslogs-region": `${config.region}`,
              "awslogs-stream-prefix": "MyFargateService",
            },
            secretOptions: [],
          },
          mountPoints: [],
          name: "web",
          portMappings: [
            {
              containerPort: 80,
              hostPort: 80,
              protocol: "tcp",
            },
          ],
          secrets: [],
          systemControls: [],
          ulimits: [],
          volumesFrom: [],
        },
      ],
      cpu: "512",
      family: "CdkStackMyFargateServiceTaskDef846A07DE",
      memory: "2048",
      networkMode: "awsvpc",
      requiresAttributes: [
        {
          name: "com.amazonaws.ecs.capability.logging-driver.awslogs",
        },
        {
          name: "ecs.capability.execution-role-awslogs",
        },
        {
          name: "com.amazonaws.ecs.capability.ecr-auth",
        },
        {
          name: "com.amazonaws.ecs.capability.docker-remote-api.1.19",
        },
        {
          name: "com.amazonaws.ecs.capability.docker-remote-api.1.17",
        },
        {
          name: "com.amazonaws.ecs.capability.task-iam-role",
        },
        {
          name: "ecs.capability.execution-role-ecr-pull",
        },
        {
          name: "com.amazonaws.ecs.capability.docker-remote-api.1.18",
        },
        {
          name: "ecs.capability.task-eni",
        },
      ],
      requiresCompatibilities: ["FARGATE"],
    }),
    dependencies: () => ({
      taskRole:
        "CdkStack-MyFargateServiceTaskDefTaskRole62C7D397-1ESH968PSU9BX",
      executionRole:
        "CdkStack-MyFargateServiceTaskDefExecutionRoleD6305-1DPVFNV7DEJTX",
    }),
  },
  {
    type: "Service",
    group: "ECS",
    name: "CdkStack-MyFargateServiceF490C034-ChqvqbMg0Rkx",
    properties: ({ getId }) => ({
      deploymentConfiguration: {
        deploymentCircuitBreaker: {
          enable: false,
          rollback: false,
        },
        maximumPercent: 200,
        minimumHealthyPercent: 50,
      },
      desiredCount: 1,
      enableECSManagedTags: false,
      enableExecuteCommand: false,
      healthCheckGracePeriodSeconds: 60,
      launchType: "FARGATE",
      loadBalancers: [
        {
          containerName: "web",
          containerPort: 80,
          targetGroupArn: `${getId({
            type: "TargetGroup",
            group: "ELBv2",
            name: "CdkSt-MyFar-JZPHMT1E0V5K",
          })}`,
        },
      ],
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "DISABLED",
        },
      },
      placementConstraints: [],
      placementStrategy: [],
      platformFamily: "Linux",
      platformVersion: "LATEST",
      schedulingStrategy: "REPLICA",
      serviceName: "CdkStack-MyFargateServiceF490C034-ChqvqbMg0Rkx",
    }),
    dependencies: () => ({
      cluster: "CdkStack-MyCluster4C1BA579-fZi4x9tf2fSV",
      taskDefinition: "CdkStackMyFargateServiceTaskDef846A07DE",
      subnets: [
        "CdkStack/MyVpc/PrivateSubnet1",
        "CdkStack/MyVpc/PrivateSubnet2",
      ],
      securityGroups: [
        "CdkStack-MyFargateServiceSecurityGroup7016792A-VTFXV0IBDK1Z",
      ],
      targetGroups: ["CdkSt-MyFar-JZPHMT1E0V5K"],
    }),
  },
  {
    type: "LoadBalancer",
    group: "ELBv2",
    name: "CdkSt-MyFar-RZX6AW5H3B08",
    properties: ({}) => ({
      Scheme: "internal",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: () => ({
      subnets: [
        "CdkStack/MyVpc/PrivateSubnet1",
        "CdkStack/MyVpc/PrivateSubnet2",
      ],
      securityGroups: [
        "CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-ADIRE45C9XJE",
      ],
    }),
  },
  {
    type: "TargetGroup",
    group: "ELBv2",
    name: "CdkSt-MyFar-JZPHMT1E0V5K",
    properties: ({}) => ({
      Protocol: "HTTP",
      Port: 80,
      HealthCheckProtocol: "HTTP",
      TargetType: "ip",
    }),
    dependencies: () => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "Listener",
    group: "ELBv2",
    properties: ({}) => ({
      Port: 80,
      Protocol: "HTTP",
    }),
    dependencies: () => ({
      loadBalancer: "CdkSt-MyFar-RZX6AW5H3B08",
      targetGroup: "CdkSt-MyFar-JZPHMT1E0V5K",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "CdkStack-MyFargateServiceTaskDefExecutionRoleD6305-1DPVFNV7DEJTX",
    properties: ({ config }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `ecs-tasks.amazonaws.com`,
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
                Resource: `*`,
                Effect: "Allow",
              },
              {
                Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
                Resource: `arn:aws:logs:${
                  config.region
                }:${config.accountId()}:log-group:CdkStack-MyFargateServiceTaskDefwebLogGroup4A6C44E8-0cga6xIMrwPR:*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName:
            "MyFargateServiceTaskDefExecutionRoleDefaultPolicyEC22B20F",
        },
      ],
    }),
    dependencies: () => ({
      logGroups: [
        "CdkStack-MyFargateServiceTaskDefwebLogGroup4A6C44E8-0cga6xIMrwPR",
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "CdkStack-MyFargateServiceTaskDefTaskRole62C7D397-1ESH968PSU9BX",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `ecs-tasks.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
  },
];
