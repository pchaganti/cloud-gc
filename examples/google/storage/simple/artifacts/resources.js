// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Bucket",
    group: "storage",
    properties: ({}) => ({
      name: "grucloud-test",
      iamConfiguration: {
        bucketPolicyOnly: {
          enabled: false,
        },
        uniformBucketLevelAccess: {
          enabled: false,
        },
        publicAccessPrevention: "inherited",
      },
      iam: {
        bindings: [
          {
            role: "roles/storage.legacyBucketOwner",
            members: [
              "projectEditor:grucloud-test",
              "projectOwner:grucloud-test",
            ],
          },
          {
            role: "roles/storage.legacyBucketReader",
            members: ["projectViewer:grucloud-test"],
          },
        ],
      },
    }),
  },
  {
    type: "Object",
    group: "storage",
    properties: ({}) => ({
      name: "myfile",
      contentType: "text/json",
      storageClass: "STANDARD",
    }),
    dependencies: ({}) => ({
      bucket: "grucloud-test",
    }),
  },
];
