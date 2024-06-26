const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// exports.assignTags = ({ endpoint }) =>
//   pipe([
//     assign({
//       Tags: pipe([
//         ({ ARN }) => ({ ResourceArn: ARN }),
//         endpoint().listTags,
//         get("TagList"),
//       ]),
//     }),
//   ]);
