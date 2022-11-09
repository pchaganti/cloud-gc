const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { tos } = require("@grucloud/core/tos");
const { buildTagsObject } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const { getField } = require("@grucloud/core/ProviderCommon");
const {
  createApiGatewayV2,
  ignoreErrorCodes,
  tagResource,
  untagResource,
} = require("./ApiGatewayCommon");

const findId = get("live.DomainName");
const findName = get("live.DomainName");
const pickId = pipe([pick(["DomainName"])]);

exports.DomainName = ({ spec, config }) => {
  const apiGateway = createApiGatewayV2(config);

  const client = AwsClient({ spec, config })(apiGateway);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getDomainNames-property
  const getList = client.getList({
    method: "getDomainNames",
    getParam: "Items",
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getDomainName-property
  const getById = client.getById({
    pickId,
    method: "getDomainName",
    ignoreErrorCodes,
  });

  const getByName = pipe([
    ({ name: DomainName }) => ({ DomainName }),
    getById({}),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createDomainName-property
  const create = client.create({
    method: "createDomainName",
    shouldRetryOnExceptionCodes: [
      "UnsupportedCertificate",
      "BadRequestException",
    ],
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteDomainName-property
  const update = client.update({
    pickId,
    method: "deleteDomainName",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteDomainName-property
  const destroy = client.destroy({
    pickId,
    method: "deleteDomainName",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { certificate },
  }) =>
    pipe([
      tap(() => {
        assert(certificate, "missing 'certificate' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        DomainName: name,
        DomainNameConfigurations: [
          {
            CertificateArn: getField(certificate, "CertificateArn"),
          },
        ],
        Tags: buildTagsObject({ config, namespace, name, userTags: Tags }),
      }),
    ])();

  const buildResourceArn = ({ DomainName }) =>
    `arn:aws:apigateway:${config.region}::/domainnames/${DomainName}`;

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getByName,
    getById,
    getList,
    configDefault,
    tagResource: tagResource({ buildResourceArn })({ endpoint: apiGateway }),
    untagResource: untagResource({ buildResourceArn })({
      endpoint: apiGateway,
    }),
  };
};
