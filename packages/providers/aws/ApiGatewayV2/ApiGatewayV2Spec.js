const assert = require("assert");
const { pipe, assign, map, omit, tap } = require("rubico");
const { compare } = require("@grucloud/core/Common");
const { isOurMinionObject } = require("../AwsCommon");
const { Api } = require("./Api");
const { Stage } = require("./Stage");
const { Deployment } = require("./Deployment");
const { Route } = require("./Route");
const { Integration } = require("./Integration");
const { DomainName } = require("./DomainName");
const { ApiMapping } = require("./ApiMapping");
const { Authorizer } = require("./Authorizer");
const defaultsDeep = require("rubico/x/defaultsDeep");

const GROUP = "ApiGatewayV2";

const filterTargetDefaut = omit(["Tags"]);
const filterLiveDefaut = omit(["Tags"]);

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "DomainName",
      dependsOn: ["ACM::Certificate"],
      Client: DomainName,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          defaultsDeep({ ApiMappingSelectionExpression: "$request.basepath" }),
          omit(["DomainNameConfigurations"]),
          filterTargetDefaut,
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["DomainNameConfigurations"]),
          filterLiveDefaut,
        ]),
      }),
    },
    {
      type: "Api",
      Client: Api,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          filterTargetDefaut,
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["ApiEndpoint", "ApiId", "CreatedDate"]),
          filterLiveDefaut,
        ]),
      }),
    },

    {
      type: "Stage",
      dependsOn: ["ApiGatewayV2::Api", "CloudWatchLogs::LogGroup"],
      Client: Stage,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          defaultsDeep({
            RouteSettings: [],
            DefaultRouteSettings: {
              DetailedMetricsEnabled: false,
            },
            StageVariables: {},
          }),
          filterTargetDefaut,
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["CreatedDate", "DeploymentId", "LastUpdatedDate"]),
          filterLiveDefaut,
        ]),
      }),
    },
    {
      type: "Authorizer",
      dependsOn: ["ApiGatewayV2::Api"],
      Client: Authorizer,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          filterTargetDefaut,
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["AuthorizerId", "ApiName"]),
          filterLiveDefaut,
        ]),
      }),
    },
    {
      type: "ApiMapping",
      dependsOn: [
        "ApiGatewayV2::Api",
        "ApiGatewayV2::Stage",
        "ApiGatewayV2::DomainName",
      ],
      Client: ApiMapping,
      inferName: ({ properties, dependencies }) =>
        pipe([
          tap((params) => {
            assert(dependencies);
            assert(properties);
          }),
          () =>
            `apimapping::${dependencies.domainName.name}::${dependencies.api.name}::${dependencies.stage.name}::${properties.ApiMappingKey}`,
          tap((params) => {
            assert(true);
          }),
        ])(),
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          filterTargetDefaut,
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["ApiMappingId", "ApiName"]),
          filterLiveDefaut,
        ]),
      }),
    },
    {
      type: "Integration",
      dependsOn: ["ApiGatewayV2::Api", "Lambda::Function"],
      Client: Integration,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      inferName: ({ properties, dependencies }) =>
        pipe([
          tap((params) => {
            assert(dependencies);
            assert(properties);
          }),
          //TODO other target
          () =>
            `integration::${dependencies.api.name}::${dependencies.lambdaFunction.name}`,
          tap((params) => {
            assert(true);
          }),
        ])(),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          defaultsDeep({ TimeoutInMillis: 30e3, Description: "" }),
          filterTargetDefaut,
          tap((params) => {
            assert(true);
          }),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["RouteId", "IntegrationId", "ApiName"]),
          defaultsDeep({ Description: "" }),
          filterLiveDefaut,
          tap((params) => {
            assert(true);
          }),
        ]),
      }),
    },
    {
      type: "Route",
      dependsOn: [
        "ApiGatewayV2::Api",
        "ApiGatewayV2::Integration",
        "ApiGatewayV2::Authorizer",
      ],
      Client: Route,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      inferName: ({ properties, dependencies }) =>
        pipe([
          tap((params) => {
            assert(dependencies);
            assert(properties);
          }),
          () => `route::${dependencies.api.name}::${properties.RouteKey}`,
          tap((params) => {
            assert(true);
          }),
        ])(),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          filterTargetDefaut,
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["RouteId", "ApiName"]),
          filterLiveDefaut,
        ]),
      }),
    },
    {
      type: "Deployment",
      dependsOn: [
        "ApiGatewayV2::Api",
        "ApiGatewayV2::Route",
        "ApiGatewayV2::Stage",
        "ApiGatewayV2::Integration",
      ],
      Client: Deployment,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      inferName: ({ properties, dependencies }) =>
        pipe([
          tap((params) => {
            assert(dependencies);
            assert(properties);
          }),
          () => `deployment::${dependencies.api.name}`,
          tap((params) => {
            assert(true);
          }),
        ])(),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          defaultsDeep({ AutoDeployed: false, Description: "" }),
          omit(["StageName"]),
          filterTargetDefaut,
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["CreatedDate", "DeploymentId", "DeploymentStatus", "ApiName"]),
          defaultsDeep({ Description: "" }),

          filterLiveDefaut,
        ]),
      }),
    },
  ]);
