// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Application",
    group: "ElasticBeanstalk",
    properties: ({}) => ({
      ApplicationName: "my-app",
      Versions: ["Sample Application"],
      ConfigurationTemplates: [],
    }),
  },
  {
    type: "ApplicationVersion",
    group: "ElasticBeanstalk",
    properties: ({}) => ({
      ApplicationName: "my-app",
      VersionLabel: "Sample Application",
      SourceBundle: {
        S3Bucket: "elasticbeanstalk-us-east-1",
        S3Key: "GenericSampleApplication",
      },
    }),
    dependencies: ({}) => ({
      application: "my-app",
    }),
  },
  {
    type: "Environment",
    group: "ElasticBeanstalk",
    properties: ({}) => ({
      EnvironmentName: "Myapp-env",
      ApplicationName: "my-app",
      SolutionStackName: "64bit Amazon Linux 2 v5.6.0 running Node.js 16",
      PlatformArn:
        "arn:aws:elasticbeanstalk:us-east-1::platform/Node.js 16 running on 64bit Amazon Linux 2/5.6.0",
      Tier: {
        Name: "WebServer",
        Type: "Standard",
        Version: "1.0",
      },
      EnvironmentLinks: [],
    }),
    dependencies: ({}) => ({
      application: "my-app",
    }),
  },
];
