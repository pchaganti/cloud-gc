const assert = require("assert");
const { pipe, tap } = require("rubico");
const { KMS } = require("@aws-sdk/client-kms");
const { createEndpoint } = require("../AwsCommon");

exports.createKMS = createEndpoint(KMS);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#tagResource-property
exports.tagResource =
  ({ kms }) =>
  ({ id }) =>
    pipe([(Tags) => ({ KeyId: id, Tags }), kms().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#untagResource-property
exports.untagResource =
  ({ kms }) =>
  ({ id }) =>
    pipe([
      (TagKeys) => ({ KeyId: id, TagKeys }),
      tap((params) => {
        assert(true);
      }),
      kms().untagResource,
    ]);
