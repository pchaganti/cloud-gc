// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "MetricAlarm",
    group: "CloudWatch",
    properties: ({}) => ({
      AlarmName: "eb-HighLatencyAlarm-16SJ5CRCBMBWI",
      AlarmDescription: "High Latency in Amazon EventBridge",
      MetricName: "IngestionToInvocationStartLatency-dev",
      Namespace: "AWS/Events",
      Statistic: "Average",
      Period: 60,
      EvaluationPeriods: 5,
      Threshold: 30000,
      ComparisonOperator: "GreaterThanThreshold",
      TreatMissingData: "breaching",
    }),
  },
  {
    type: "EventBus",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Name: "my-event-bus-dev",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Description: "EventRule",
      EventPattern: {
        "detail-type": ["something"],
        source: ["custom.myApp"],
      },
      Name: "bus-MyEventRule-68Z5LDD0YL3R",
    }),
    dependencies: ({}) => ({
      eventBus: "my-event-bus-dev",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "MySqsQueueArn-dev",
      InputPath: "$.detail",
    }),
    dependencies: ({}) => ({
      rule: "bus-MyEventRule-68Z5LDD0YL3R",
      sqsQueue: "sam-app-MySqsQueue-6uWWWYb8QqM1",
    }),
  },
  {
    type: "Endpoint",
    group: "EventBridge",
    properties: ({}) => ({
      Name: "MyEndpoint-dev",
      ReplicationConfig: {
        State: "DISABLED",
      },
      RoutingConfig: {
        FailoverConfig: {
          Primary: {},
          Secondary: {
            Route: "us-west-2",
          },
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "GlobalEndpointRole-dev",
      eventBuses: [
        { name: "my-event-bus-dev", provider: "aws-secondary" },
        "my-event-bus-dev",
      ],
      route53HealthCheck:
        "heathcheck::CLOUDWATCH_METRIC::eb-HighLatencyAlarm-16SJ5CRCBMBWI",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "GlobalEndpointRole-dev",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "events.amazonaws.com",
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
                  "events:PutRule",
                  "events:PutTargets",
                  "events:DeleteRule",
                  "events:RemoveTargets",
                ],
                Resource: `arn:aws:events:*:${config.accountId()}:rule/my-event-bus-dev/GlobalEndpointManagedRule-*`,
                Effect: "Allow",
              },
              {
                Action: ["events:PutEvents"],
                Resource: `arn:aws:events:*:${config.accountId()}:event-bus/my-event-bus-dev`,
                Effect: "Allow",
              },
              {
                Condition: {
                  StringLike: {
                    "iam:PassedToService": "events.amazonaws.com",
                  },
                },
                Action: ["iam:PassRole"],
                Resource: `arn:aws:iam::${config.accountId()}:role/service-role/GlobalEndpointRole-dev*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "AllowGlobalEndpoint",
        },
      ],
    }),
  },
  {
    type: "HealthCheck",
    group: "Route53",
    properties: ({}) => ({
      HealthCheckConfig: {
        Type: "CLOUDWATCH_METRIC",
        AlarmIdentifier: {
          Region: "us-east-1",
          Name: "eb-HighLatencyAlarm-16SJ5CRCBMBWI",
        },
        InsufficientDataHealthStatus: "Unhealthy",
      },
      CloudWatchAlarmConfiguration: {
        EvaluationPeriods: 5,
        Threshold: 30000,
        ComparisonOperator: "GreaterThanThreshold",
        Period: 60,
        MetricName: "IngestionToInvocationStartLatency-dev",
        Namespace: "AWS/Events",
        Statistic: "Average",
        Dimensions: [],
      },
    }),
    dependencies: ({}) => ({
      cloudWatchAlarm: "eb-HighLatencyAlarm-16SJ5CRCBMBWI",
    }),
  },
  {
    type: "Queue",
    group: "SQS",
    properties: ({}) => ({
      QueueName: "sam-app-MySqsQueue-6uWWWYb8QqM1",
      tags: {
        mame: "sam-app",
      },
    }),
  },
];
