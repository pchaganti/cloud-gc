const assert = require("assert");
const { pipe, tap } = require("rubico");
const { callProp } = require("rubico/x");
const { createEndpoint } = require("../AwsCommon");

exports.createRoute53 = createEndpoint("route-53", "Route53");

exports.hostedZoneIdToResourceId = callProp("replace", "/hostedzone/", "");

exports.buildRecordName = pipe([
  tap(({ Name, Type }) => {
    assert(Name);
    assert(Type);
  }),
  ({ Name, Type }) => `record::${Type}::${Name}`,
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#changeTagsForResource-property
exports.tagResource =
  ({ ResourceType }) =>
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      (AddTags) => ({ ResourceId: id, AddTags, ResourceType }),
      endpoint().changeTagsForResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#changeTagsForResource-property
exports.untagResource =
  ({ ResourceType }) =>
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      (RemoveTagKeys) => ({ ResourceId: id, RemoveTagKeys, ResourceType }),
      endpoint().changeTagsForResource,
    ]);
