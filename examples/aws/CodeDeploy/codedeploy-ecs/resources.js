// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Application",
    group: "CodeDeploy",
    properties: ({}) => ({
      applicationName: "AppECS-cluster-api",
      computePlatform: "ECS",
    }),
  },
  {
    type: "DeploymentGroup",
    group: "CodeDeploy",
    properties: ({ getId }) => ({
      applicationName: "AppECS-cluster-api",
      autoRollbackConfiguration: {
        enabled: true,
        events: ["DEPLOYMENT_FAILURE", "DEPLOYMENT_STOP_ON_REQUEST"],
      },
      blueGreenDeploymentConfiguration: {
        deploymentReadyOption: {
          actionOnTimeout: "CONTINUE_DEPLOYMENT",
          waitTimeInMinutes: 0,
        },
        terminateBlueInstancesOnDeploymentSuccess: {
          action: "TERMINATE",
          terminationWaitTimeInMinutes: 60,
        },
      },
      computePlatform: "ECS",
      deploymentConfigName: "CodeDeployDefault.ECSAllAtOnce",
      deploymentGroupName: "DgpECS-cluster-api",
      deploymentStyle: {
        deploymentOption: "WITH_TRAFFIC_CONTROL",
        deploymentType: "BLUE_GREEN",
      },
      ecsServices: [
        {
          clusterName: `${getId({
            type: "Cluster",
            group: "ECS",
            name: "cluster",
            path: "name",
          })}`,
          serviceName: `${getId({
            type: "Service",
            group: "ECS",
            name: "api",
            path: "name",
          })}`,
        },
      ],
      loadBalancerInfo: {
        targetGroupPairInfoList: [
          {
            prodTrafficRoute: {
              listenerArns: [
                `${getId({
                  type: "Listener",
                  group: "ElasticLoadBalancingV2",
                  name: "listener::EC2Co-EcsEl-GK4BG406T8NP::HTTP::80",
                })}`,
              ],
            },
            targetGroups: [
              {
                name: `${getId({
                  type: "TargetGroup",
                  group: "ElasticLoadBalancingV2",
                  name: "EC2Co-Defau-MMUISWY3DEAQ",
                  path: "name",
                })}`,
              },
              {
                name: `${getId({
                  type: "TargetGroup",
                  group: "ElasticLoadBalancingV2",
                  name: "tg-cluste-api-2",
                  path: "name",
                })}`,
              },
            ],
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      application: "AppECS-cluster-api",
      serviceRole: "roleECSCodeDeploy",
      ecsServices: ["api"],
      ecsClusters: ["cluster"],
      targetGroups: ["EC2Co-Defau-MMUISWY3DEAQ", "tg-cluste-api-2"],
      listeners: ["listener::EC2Co-EcsEl-GK4BG406T8NP::HTTP::80"],
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "ECS cluster - VPC",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      Tags: [
        {
          Key: "Description",
          Value: "Created for ECS cluster cluster",
        },
      ],
      DnsHostnames: true,
    }),
  },
  {
    type: "InternetGateway",
    group: "EC2",
    name: "ECS cluster - InternetGateway",
    properties: ({}) => ({
      Tags: [
        {
          Key: "Description",
          Value: "Created for ECS cluster cluster",
        },
      ],
    }),
  },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "ECS cluster - VPC",
      internetGateway: "ECS cluster - InternetGateway",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECS cluster - Public Subnet 1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      Tags: [
        {
          Key: "Description",
          Value: "Created for ECS cluster cluster",
        },
      ],
      NewBits: 8,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "ECS cluster - VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "ECS cluster - Public Subnet 2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      Tags: [
        {
          Key: "Description",
          Value: "Created for ECS cluster cluster",
        },
      ],
      NewBits: 8,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "ECS cluster - VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "ECS cluster - RouteTable",
    properties: ({}) => ({
      Tags: [
        {
          Key: "Description",
          Value: "Created for ECS cluster cluster",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "ECS cluster - VPC",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "ECS cluster - VPC::ECS cluster - RouteTable",
      subnet: "ECS cluster - VPC::ECS cluster - Public Subnet 1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "ECS cluster - VPC::ECS cluster - RouteTable",
      subnet: "ECS cluster - VPC::ECS cluster - Public Subnet 2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "ECS cluster - InternetGateway",
      routeTable: "ECS cluster - VPC::ECS cluster - RouteTable",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "api-1918",
      Description: "2022-07-07T14:15:54.339Z",
    }),
    dependencies: ({}) => ({
      vpc: "ECS cluster - VPC",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "EC2ContainerService-cluster-AlbSecurityGroup-1IB1H9AA9Q89C",
      Description: "ELB Allowed Ports",
      Tags: [
        {
          Key: "Description",
          Value: "Created for ECS cluster cluster",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "ECS cluster - VPC",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "EC2ContainerService-cluster-EcsSecurityGroup-8PVOS9BE4BIM",
      Description: "ECS Allowed Ports",
      Tags: [
        {
          Key: "Description",
          Value: "Created for ECS cluster cluster",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "ECS cluster - VPC",
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
        },
      ],
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::ECS cluster - VPC::api-1918",
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
        },
      ],
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::ECS cluster - VPC::EC2ContainerService-cluster-AlbSecurityGroup-1IB1H9AA9Q89C",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 1,
      IpProtocol: "tcp",
      ToPort: 65535,
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::ECS cluster - VPC::EC2ContainerService-cluster-EcsSecurityGroup-8PVOS9BE4BIM",
      securityGroupFrom: [
        "sg::ECS cluster - VPC::EC2ContainerService-cluster-AlbSecurityGroup-1IB1H9AA9Q89C",
      ],
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
        },
      ],
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::ECS cluster - VPC::EC2ContainerService-cluster-EcsSecurityGroup-8PVOS9BE4BIM",
    }),
  },
  {
    type: "Cluster",
    group: "ECS",
    properties: ({}) => ({
      clusterName: "cluster",
      settings: [
        {
          name: "containerInsights",
          value: "disabled",
        },
      ],
    }),
  },
  {
    type: "Service",
    group: "ECS",
    properties: ({ getId }) => ({
      deploymentConfiguration: {
        maximumPercent: 200,
        minimumHealthyPercent: 100,
      },
      deploymentController: {
        type: "CODE_DEPLOY",
      },
      desiredCount: 1,
      enableECSManagedTags: true,
      enableExecuteCommand: false,
      healthCheckGracePeriodSeconds: 0,
      launchType: "FARGATE",
      loadBalancers: [
        {
          containerName: "sample-app",
          containerPort: 80,
          targetGroupArn: `${getId({
            type: "TargetGroup",
            group: "ElasticLoadBalancingV2",
            name: "EC2Co-Defau-MMUISWY3DEAQ",
          })}`,
        },
      ],
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "ENABLED",
        },
      },
      platformFamily: "Linux",
      platformVersion: "1.4.0",
      schedulingStrategy: "REPLICA",
      serviceName: "api",
    }),
    dependencies: ({}) => ({
      cluster: "cluster",
      taskDefinition: "first-run-task-definition",
      subnets: [
        "ECS cluster - VPC::ECS cluster - Public Subnet 1",
        "ECS cluster - VPC::ECS cluster - Public Subnet 2",
      ],
      securityGroups: ["sg::ECS cluster - VPC::api-1918"],
      targetGroups: ["EC2Co-Defau-MMUISWY3DEAQ"],
    }),
  },
  {
    type: "TaskDefinition",
    group: "ECS",
    properties: ({ config }) => ({
      containerDefinitions: [
        {
          command: [
            "/bin/sh -c \"echo '<html> <head> <title>Amazon ECS Sample App</title> <style>body {margin-top: 40px; background-color: #333;} </style> </head><body> <div style=color:white;text-align:center> <h1>Amazon ECS Sample App</h1> <h2>Congratulations!</h2> <p>Your application is now running on a container in Amazon ECS.</p> </div></body></html>' >  /usr/local/apache2/htdocs/index.html && httpd-foreground\"",
          ],
          cpu: 256,
          entryPoint: ["sh", "-c"],
          essential: true,
          image: "httpd:2.4",
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-group": "/ecs/first-run-task-definition",
              "awslogs-region": `${config.region}`,
              "awslogs-stream-prefix": "ecs",
            },
          },
          memoryReservation: 512,
          name: "sample-app",
          portMappings: [
            {
              containerPort: 80,
              hostPort: 80,
              protocol: "tcp",
            },
          ],
        },
      ],
      cpu: "256",
      family: "first-run-task-definition",
      memory: "512",
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
          name: "com.amazonaws.ecs.capability.docker-remote-api.1.21",
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
      executionRole: "ecsTaskExecutionRole",
    }),
  },
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "EC2Co-EcsEl-GK4BG406T8NP",
      Scheme: "internet-facing",
      Type: "application",
      IpAddressType: "ipv4",
      Tags: [
        {
          Key: "Description",
          Value: "Created for ECS cluster cluster",
        },
      ],
    }),
    dependencies: ({}) => ({
      subnets: [
        "ECS cluster - VPC::ECS cluster - Public Subnet 1",
        "ECS cluster - VPC::ECS cluster - Public Subnet 2",
      ],
      securityGroups: [
        "sg::ECS cluster - VPC::EC2ContainerService-cluster-AlbSecurityGroup-1IB1H9AA9Q89C",
      ],
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "EC2Co-Defau-MMUISWY3DEAQ",
      Protocol: "HTTP",
      Port: 80,
      HealthCheckProtocol: "HTTP",
      TargetType: "ip",
      Tags: [
        {
          Key: "Description",
          Value: "Created for ECS cluster cluster",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "ECS cluster - VPC",
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "tg-cluste-api-2",
      Protocol: "HTTP",
      Port: 80,
      HealthCheckProtocol: "HTTP",
      TargetType: "ip",
    }),
    dependencies: ({}) => ({
      vpc: "ECS cluster - VPC",
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "tg2",
      Protocol: "HTTP",
      Port: 80,
      HealthCheckProtocol: "HTTP",
      TargetType: "ip",
    }),
    dependencies: ({}) => ({
      vpc: "ECS cluster - VPC",
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
      loadBalancer: "EC2Co-EcsEl-GK4BG406T8NP",
      targetGroup: "EC2Co-Defau-MMUISWY3DEAQ",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "ecsTaskExecutionRole",
      AssumeRolePolicyDocument: {
        Version: "2008-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "ecs-tasks.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonECSTaskExecutionRolePolicy",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "roleECSCodeDeploy",
      Description:
        "Allows CodeDeploy to read S3 objects, invoke Lambda functions, publish to SNS topics, and update ECS services on your behalf.",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "codedeploy.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AWSCodeDeployRoleForECS",
          PolicyArn: "arn:aws:iam::aws:policy/AWSCodeDeployRoleForECS",
        },
      ],
    }),
  },
];
