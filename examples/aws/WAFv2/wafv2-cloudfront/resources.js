// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    properties: ({}) => ({
      DomainName: "grucloud.org",
      SubjectAlternativeNames: ["grucloud.org", "*.grucloud.org"],
    }),
  },
  {
    type: "Distribution",
    group: "CloudFront",
    properties: ({ getId }) => ({
      DefaultRootObject: "",
      Origins: {
        Items: [
          {
            Id: "website.grucloud.org.s3.eu-west-2.amazonaws.com",
            DomainName: "website.grucloud.org.s3.eu-west-2.amazonaws.com",
            OriginPath: "",
            CustomHeaders: {
              Quantity: 0,
            },
            S3OriginConfig: {
              OriginAccessIdentity: `origin-access-identity/cloudfront/${getId({
                type: "OriginAccessIdentity",
                group: "CloudFront",
                name: "access-identity-website.grucloud.org.s3.eu-west-2.amazonaws.com",
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
        TargetOriginId: "website.grucloud.org.s3.eu-west-2.amazonaws.com",
        TrustedSigners: {
          Enabled: false,
        },
        TrustedKeyGroups: {
          Enabled: false,
        },
        ViewerProtocolPolicy: "redirect-to-https",
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
        FieldLevelEncryptionId: "",
        CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
      },
      Comment: "",
      PriceClass: "PriceClass_100",
      ViewerCertificate: {
        CloudFrontDefaultCertificate: false,
        SSLSupportMethod: "sni-only",
        MinimumProtocolVersion: "TLSv1.2_2021",
        CertificateSource: "acm",
      },
    }),
    dependencies: ({}) => ({
      certificate: "grucloud.org",
      originAccessIdentities: [
        "access-identity-website.grucloud.org.s3.eu-west-2.amazonaws.com",
      ],
      webAcl: "webacl-cloudfront",
    }),
  },
  {
    type: "OriginAccessIdentity",
    group: "CloudFront",
    name: "access-identity-website.grucloud.org.s3.eu-west-2.amazonaws.com",
  },
  {
    type: "WebACLCloudFront",
    group: "WAFv2",
    properties: ({}) => ({
      Capacity: 0,
      DefaultAction: {
        Allow: {},
      },
      ManagedByFirewallManager: false,
      Name: "webacl-cloudfront",
      Rules: [],
      VisibilityConfig: {
        CloudWatchMetricsEnabled: true,
        MetricName: "webacl-cloudfront",
        SampledRequestsEnabled: true,
      },
      Scope: "CLOUDFRONT",
    }),
  },
];
