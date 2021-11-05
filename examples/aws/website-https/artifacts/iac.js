// Generated by aws2gc
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  provider.CloudFront.makeDistribution({
    name: "distribution-cloudfront.aws.test.grucloud.org-dev",
    properties: ({ config }) => ({
      PriceClass: "PriceClass_100",
      Aliases: {
        Quantity: 1,
        Items: ["dev.cloudfront.aws.test.grucloud.org"],
      },
      DefaultRootObject: "index.html",
      DefaultCacheBehavior: {
        TargetOriginId: "S3-cloudfront.aws.test.grucloud.org-dev",
        TrustedSigners: {
          Enabled: false,
          Quantity: 0,
          Items: [],
        },
        TrustedKeyGroups: {
          Enabled: false,
          Quantity: 0,
          Items: [],
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
        Compress: false,
        LambdaFunctionAssociations: {
          Quantity: 0,
          Items: [],
        },
        FunctionAssociations: {
          Quantity: 0,
          Items: [],
        },
        FieldLevelEncryptionId: "",
        ForwardedValues: {
          QueryString: false,
          Cookies: {
            Forward: "none",
          },
          Headers: {
            Quantity: 0,
            Items: [],
          },
          QueryStringCacheKeys: {
            Quantity: 0,
            Items: [],
          },
        },
        MinTTL: 600,
        DefaultTTL: 86400,
        MaxTTL: 31536000,
      },
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: "S3-cloudfront.aws.test.grucloud.org-dev",
            DomainName: "cloudfront.aws.test.grucloud.org-dev.s3.amazonaws.com",
            OriginPath: "",
            CustomHeaders: {
              Quantity: 0,
              Items: [],
            },
            S3OriginConfig: {
              OriginAccessIdentity: "",
            },
            ConnectionAttempts: 3,
            ConnectionTimeout: 10,
            OriginShield: {
              Enabled: false,
            },
          },
        ],
      },
      Restrictions: {
        GeoRestriction: {
          RestrictionType: "none",
          Quantity: 0,
          Items: [],
        },
      },
      Comment: "cloudfront.aws.test.grucloud.org-dev.s3.amazonaws.com",
      Logging: {
        Enabled: false,
        IncludeCookies: false,
        Bucket: "",
        Prefix: "",
      },
    }),
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
      certificate: resources.ACM.Certificate.devCloudfrontAwsTestGrucloudOrg,
    }),
  });

  provider.Route53.makeHostedZone({
    name: "dev.cloudfront.aws.test.grucloud.org.",
    dependencies: ({ resources }) => ({
      domain: resources.Route53Domains.Domain.grucloudOrg,
    }),
  });

  provider.Route53.makeRecord({
    dependencies: ({ resources }) => ({
      hostedZone: resources.Route53.HostedZone.devCloudfrontAwsTestGrucloudOrg,
      distribution:
        resources.CloudFront.Distribution
          .distributionCloudfrontAwsTestGrucloudOrgDev,
    }),
  });

  provider.Route53.makeRecord({
    dependencies: ({ resources }) => ({
      hostedZone: resources.Route53.HostedZone.devCloudfrontAwsTestGrucloudOrg,
      certificate: resources.ACM.Certificate.devCloudfrontAwsTestGrucloudOrg,
    }),
  });

  provider.Route53Domains.useDomain({
    name: "grucloud.org",
  });

  provider.S3.makeBucket({
    name: "cloudfront.aws.test.grucloud.org-dev",
    properties: ({ config }) => ({
      ACL: "public-read",
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: "index.html",
        },
        ErrorDocument: {
          Key: "error.html",
        },
      },
    }),
  });

  provider.S3.makeObject({
    name: "build/bundle.css",
    properties: ({ config }) => ({
      ContentType: "text/css",
      source: "s3/cloudfront.aws.test.grucloud.org-dev/build/bundle.css.css",
    }),
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
  });

  provider.S3.makeObject({
    name: "build/bundle.js",
    properties: ({ config }) => ({
      ContentType: "application/javascript",
      source: "s3/cloudfront.aws.test.grucloud.org-dev/build/bundle.js.js",
    }),
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
  });

  provider.S3.makeObject({
    name: "favicon.png",
    properties: ({ config }) => ({
      ContentType: "image/png",
      source: "s3/cloudfront.aws.test.grucloud.org-dev/favicon.png.png",
    }),
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
  });

  provider.S3.makeObject({
    name: "global.css",
    properties: ({ config }) => ({
      ContentType: "text/css",
      source: "s3/cloudfront.aws.test.grucloud.org-dev/global.css.css",
    }),
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
  });

  provider.S3.makeObject({
    name: "index.html",
    properties: ({ config }) => ({
      ContentType: "text/html",
      source: "s3/cloudfront.aws.test.grucloud.org-dev/index.html.html",
    }),
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
  });
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  createResources({
    provider,
  });

  return {
    provider,
  };
};