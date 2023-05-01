// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "CoreNetwork",
    group: "NetworkManager",
    name: "cloudwan-module-without",
    properties: ({}) => ({
      PolicyDocument: {
        "core-network-configuration": {
          "vpn-ecmp-support": false,
          "asn-ranges": ["64512-64556"],
          "edge-locations": [
            {
              location: "us-east-1",
              asn: 64512,
            },
            {
              location: "us-west-2",
              asn: 64514,
            },
          ],
        },
        "attachment-policies": [
          {
            "rule-number": 1,
            "condition-logic": "or",
            action: {
              "association-method": "constant",
              segment: "shared",
            },
            conditions: [
              {
                type: "tag-value",
                value: "shared",
                key: "segment",
                operator: "equals",
              },
            ],
          },
        ],
        version: "2021.12",
        "segment-actions": [
          {
            mode: "attachment-route",
            segment: "shared",
            action: "share",
            "share-with": "*",
          },
        ],
        segments: [
          {
            name: "shared",
            description: "SegmentForSharedServices",
            "require-attachment-acceptance": true,
          },
        ],
      },
      Description: "Core Network - AWS CloudWAN Module v2",
    }),
    dependencies: ({}) => ({
      globalNetwork: "cloudwan-module-without",
    }),
  },
];
