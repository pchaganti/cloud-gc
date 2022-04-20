// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "/aws/ecs/containerinsights/service-cluster/performance",
    properties: ({}) => ({
      retentionInDays: 1,
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "ECSServiceStack-amazonecssampleTaskDefwebLogGroup910AB31A-8KbSnk7Cuzfy",
    properties: ({}) => ({
      retentionInDays: 365,
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "ECSServiceStack-amazonecssampleTaskDefwebLogGroup910AB31A-gsrOrJO5GcFM",
    properties: ({}) => ({
      retentionInDays: 365,
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "ECSServiceStack-amazonecssampleTaskDefwebLogGroup910AB31A-lQ7R3SDZmRBi",
    properties: ({}) => ({
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
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/publicSubnet1",
    dependencies: () => ({
      subnet: "ECSServiceStack/SkeletonVpc/publicSubnet1",
      eip: "ECSServiceStack/SkeletonVpc/publicSubnet1",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/applicationSubnet1",
    properties: ({ config }) => ({
      CidrBlock: "172.31.32.0/20",
      AvailabilityZone: `${config.region}a`,
    }),
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/applicationSubnet2",
    properties: ({ config }) => ({
      CidrBlock: "172.31.48.0/20",
      AvailabilityZone: `${config.region}b`,
    }),
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/dataSubnet1",
    properties: ({ config }) => ({
      CidrBlock: "172.31.64.0/20",
      AvailabilityZone: `${config.region}a`,
    }),
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/dataSubnet2",
    properties: ({ config }) => ({
      CidrBlock: "172.31.80.0/20",
      AvailabilityZone: `${config.region}b`,
    }),
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/publicSubnet1",
    properties: ({ config }) => ({
      CidrBlock: "172.31.0.0/20",
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
    }),
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/publicSubnet2",
    properties: ({ config }) => ({
      CidrBlock: "172.31.16.0/20",
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
    }),
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/applicationSubnet1",
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/applicationSubnet2",
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/dataSubnet1",
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/dataSubnet2",
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/publicSubnet1",
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "ECSServiceStack/SkeletonVpc/publicSubnet2",
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "ECSServiceStack/SkeletonVpc/applicationSubnet1",
      subnet: "ECSServiceStack/SkeletonVpc/applicationSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "ECSServiceStack/SkeletonVpc/applicationSubnet2",
      subnet: "ECSServiceStack/SkeletonVpc/applicationSubnet2",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "ECSServiceStack/SkeletonVpc/dataSubnet1",
      subnet: "ECSServiceStack/SkeletonVpc/dataSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "ECSServiceStack/SkeletonVpc/dataSubnet2",
      subnet: "ECSServiceStack/SkeletonVpc/dataSubnet2",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "ECSServiceStack/SkeletonVpc/publicSubnet1",
      subnet: "ECSServiceStack/SkeletonVpc/publicSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "ECSServiceStack/SkeletonVpc/publicSubnet2",
      subnet: "ECSServiceStack/SkeletonVpc/publicSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "ECSServiceStack/SkeletonVpc/applicationSubnet1",
      natGateway: "ECSServiceStack/SkeletonVpc/publicSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "ECSServiceStack/SkeletonVpc/applicationSubnet2",
      natGateway: "ECSServiceStack/SkeletonVpc/publicSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "ECSServiceStack/SkeletonVpc/publicSubnet1",
      ig: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "ECSServiceStack/SkeletonVpc/publicSubnet2",
      ig: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "ECSServiceStack-amazonecssampleLBSecurityGroup55736652-DF8OON2J64PM",
    properties: ({}) => ({
      Description:
        "Automatically created Security Group for ELB ECSServiceStackamazonecssampleLB36F3E7CB",
    }),
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "ECSServiceStack-amazonecssampleServiceSecurityGroup120A1640-19GF52TMRSNVC",
    properties: ({}) => ({
      Description: "ECSServiceStack/amazon-ecs-sample/Service/SecurityGroup",
    }),
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
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
        "ECSServiceStack-amazonecssampleLBSecurityGroup55736652-DF8OON2J64PM",
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
        "ECSServiceStack-amazonecssampleServiceSecurityGroup120A1640-19GF52TMRSNVC",
      securityGroupFrom: [
        "ECSServiceStack-amazonecssampleLBSecurityGroup55736652-DF8OON2J64PM",
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
        "ECSServiceStack-amazonecssampleLBSecurityGroup55736652-DF8OON2J64PM",
      securityGroupFrom: [
        "ECSServiceStack-amazonecssampleServiceSecurityGroup120A1640-19GF52TMRSNVC",
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
    name: "service-cluster",
    properties: ({}) => ({
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
    name: "ECSServiceStackamazonecssampleTaskDef499685C5",
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
                "ECSServiceStack-amazonecssampleTaskDefwebLogGroup910AB31A-gsrOrJO5GcFM",
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
    dependencies: () => ({
      taskRole:
        "ECSServiceStack-amazonecssampleTaskDefTaskRole527D-1FZO0WSBRCE32",
      executionRole:
        "ECSServiceStack-amazonecssampleTaskDefExecutionRol-J2QX8M2WSOJS",
    }),
  },
  {
    type: "Service",
    group: "ECS",
    name: "ECSServiceStack-amazonecssampleService537E3215-Bnagarx67tDZ",
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
            group: "ELBv2",
            name: "ECSSe-amazo-319L9ODON698",
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
        "ECSServiceStack-amazonecssampleService537E3215-Bnagarx67tDZ",
    }),
    dependencies: () => ({
      cluster: "service-cluster",
      taskDefinition: "ECSServiceStackamazonecssampleTaskDef499685C5",
      subnets: [
        "ECSServiceStack/SkeletonVpc/applicationSubnet1",
        "ECSServiceStack/SkeletonVpc/applicationSubnet2",
      ],
      securityGroups: [
        "ECSServiceStack-amazonecssampleServiceSecurityGroup120A1640-19GF52TMRSNVC",
      ],
      targetGroups: ["ECSSe-amazo-319L9ODON698"],
    }),
  },
  {
    type: "LoadBalancer",
    group: "ELBv2",
    name: "ECSSe-amazo-39P7SGVM3CD7",
    properties: ({}) => ({
      Scheme: "internet-facing",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: () => ({
      subnets: [
        "ECSServiceStack/SkeletonVpc/publicSubnet1",
        "ECSServiceStack/SkeletonVpc/publicSubnet2",
      ],
      securityGroups: [
        "ECSServiceStack-amazonecssampleLBSecurityGroup55736652-DF8OON2J64PM",
      ],
    }),
  },
  {
    type: "TargetGroup",
    group: "ELBv2",
    name: "ECSSe-amazo-319L9ODON698",
    properties: ({}) => ({
      Protocol: "HTTP",
      Port: 80,
      HealthCheckProtocol: "HTTP",
      TargetType: "ip",
    }),
    dependencies: () => ({
      vpc: "ECSServiceStack/SkeletonVpc",
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
      loadBalancer: "ECSSe-amazo-39P7SGVM3CD7",
      targetGroup: "ECSSe-amazo-319L9ODON698",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "ECSServiceStack-amazonecssampleTaskDefExecutionRol-J2QX8M2WSOJS",
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
                Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
                Resource: `arn:aws:logs:${
                  config.region
                }:${config.accountId()}:log-group:ECSServiceStack-amazonecssampleTaskDefwebLogGroup910AB31A-gsrOrJO5GcFM:*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName:
            "amazonecssampleTaskDefExecutionRoleDefaultPolicyAFBFE89A",
        },
      ],
    }),
    dependencies: () => ({
      logGroups: [
        "ECSServiceStack-amazonecssampleTaskDefwebLogGroup910AB31A-gsrOrJO5GcFM",
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "ECSServiceStack-amazonecssampleTaskDefTaskRole527D-1FZO0WSBRCE32",
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
