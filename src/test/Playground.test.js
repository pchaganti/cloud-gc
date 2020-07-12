const assert = require("assert");
const urljoin = require("url-join");

const { defaultsDeep, isEqual } = require("lodash/fp");

const list = {
  data: {
    items: [
      {
        id: "11",
      },
    ],
  },
};

describe("Playground", function () {
  it.skip("urljoin", async function () {
    const result = urljoin("", "/test");
    assert.equal(result, "/test");
  });
  it("defaultsDeep", async function () {
    const result = defaultsDeep({ size: 10 }, { size: 20 });
    assert(isEqual(result, { size: 20 }));
  });
});
