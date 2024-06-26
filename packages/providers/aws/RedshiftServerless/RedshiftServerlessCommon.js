const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.assignTags = ({ endpoint, buildArn }) =>
  pipe([
    assign({
      tags: pipe([
        buildArn(),
        tap((resourceArn) => {
          assert(resourceArn);
        }),
        (resourceArn) => ({ resourceArn: resourceArn }),
        endpoint().listTagsForResource,
        get("tags"),
      ]),
    }),
  ]);
