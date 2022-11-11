// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LoadBalancer",
    group: "Lightsail",
    properties: ({}) => ({
      loadBalancerName: "LoadBalancer-1",
      configurationOptions: {
        SessionStickinessEnabled: "true",
        SessionStickiness_LB_CookieDurationSeconds: "86400",
      },
      healthCheckPath: "/health",
      httpsRedirectionEnabled: false,
      instancePort: 80,
      ipAddressType: "dualstack",
      location: {
        availabilityZone: "all",
        regionName: "us-east-1",
      },
      protocol: "HTTP",
      publicPorts: [80],
      tlsPolicyName: "TLS-2016-08",
    }),
  },
];
