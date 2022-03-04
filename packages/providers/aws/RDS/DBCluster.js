const assert = require("assert");
const { map, pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createRDS } = require("./RDSCommon");

const findId = get("live.DBClusterIdentifier");
const pickId = pick(["DBClusterIdentifier"]);
const findName = findId;
const isInstanceUp = pipe([eq(get("Status"), "available")]);

exports.DBCluster = ({ spec, config }) => {
  const rds = createRDS(config);
  const client = AwsClient({ spec, config })(rds);

  const findDependencies = ({ live, lives }) => [
    {
      type: "DBSubnetGroup",
      group: "RDS",
      ids: [get("DBSubnetGroup")(live)],
    },
    {
      type: "SecurityGroup",
      group: "EC2",
      ids: pipe([
        () => live,
        get("VpcSecurityGroups"),
        pluck("VpcSecurityGroupId"),
      ])(),
    },
    {
      type: "Key",
      group: "KMS",
      ids: [get("KmsKeyId")(live)],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBClusters-property
  const getList = client.getList({
    method: "describeDBClusters",
    getParam: "DBClusters",
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
    pickId,
    method: "describeDBClusters",
    getField: "DBClusters",
    ignoreErrorCodes: ["DBClusterNotFoundFault"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBCluster-property
  //TODO tags

  const configDefault = async ({
    name,
    namespace,
    properties,
    dependencies: { dbSubnetGroup, securityGroups },
  }) =>
    pipe([
      () => properties,
      defaultsDeep({
        DBClusterIdentifier: name,
        DBSubnetGroupName: dbSubnetGroup.config.DBSubnetGroupName,
        VpcSecurityGroupIds: map((sg) => getField(sg, "GroupId"))(
          securityGroups
        ),
        Tags: buildTags({ config, namespace, name }),
      }),
    ])();

  const create = client.create({
    pickCreated: () => pick(["DBCluster"]),
    method: "createDBCluster",
    pickId,
    getById,
    isInstanceUp,
    config: { ...config, retryCount: 100 },
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBCluster-property
  const update = client.update({
    pickId,
    method: "modifyDBCluster",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBCluster-property
  const destroy = client.destroy({
    pickId,
    extraParam: {
      SkipFinalSnapshot: true,
    },
    method: "deleteDBCluster",
    getById,
    ignoreErrorCodes: ["DBClusterNotFoundFault"],
    config,
  });

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getByName,
    getList,
    configDefault,
    findDependencies,
  };
};
