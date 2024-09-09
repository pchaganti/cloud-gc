// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Address",
    group: "compute",
    properties: ({}) => ({
      name: "ip-webserver-ssh-keys",
      description: "Managed By GruCloud",
      networkTier: "PREMIUM",
      addressType: "EXTERNAL",
    }),
  },
  {
    type: "Firewall",
    group: "compute",
    properties: ({}) => ({
      name: "firewall-22",
      description: "Managed By GruCloud",
      priority: 1000,
      allowed: [
        {
          IPProtocol: "tcp",
          ports: ["22"],
        },
      ],
      direction: "INGRESS",
      logConfig: {
        enable: false,
      },
    }),
  },
  {
    type: "Firewall",
    group: "compute",
    properties: ({}) => ({
      name: "firewall-icmp",
      description: "Managed By GruCloud",
      priority: 1000,
      allowed: [
        {
          IPProtocol: "icmp",
        },
      ],
      direction: "INGRESS",
      logConfig: {
        enable: false,
      },
    }),
  },
  {
    type: "Instance",
    group: "compute",
    properties: ({}) => ({
      name: "webserver-ssh-keys",
      machineType: "e2-micro",
      metadata: {
        items: [
          {
            key: "ssh-keys",
            value: `ubuntu:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC/+ZCfuXkRdiRcNjERsbmuqtKBY+ctRVd/q06VNRGxqAGI+DGnc55eMxvhh1ptdjuNg6HA7yufumrj9AmxrKEtGmRfseeVUy3th7FphEKKYCkpb8zxIEdfRr5r374gl3QxrxeKzk2YgsCQAfwfaD+ZlNQyKHWgnfwFCGEh3ciL5eSQP5xittjJap35l17kwygtCYxPcA+5DlAjDtonLGzypw/Bnb8U6TutWiHsK5Jx4iYVo4rsPmy6MsTZUx0gAKf0jvRpROK4TOHUAfio05jxfDVfE2hOZAvYFas5fKOCI8in/xaVy/hoW3rFU7OvPWfyNv7+5IE6ytI59c5e9PMXJ9IVcQmiPkfTfK91YsYcyknf6SXdTjs0aPWRpCp+UpDr98qt8xqTMujI1RA075719T1I3OUO7+w/prFLUPkEHbOLnfJ1kzam6kX87OkEG6OwIqR3A7Sw1q3EmRfDppzBOw8Oaapla+52DMLeJ6j1eLNLyBcsrgVTbOLYyZXbORMLvr0FwiAmbUPBSPKFIT12N10dElScihA2YI1g6SS5nNZAiyU16T0zL9teXYEYlupXo7T5Dc44m7xiiuzx4xibh8MprUTDUKoHSmTTSZ9psggaYcrZZQKmO8P7Et8t44iEyZ7W8xpByHxRrqmuCrqx9dIopk8fXhnQA/sP/EbX5Q== frederic.heem@gmail.com
`,
          },
        ],
      },
      sourceImage:
        "projects/debian-cloud/global/images/debian-12-bookworm-v20240815",
    }),
    dependencies: ({}) => ({
      ip: "ip-webserver-ssh-keys",
    }),
  },
];
