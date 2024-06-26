const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, find, unless, isEmpty } = require("rubico/x");

const findName = () => pipe([get("certificateName")]);

const pickId = pipe([
  tap(({ loadBalancerName, certificateName }) => {
    assert(loadBalancerName);
    assert(certificateName);
  }),
  pick(["loadBalancerName", "certificateName"]),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailLoadBalancerCertificate = ({ compare }) => ({
  type: "LoadBalancerCertificate",
  package: "lightsail",
  client: "Lightsail",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "createdAt",
    "resourceType",
    "supportCode",
    "isAttached",
    "issuer",
    "domainValidationRecords",
    "status",
    "signatureAlgorithm",
    "keyAlgorithm",
    "subject",
    "location",
  ],
  inferName:
    ({ dependenciesSpec: { loadBalancer } }) =>
    ({ certificateName }) =>
      pipe([
        tap((params) => {
          assert(loadBalancer);
          assert(certificateName);
        }),
        () => certificateName,
      ])(),
  dependencies: {
    loadBalancer: {
      type: "LoadBalancer",
      group: "Lightsail",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("loadBalancerName")]),
    },
  },
  findName,
  findId: findName,
  getByName: ({ getById }) =>
    pipe([
      ({ name, resolvedDependencies: { loadBalancer } }) => ({
        certificateName: name,
        loadBalancerName: loadBalancer.config.loadBalancerName,
      }),
      getById({}),
    ]),
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "LoadBalancer", group: "Lightsail" },
          pickKey: pipe([pick(["loadBalancerName"])]),
          method: "getLoadBalancerTlsCertificates",
          getParam: "tlsCertificates",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              ({ name, domainName, subjectAlternativeNames, ...other }) => ({
                certificateDomainName: domainName,
                certificateAlternativeNames: subjectAlternativeNames,
                loadBalancerName: parent.loadBalancerName,
                certificateName: name,
                ...other,
              }),
            ]),
        }),
    ])(),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { loadBalancer },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(loadBalancer);
      }),
      () => otherProps,
      defaultsDeep({
        loadBalancerName: loadBalancer.config.loadBalancerName,
      }),
    ])(),
  ignoreErrorCodes: ["DoesNotExist"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getLoadBalancerTlsCertificates-property
  getById: {
    method: "getLoadBalancerTlsCertificates",
    //getField: "tlsCertificates",
    pickId: pipe([
      tap(({ loadBalancerName, certificateName }) => {
        assert(loadBalancerName);
        assert(certificateName);
      }),
      pick(["loadBalancerName"]),
    ]),
    decorate: ({ live: { certificateName } }) =>
      pipe([
        tap((params) => {
          assert(certificateName);
        }),
        get("tlsCertificates"),
        find(eq(get("name"), certificateName)),
        unless(isEmpty, ({ name, ...other }) => ({
          certificateName: name,
          ...other,
        })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#createLoadBalancerTlsCertificate-property
  create: {
    //filtePayload: pickId,
    method: "createLoadBalancerTlsCertificate",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#deleteLoadBalancerTlsCertificate-property
  destroy: {
    method: "deleteLoadBalancerTlsCertificate",
    pickId,
  },
});
