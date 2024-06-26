// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "MetricAlarm",
    group: "CloudWatch",
    properties: ({ config, getId }) => ({
      AlarmActions: [
        `arn:aws:sns:${
          config.region
        }:${config.accountId()}:Default_CloudWatch_Alarms_Topic`,
        `arn:aws:swf:${
          config.region
        }:${config.accountId()}:action/actions/AWS_EC2.InstanceId.Reboot/1.0`,
      ],
      AlarmName: "alarm-stop-ec2",
      ComparisonOperator: "LessThanOrEqualToThreshold",
      DatapointsToAlarm: 1,
      Dimensions: [
        {
          Value: `${getId({
            type: "Instance",
            group: "EC2",
            name: "ec2-for-alarm",
          })}`,
          Name: "InstanceId",
        },
      ],
      EvaluationPeriods: 1,
      MetricName: "CPUUtilization",
      Namespace: "AWS/EC2",
      Period: 300,
      Statistic: "Average",
      Threshold: 5,
      TreatMissingData: "missing",
    }),
    dependencies: ({}) => ({
      snsTopicAlarmActions: "Default_CloudWatch_Alarms_Topic",
      ec2Instance: "ec2-for-alarm",
    }),
  },
  {
    type: "Instance",
    group: "EC2",
    name: "ec2-for-alarm",
    properties: ({ config, getId }) => ({
      Image: {
        Description:
          "Amazon Linux 2 Kernel 5.10 AMI 2.0.20220606.1 x86_64 HVM gp2",
      },
      InstanceType: "t2.micro",
      NetworkInterfaces: [
        {
          DeviceIndex: 0,
          Groups: [
            `${getId({
              type: "SecurityGroup",
              group: "EC2",
              name: "sg::vpc-default::launch-wizard-1",
            })}`,
          ],
          SubnetId: `${getId({
            type: "Subnet",
            group: "EC2",
            name: "vpc-default::subnet-default-d",
          })}`,
        },
      ],
      Placement: {
        AvailabilityZone: `${config.region}d`,
      },
    }),
    dependencies: ({}) => ({
      subnets: ["vpc-default::subnet-default-d"],
      securityGroups: ["sg::vpc-default::launch-wizard-1"],
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "launch-wizard-1",
      Description: "launch-wizard created 2022-07-05T08:27:57.051Z",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 22,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      ToPort: 22,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc-default::launch-wizard-1",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-d",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  { type: "Vpc", group: "EC2", name: "vpc-default", isDefault: true },
  { type: "Topic", group: "SNS", name: "Default_CloudWatch_Alarms_Topic" },
];
