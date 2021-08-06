// Generated by aws2gc
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  const { config } = provider;

  provider.s3.makeBucket({
    name: config.s3.Bucket.cloudfrontAwsTestGrucloudOrgDev.name,
    properties: () =>
      config.s3.Bucket.cloudfrontAwsTestGrucloudOrgDev.properties,
  });

  provider.s3.makeObject({
    name: config.s3.Object.buildBundleCss.name,
    dependencies: ({ resources }) => ({
      bucket: resources.s3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
    properties: () => config.s3.Object.buildBundleCss.properties,
  });

  provider.s3.makeObject({
    name: config.s3.Object.buildBundleJs.name,
    dependencies: ({ resources }) => ({
      bucket: resources.s3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
    properties: () => config.s3.Object.buildBundleJs.properties,
  });

  provider.s3.makeObject({
    name: config.s3.Object.faviconPng.name,
    dependencies: ({ resources }) => ({
      bucket: resources.s3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
    properties: () => config.s3.Object.faviconPng.properties,
  });

  provider.s3.makeObject({
    name: config.s3.Object.globalCss.name,
    dependencies: ({ resources }) => ({
      bucket: resources.s3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
    properties: () => config.s3.Object.globalCss.properties,
  });

  provider.s3.makeObject({
    name: config.s3.Object.indexHtml.name,
    dependencies: ({ resources }) => ({
      bucket: resources.s3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
    properties: () => config.s3.Object.indexHtml.properties,
  });

  provider.cloudFront.makeDistribution({
    name: config.cloudFront.Distribution
      .distributionCloudfrontAwsTestGrucloudOrgDev.name,
    dependencies: ({ resources }) => ({
      bucket: resources.s3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
      certificate: resources.acm.Certificate.devCloudfrontAwsTestGrucloudOrg,
    }),
    properties: () =>
      config.cloudFront.Distribution.distributionCloudfrontAwsTestGrucloudOrgDev
        .properties,
  });

  provider.acm.makeCertificate({
    name: config.acm.Certificate.devCloudfrontAwsTestGrucloudOrg.name,
    properties: () =>
      config.acm.Certificate.devCloudfrontAwsTestGrucloudOrg.properties,
  });

  provider.acm.makeCertificate({
    name: config.acm.Certificate.grucloudOrg.name,
    properties: () => config.acm.Certificate.grucloudOrg.properties,
  });

  provider.route53Domain.useDomain({
    name: config.route53Domain.Domain.grucloudOrg.name,
  });

  provider.route53.makeHostedZone({
    name: config.route53.HostedZone.devCloudfrontAwsTestGrucloudOrg.name,
  });

  provider.route53.makeRecord({
    name: config.route53.Record.distributionAliasDevCloudfrontAwsTestGrucloudOrg
      .name,
    dependencies: ({ resources }) => ({
      hostedZone: resources.route53.HostedZone.devCloudfrontAwsTestGrucloudOrg,
      distribution:
        resources.cloudFront.Distribution
          .distributionCloudfrontAwsTestGrucloudOrgDev,
    }),
  });

  provider.route53.makeRecord({
    name: config.route53.Record.validationDevCloudfrontAwsTestGrucloudOrg.name,
    dependencies: ({ resources }) => ({
      hostedZone: resources.route53.HostedZone.devCloudfrontAwsTestGrucloudOrg,
      certificate: resources.acm.Certificate.devCloudfrontAwsTestGrucloudOrg,
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
