const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "Redshift";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });
const { RedshiftCluster } = require("./RedshiftCluster");

const {
  RedshiftClusterParameterGroup,
} = require("./RedshiftClusterParameterGroup");

const { RedshiftClusterSubnetGroup } = require("./RedshiftClusterSubnetGroup");

const { RedshiftEndpointAccess } = require("./RedshiftEndpointAccess");
const {
  RedshiftEndpointAuthorization,
} = require("./RedshiftEndpointAuthorization");
const { RedshiftEventSubscription } = require("./RedshiftEventSubscription");
const { RedshiftPartner } = require("./RedshiftPartner");
const { RedshiftScheduledAction } = require("./RedshiftScheduledAction");
const { RedshiftUsageLimit } = require("./RedshiftUsageLimit");

//
module.exports = pipe([
  () => [
    RedshiftCluster({ compare }),
    RedshiftClusterParameterGroup({ compare }),
    RedshiftClusterSubnetGroup({ compare }),
    RedshiftEndpointAccess({}),
    RedshiftEndpointAuthorization({}),
    RedshiftEventSubscription({}),
    RedshiftPartner({}),
    RedshiftScheduledAction({}),
    RedshiftUsageLimit({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
