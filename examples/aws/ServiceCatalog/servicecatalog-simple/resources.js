// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: `cf-templates-x7lcu52auzd7-${config.region}`,
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
          },
        ],
      },
    }),
  },
  {
    type: "Object",
    group: "S3",
    properties: ({ config }) => ({
      Key: "servicecatalog-product-2023065qIW-Network.yaml",
      ContentType: "application/octet-stream",
      ServerSideEncryption: "AES256",
      source: `s3/cf-templates-x7lcu52auzd7-${config.region}/servicecatalog-product-2023065qIW-Network.yaml`,
    }),
    dependencies: ({ config }) => ({
      bucket: `cf-templates-x7lcu52auzd7-${config.region}`,
    }),
  },
  {
    type: "Portfolio",
    group: "ServiceCatalog",
    properties: ({}) => ({
      DisplayName: "my-portfolio",
      ProviderName: "ops",
    }),
  },
  {
    type: "Product",
    group: "ServiceCatalog",
    properties: ({}) => ({
      Name: "Vpc",
      Owner: "ops",
      ProvisioningArtifactParameters: {
        Name: "v1",
        Type: "CLOUD_FORMATION_TEMPLATE",
        Info: {
          LoadTemplateFromURL:
            "https://cf-templates-x7lcu52auzd7-us-east-1.s3.us-east-1.amazonaws.com/servicecatalog-product-2023065qIW-Network.yaml",
        },
      },
      Description: "Vpc",
      ProductType: "CLOUD_FORMATION_TEMPLATE",
    }),
    dependencies: ({ config }) => ({
      s3Template: `cf-templates-x7lcu52auzd7-${config.region}/servicecatalog-product-2023065qIW-Network.yaml`,
    }),
  },
  {
    type: "ProductPortfolioAssociation",
    group: "ServiceCatalog",
    dependencies: ({}) => ({
      portfolio: "my-portfolio",
      product: "Vpc",
    }),
  },
];
