// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName:
        "CdkStack-FargateServiceTaskDefwebLogGroup71FAF541-CKdn78sftM1n",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "CdkStack/Vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "CdkStack/Vpc" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "CdkStack/Vpc",
      internetGateway: "CdkStack/Vpc",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet1",
    dependencies: ({}) => ({
      subnet: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet1",
      eip: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet1",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet2",
    dependencies: ({}) => ({
      subnet: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet2",
      eip: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet2",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 2,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 2,
      NetworkNumber: 3,
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
      NewBits: 2,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
      NewBits: 2,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet1",
    dependencies: ({}) => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet2",
    dependencies: ({}) => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet1",
    dependencies: ({}) => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet2",
    dependencies: ({}) => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet1",
      subnet: "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet2",
      subnet: "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet2",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet1",
      subnet: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet2",
      subnet: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet1",
      natGateway: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet2",
      natGateway: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet1",
      ig: "CdkStack/Vpc",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet2",
      ig: "CdkStack/Vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName:
        "CdkStack-AuroraServerlessClusterSecurityGroup5A67466E-X9V6DZN5GHP3",
      Description: "RDS security group",
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "CdkStack-FargateServiceLBSecurityGroup5F444C78-KL8I9CO98SRN",
      Description:
        "Automatically created Security Group for ELB CdkStackFargateServiceLB29CE988E",
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "CdkStack-FargateServiceSecurityGroup262B61DD-WQDTLA5IPKHR",
      Description: "CdkStack/FargateService/Service/SecurityGroup",
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/Vpc",
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
        "sg::CdkStack/Vpc::CdkStack-FargateServiceLBSecurityGroup5F444C78-KL8I9CO98SRN",
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
        "sg::CdkStack/Vpc::CdkStack-FargateServiceSecurityGroup262B61DD-WQDTLA5IPKHR",
      securityGroupFrom: [
        "sg::CdkStack/Vpc::CdkStack-FargateServiceLBSecurityGroup5F444C78-KL8I9CO98SRN",
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
        "sg::CdkStack/Vpc::CdkStack-FargateServiceLBSecurityGroup5F444C78-KL8I9CO98SRN",
      securityGroupFrom: [
        "sg::CdkStack/Vpc::CdkStack-FargateServiceSecurityGroup262B61DD-WQDTLA5IPKHR",
      ],
    }),
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet1",
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet2",
  },
  {
    type: "Cluster",
    group: "ECS",
    properties: ({}) => ({
      clusterName: "CdkStack-ClusterEB0386A7-1MSjvijRu7By",
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
    properties: ({ config, getId }) => ({
      containerDefinitions: [
        {
          command: [],
          cpu: 0,
          dnsSearchDomains: [],
          dnsServers: [],
          dockerLabels: {},
          dockerSecurityOptions: [],
          entryPoint: [],
          environment: [
            {
              name: "dbClusterArn",
              value: `${getId({
                type: "DBCluster",
                group: "RDS",
                name: "cdkstack-auroraserverlessclusterb4a18ef1-apxidhewyaz0",
              })}`,
            },
            {
              name: "secretArn",
              value: `${getId({
                type: "Secret",
                group: "SecretsManager",
                name: "aurora-user-secret",
              })}`,
            },
            {
              name: "dbName",
              value: "aurora_db",
            },
          ],
          environmentFiles: [],
          essential: true,
          extraHosts: [],
          image: `840541460064.dkr.ecr.${config.region}.amazonaws.com/cdk-hnb659fds-container-assets-840541460064-${config.region}:ad758bca7c4674905c156fb09c1cdc499a660e8bd2f563b4a0987f2385ecaf90`,
          links: [],
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-group":
                "CdkStack-FargateServiceTaskDefwebLogGroup71FAF541-CKdn78sftM1n",
              "awslogs-region": `${config.region}`,
              "awslogs-stream-prefix": "FargateService",
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
      family: "CdkStackFargateServiceTaskDef2C533A52",
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
    dependencies: ({}) => ({
      taskRole: "CdkStack-FargateServiceTaskDefTaskRole8CDCF85E-1HTR9O8XQQI4P",
      executionRole:
        "CdkStack-FargateServiceTaskDefExecutionRole9194820-18VY1XIQQ7L55",
      secret: "aurora-user-secret",
      rdsDbCluster: "cdkstack-auroraserverlessclusterb4a18ef1-apxidhewyaz0",
    }),
  },
  {
    type: "Service",
    group: "ECS",
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
            group: "ElasticLoadBalancingV2",
            name: "CdkSt-Farga-1SEGM16UZSRPF",
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
      serviceName: "CdkStack-FargateServiceECC8084D-c9wCaLN6rjPU",
    }),
    dependencies: ({}) => ({
      cluster: "CdkStack-ClusterEB0386A7-1MSjvijRu7By",
      taskDefinition: "CdkStackFargateServiceTaskDef2C533A52",
      subnets: [
        "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet1",
        "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet2",
      ],
      securityGroups: [
        "sg::CdkStack/Vpc::CdkStack-FargateServiceSecurityGroup262B61DD-WQDTLA5IPKHR",
      ],
      targetGroups: ["CdkSt-Farga-1SEGM16UZSRPF"],
    }),
  },
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "CdkSt-Farga-SRS4XA0Y0M8",
      Scheme: "internet-facing",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: ({}) => ({
      subnets: [
        "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet1",
        "CdkStack/Vpc::CdkStack/Vpc/PublicSubnet2",
      ],
      securityGroups: [
        "sg::CdkStack/Vpc::CdkStack-FargateServiceLBSecurityGroup5F444C78-KL8I9CO98SRN",
      ],
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "CdkSt-Farga-1SEGM16UZSRPF",
      Protocol: "HTTP",
      Port: 80,
      HealthCheckProtocol: "HTTP",
      TargetType: "ip",
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/Vpc",
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
      loadBalancer: "CdkSt-Farga-SRS4XA0Y0M8",
      targetGroup: "CdkSt-Farga-1SEGM16UZSRPF",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName:
        "CdkStack-FargateServiceTaskDefExecutionRole9194820-18VY1XIQQ7L55",
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
                }:${config.accountId()}:log-group:CdkStack-FargateServiceTaskDefwebLogGroup71FAF541-CKdn78sftM1n:*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "FargateServiceTaskDefExecutionRoleDefaultPolicy827E7CA2",
        },
      ],
    }),
    dependencies: ({}) => ({
      logGroups: [
        "CdkStack-FargateServiceTaskDefwebLogGroup71FAF541-CKdn78sftM1n",
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ getId }) => ({
      RoleName: "CdkStack-FargateServiceTaskDefTaskRole8CDCF85E-1HTR9O8XQQI4P",
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
                  "rds-data:BatchExecuteStatement",
                  "rds-data:BeginTransaction",
                  "rds-data:CommitTransaction",
                  "rds-data:ExecuteStatement",
                  "rds-data:RollbackTransaction",
                ],
                Resource: `*`,
                Effect: "Allow",
              },
              {
                Action: [
                  "secretsmanager:GetSecretValue",
                  "secretsmanager:DescribeSecret",
                ],
                Resource: `${getId({
                  type: "Secret",
                  group: "SecretsManager",
                  name: "aurora-user-secret",
                })}`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "FargateServiceTaskDefTaskRoleDefaultPolicy63F83D6F",
        },
      ],
    }),
    dependencies: ({}) => ({
      secrets: ["aurora-user-secret"],
    }),
  },
  {
    type: "DBSubnetGroup",
    group: "RDS",
    properties: ({}) => ({
      DBSubnetGroupName:
        "cdkstack-auroraserverlessclustersubnets734af39a-c9biv9kwphqk",
      DBSubnetGroupDescription: "Subnets for AuroraServerlessCluster database",
    }),
    dependencies: ({}) => ({
      subnets: [
        "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet1",
        "CdkStack/Vpc::CdkStack/Vpc/PrivateSubnet2",
      ],
    }),
  },
  {
    type: "DBCluster",
    group: "RDS",
    properties: ({}) => ({
      BackupRetentionPeriod: 1,
      DatabaseName: "aurora_db",
      DBClusterIdentifier:
        "cdkstack-auroraserverlessclusterb4a18ef1-apxidhewyaz0",
      Engine: "aurora",
      EngineVersion: "5.6.10a",
      Port: 3306,
      MasterUsername:
        process.env
          .CDKSTACK_AURORASERVERLESSCLUSTERB4A18EF1_APXIDHEWYAZ0_MASTER_USERNAME,
      PreferredBackupWindow: "07:52-08:22",
      PreferredMaintenanceWindow: "fri:09:30-fri:10:00",
      IAMDatabaseAuthenticationEnabled: false,
      EngineMode: "serverless",
      DeletionProtection: false,
      HttpEndpointEnabled: false,
      ScalingConfiguration: {
        MinCapacity: 1,
        MaxCapacity: 2,
        AutoPause: true,
        SecondsUntilAutoPause: 600,
        TimeoutAction: "RollbackCapacityChange",
        SecondsBeforeTimeout: 300,
      },
      MasterUserPassword:
        process.env
          .CDKSTACK_AURORASERVERLESSCLUSTERB4A18EF1_APXIDHEWYAZ0_MASTER_USER_PASSWORD,
    }),
    dependencies: ({}) => ({
      dbSubnetGroup:
        "cdkstack-auroraserverlessclustersubnets734af39a-c9biv9kwphqk",
      securityGroups: [
        "sg::CdkStack/Vpc::CdkStack-AuroraServerlessClusterSecurityGroup5A67466E-X9V6DZN5GHP3",
      ],
      secret: "aurora-user-secret",
    }),
  },
  {
    type: "Secret",
    group: "SecretsManager",
    properties: ({ generatePassword }) => ({
      Name: "aurora-user-secret",
      SecretString: {
        password: generatePassword({ length: 30 }),
        dbname: "aurora_db",
        engine: "mysql",
        port: 3306,
        username: "admin",
      },
      Description: "RDS database auto-generated user password",
    }),
  },
];
