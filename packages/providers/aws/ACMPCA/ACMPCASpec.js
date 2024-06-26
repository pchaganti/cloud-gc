const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html

//const { ACMPCACertificate } = require("./ACMPCACertificate");
const { ACMPCACertificateAuthority } = require("./ACMPCACertificateAuthority");
//const { ACMPCACertificateAuthorityCertificate } = require("./ACMPCACertificateAuthorityCertificate");
const { ACMPCAPermission } = require("./ACMPCAPermission");
const { ACMPCAPolicy } = require("./ACMPCAPolicy");

const GROUP = "ACMPCA";

const compare = compareAws({});

module.exports = pipe([
  () => [
    // ACMPCACertificate({})
    ACMPCACertificateAuthority({ compare }),
    // ACMPCACertificateAuthorityCertificate({})
    ACMPCAPermission({}),
    ACMPCAPolicy({}),
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
