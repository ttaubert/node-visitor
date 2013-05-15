var test = require("tape");
var visit = require("../");
var generate = require("escodegen").generate;

function unparse(s) {
  return generate(s, {format: {compact: true}});
}

test("parent", function (t) {
  t.plan(5);

  visit("var xs = [1, 2, 3];", {
    ArrayExpression: function (node) {
      t.equal(node.source(), "[1, 2, 3]");
      t.equal(node.parent.type, "VariableDeclarator");
      t.equal(unparse(node.parent), "xs=[1,2,3]");
      t.equal(node.parent.parent.type, "VariableDeclaration");
      t.equal(unparse(node.parent.parent), "var xs=[1,2,3];");
    }
  });
});
