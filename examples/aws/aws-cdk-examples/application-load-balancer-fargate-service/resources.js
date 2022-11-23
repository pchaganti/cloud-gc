// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName:
        "ECSServiceStack-amazonecssampleTaskDefwebLogGroup910AB31A-Aka75VsMnKfI",
      retentionInDays: 365,
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc",
    properties: ({}) => ({
      CidrBlock: "172.31.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "InternetGateway",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc",
  },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
      internetGateway: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/publicSubnet1",
    properties: ({}) => ({
      PrivateIpAddressIndex: 714,
    }),
    dependencies: ({}) => ({
      subnet:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/publicSubnet1",
      eip: "ECSServiceStack/SkeletonVpc/publicSubnet1",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/applicationSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/applicationSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 4,
      NetworkNumber: 3,
    }),
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/dataSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 4,
    }),
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/dataSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 4,
      NetworkNumber: 5,
    }),
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/publicSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
      NewBits: 4,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/publicSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
      NewBits: 4,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/applicationSubnet1",
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/applicationSubnet2",
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/dataSubnet1",
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/dataSubnet2",
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/publicSubnet1",
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/publicSubnet2",
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/applicationSubnet1",
      subnet:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/applicationSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/applicationSubnet2",
      subnet:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/applicationSubnet2",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/dataSubnet1",
      subnet:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/dataSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/dataSubnet2",
      subnet:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/dataSubnet2",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/publicSubnet1",
      subnet:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/publicSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/publicSubnet2",
      subnet:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/publicSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "ECSServiceStack/SkeletonVpc/publicSubnet1",
      routeTable:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/applicationSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "ECSServiceStack/SkeletonVpc/publicSubnet1",
      routeTable:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/applicationSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "ECSServiceStack/SkeletonVpc",
      routeTable:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/publicSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "ECSServiceStack/SkeletonVpc",
      routeTable:
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/publicSubnet2",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName:
        "ECSServiceStack-amazonecssampleLBSecurityGroup55736652-JJ7IOCR1OO4S",
      Description:
        "Automatically created Security Group for ELB ECSServiceStackamazonecssampleLB36F3E7CB",
    }),
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName:
        "ECSServiceStack-amazonecssampleServiceSecurityGroup120A1640-WFLIEAOYUPIO",
      Description: "ECSServiceStack/amazon-ecs-sample/Service/SecurityGroup",
    }),
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
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
        "sg::ECSServiceStack/SkeletonVpc::ECSServiceStack-amazonecssampleLBSecurityGroup55736652-JJ7IOCR1OO4S",
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
        "sg::ECSServiceStack/SkeletonVpc::ECSServiceStack-amazonecssampleServiceSecurityGroup120A1640-WFLIEAOYUPIO",
      securityGroupFrom: [
        "sg::ECSServiceStack/SkeletonVpc::ECSServiceStack-amazonecssampleLBSecurityGroup55736652-JJ7IOCR1OO4S",
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
        "sg::ECSServiceStack/SkeletonVpc::ECSServiceStack-amazonecssampleLBSecurityGroup55736652-JJ7IOCR1OO4S",
      securityGroupFrom: [
        "sg::ECSServiceStack/SkeletonVpc::ECSServiceStack-amazonecssampleServiceSecurityGroup120A1640-WFLIEAOYUPIO",
      ],
    }),
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/publicSubnet1",
  },
  {
    type: "Cluster",
    group: "ECS",
    properties: ({}) => ({
      clusterName: "service-cluster",
      settings: [
        {
          name: "containerInsights",
          value: "enabled",
        },
      ],
    }),
  },
  {
    type: "TaskDefinition",
    group: "ECS",
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
          image: "amazon/amazon-ecs-sample",
          links: [],
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-group":
                "ECSServiceStack-amazonecssampleTaskDefwebLogGroup910AB31A-Aka75VsMnKfI",
              "awslogs-region": `${config.region}`,
              "awslogs-stream-prefix": "ECSServiceStack",
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
      family: "ECSServiceStackamazonecssampleTaskDef499685C5",
      memory: "1024",
      networkMode: "awsvpc",
      requiresAttributes: [
        {
          name: "com.amazonaws.ecs.capability.logging-driver.awslogs",
        },
        {
          name: "ecs.capability.execution-role-awslogs",
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
          name: "com.amazonaws.ecs.capability.docker-remote-api.1.18",
        },
        {
          name: "ecs.capability.task-eni",
        },
      ],
      requiresCompatibilities: ["FARGATE"],
    }),
    dependencies: ({}) => ({
      taskRole:
        "ECSServiceStack-amazonecssampleTaskDefTaskRole527D-1JLMLL2357T0V",
      executionRole:
        "ECSServiceStack-amazonecssampleTaskDefExecutionRol-1391KZSJLULK2",
    }),
  },
  {
    type: "Service",
    group: "ECS",
    properties: ({ getId }) => ({
      deploymentConfiguration: {
        deploymentCircuitBreaker: {
          enable: true,
          rollback: true,
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
            name: "ECSSe-amazo-1HU1HZ8BFKNTJ",
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
      serviceName:
        "ECSServiceStack-amazonecssampleService537E3215-6H3vkrpqYP3l",
    }),
    dependencies: ({}) => ({
      cluster: "service-cluster",
      taskDefinition: "ECSServiceStackamazonecssampleTaskDef499685C5",
      subnets: [
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/applicationSubnet1",
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/applicationSubnet2",
      ],
      securityGroups: [
        "sg::ECSServiceStack/SkeletonVpc::ECSServiceStack-amazonecssampleServiceSecurityGroup120A1640-WFLIEAOYUPIO",
      ],
      targetGroups: ["ECSSe-amazo-1HU1HZ8BFKNTJ"],
    }),
  },
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "ECSSe-amazo-NBIYVNWJ9TTY",
      Scheme: "internet-facing",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: ({}) => ({
      subnets: [
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/publicSubnet1",
        "ECSServiceStack/SkeletonVpc::ECSServiceStack/SkeletonVpc/publicSubnet2",
      ],
      securityGroups: [
        "sg::ECSServiceStack/SkeletonVpc::ECSServiceStack-amazonecssampleLBSecurityGroup55736652-JJ7IOCR1OO4S",
      ],
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "ECSSe-amazo-1HU1HZ8BFKNTJ",
      Protocol: "HTTP",
      Port: 80,
      HealthCheckProtocol: "HTTP",
      TargetType: "ip",
    }),
    dependencies: ({}) => ({
      vpc: "ECSServiceStack/SkeletonVpc",
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
      loadBalancer: "ECSSe-amazo-NBIYVNWJ9TTY",
      targetGroup: "ECSSe-amazo-1HU1HZ8BFKNTJ",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName:
        "ECSServiceStack-amazonecssampleTaskDefExecutionRol-1391KZSJLULK2",
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
                Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
                Resource: `arn:aws:logs:${
                  config.region
                }:${config.accountId()}:log-group:ECSServiceStack-amazonecssampleTaskDefwebLogGroup910AB31A-Aka75VsMnKfI:*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName:
            "amazonecssampleTaskDefExecutionRoleDefaultPolicyAFBFE89A",
        },
      ],
    }),
    dependencies: ({}) => ({
      logGroups: [
        "ECSServiceStack-amazonecssampleTaskDefwebLogGroup910AB31A-Aka75VsMnKfI",
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "ECSServiceStack-amazonecssampleTaskDefTaskRole527D-1JLMLL2357T0V",
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
    }),
  },
];
