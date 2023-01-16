// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "KeyGroup",
    group: "CloudFront",
    properties: ({}) => ({
      KeyGroupConfig: {
        Name: "my-key-group",
      },
    }),
    dependencies: ({}) => ({
      publicKeys: ["my-public-key"],
    }),
  },
  {
    type: "PublicKey",
    group: "CloudFront",
    properties: ({}) => ({
      PublicKeyConfig: {
        Name: "my-public-key",
        EncodedKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArprXSQCrjd/SG8ERGmXi
wnw4I+axRZRTHnWPs+W9PTesEIHwmV4WzUNHqjpKjXoVtq3vY+2WGDfJ3Y5cQalW
axHMatVWC6QXrHtiblzfZPKp9a77hekkeLOM77hRmPFdwoNzSFgVmfyRit0C63i3
hMvmyYgFkHRaJ7/Ijimvq/cOpBo5U7VT15MDEoKevWCVpiEknuuWIWkEqEkZexeZ
J3eX772vhBaUrM7yQIWFZ6yGNweVHNSkaGS+b8NMUz0LXpaDJF6U2lPQZ0Sya8lg
BVXfLiCADx4K2alwbqhk329v5lpjOuKg4yNkN52h+vUc9FJeGG7Ld84Gp3NhaGcz
pQIDAQAB
-----END PUBLIC KEY-----
`,
      },
    }),
  },
];
