// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "CachePolicy",
    group: "CloudFront",
    properties: ({}) => ({
      CachePolicyConfig: {
        Comment: "",
        DefaultTTL: 86400,
        MaxTTL: 31536000,
        MinTTL: 1,
        Name: "my-cache-policy",
        ParametersInCacheKeyAndForwardedToOrigin: {
          CookiesConfig: {
            CookieBehavior: "none",
          },
          EnableAcceptEncodingBrotli: true,
          EnableAcceptEncodingGzip: true,
          HeadersConfig: {
            HeaderBehavior: "none",
          },
          QueryStringsConfig: {
            QueryStringBehavior: "none",
          },
        },
      },
    }),
  },
];
