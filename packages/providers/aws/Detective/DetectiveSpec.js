const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html

const { DetectiveGraph } = require("./DetectiveGraph");
const {
  DetectiveInvitationAccepter,
} = require("./DetectiveInvitationAccepter");
const { DetectiveMember } = require("./DetectiveMember");
const {
  DetectiveOrganizationAdminAccount,
} = require("./DetectiveOrganizationAdminAccount");
const {
  DetectiveOrganizationConfiguration,
} = require("./DetectiveOrganizationConfiguration");

const GROUP = "Detective";

const compare = compareAws({});

module.exports = pipe([
  () => [
    //
    DetectiveGraph({ compare }),
    DetectiveInvitationAccepter({}),
    DetectiveMember({}),
    DetectiveOrganizationAdminAccount({}),
    DetectiveOrganizationConfiguration({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
