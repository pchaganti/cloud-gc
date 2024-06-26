// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Distribution",
    group: "CloudFront",
    properties: ({ config, getId }) => ({
      DefaultRootObject: "",
      Origins: {
        Items: [
          {
            Id: "CloudfrontLambdaEdgeCdkPythonStackMyDistributionOrigin14A5ED72A",
            DomainName: `cloudfrontlambdaedgecdkpy-myhostingbucket134f0bf0-x148i0ljl82b.s3.${config.region}.amazonaws.com`,
            OriginPath: "",
            CustomHeaders: {
              Quantity: 0,
            },
            S3OriginConfig: {
              OriginAccessIdentity: `origin-access-identity/cloudfront/${getId({
                type: "OriginAccessIdentity",
                group: "CloudFront",
                name: "Identity for CloudfrontLambdaEdgeCdkPythonStackMyDistributionOrigin14A5ED72A",
              })}`,
            },
            ConnectionAttempts: 3,
            ConnectionTimeout: 10,
            OriginShield: {
              Enabled: false,
            },
            OriginAccessControlId: "",
          },
        ],
      },
      DefaultCacheBehavior: {
        TargetOriginId:
          "CloudfrontLambdaEdgeCdkPythonStackMyDistributionOrigin14A5ED72A",
        TrustedSigners: {
          Enabled: false,
        },
        TrustedKeyGroups: {
          Enabled: false,
        },
        ViewerProtocolPolicy: "allow-all",
        AllowedMethods: {
          Quantity: 2,
          Items: ["HEAD", "GET"],
          CachedMethods: {
            Quantity: 2,
            Items: ["HEAD", "GET"],
          },
        },
        SmoothStreaming: false,
        Compress: true,
        LambdaFunctionAssociations: {
          Items: [
            {
              LambdaFunctionARN: `arn:aws:lambda:${
                config.region
              }:${config.accountId()}:function:CloudfrontLambdaEdgeCdkPythonSt-LambdaEdge6A7A1843-wys4Xq7Szfxn:1`,
              EventType: "origin-request",
              IncludeBody: false,
            },
          ],
        },
        FieldLevelEncryptionId: "",
        CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
      },
      Comment: "Dynamic content generation using Lambda@Edge",
      PriceClass: "PriceClass_All",
      ViewerCertificate: {
        CloudFrontDefaultCertificate: true,
        SSLSupportMethod: "vip",
        MinimumProtocolVersion: "TLSv1",
        CertificateSource: "cloudfront",
      },
    }),
    dependencies: ({}) => ({
      buckets: [
        "cloudfrontlambdaedgecdkpy-myhostingbucket134f0bf0-x148i0ljl82b",
      ],
      lambdaFunctions: [
        "CloudfrontLambdaEdgeCdkPythonSt-LambdaEdge6A7A1843-wys4Xq7Szfxn",
      ],
      originAccessIdentities: [
        "Identity for CloudfrontLambdaEdgeCdkPythonStackMyDistributionOrigin14A5ED72A",
      ],
    }),
  },
  {
    type: "OriginAccessIdentity",
    group: "CloudFront",
    name: "Identity for CloudfrontLambdaEdgeCdkPythonStackMyDistributionOrigin14A5ED72A",
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "CloudfrontLambdaEdgeCdkPy-LambdaEdgeServiceRole9A3-1VBUFKDCI4PGS",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
          {
            Effect: "Allow",
            Principal: {
              Service: "edgelambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
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
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName:
          "CloudfrontLambdaEdgeCdkPythonSt-LambdaEdge6A7A1843-wys4Xq7Szfxn",
        Handler: "index.handler",
        Runtime: "python3.7",
      },
    }),
    dependencies: ({}) => ({
      role: "CloudfrontLambdaEdgeCdkPy-LambdaEdgeServiceRole9A3-1VBUFKDCI4PGS",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ getId }) => ({
      Name: "cloudfrontlambdaedgecdkpy-myhostingbucket134f0bf0-x148i0ljl82b",
      Policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${getId(
                {
                  type: "OriginAccessIdentity",
                  group: "CloudFront",
                  name: "Identity for CloudfrontLambdaEdgeCdkPythonStackMyDistributionOrigin14A5ED72A",
                }
              )}`,
            },
            Action: "s3:GetObject",
            Resource:
              "arn:aws:s3:::cloudfrontlambdaedgecdkpy-myhostingbucket134f0bf0-x148i0ljl82b/*",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      originAccessIdentities: [
        "Identity for CloudfrontLambdaEdgeCdkPythonStackMyDistributionOrigin14A5ED72A",
      ],
    }),
  },
];
