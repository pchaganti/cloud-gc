// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "ResponseHeadersPolicy",
    group: "CloudFront",
    properties: ({}) => ({
      ResponseHeadersPolicyConfig: {
        Name: "my-response-headers-policy",
        SecurityHeadersConfig: {
          StrictTransportSecurity: {
            AccessControlMaxAgeSec: 31536000,
            IncludeSubdomains: false,
            Override: false,
            Preload: false,
          },
        },
      },
    }),
  },
];
