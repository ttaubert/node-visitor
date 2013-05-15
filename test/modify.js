var test = require("tape");
var visit = require("../");

test("modify", function (t) {
  t.plan(5);

  var result = visit("1 + 2", {
    BinaryExpression: function (node) {
      if (node.operator === "+" &&
          node.left.type === "Literal" &&
          node.right.type === "Literal") {
        node.update(node.left.value + node.right.value);
      }
    }
  });

  t.equal(result, "3");

  var result = visit("var x = !2", {
    UnaryExpression: function (node) {
      node.update("2");
    }
  });

  t.equal(result, "var x = 2");

  var result = visit("var x = -2", {
    VariableDeclarator: function (node) {
      node.update("y = 2");
    }
  });

  t.equal(result, "var y = 2");

  var result = visit("var x = -2", {
    VariableDeclarator: function (node) {
      node.update("z = y = 2");
    }
  });

  t.equal(result, "var z = y = 2");

  var result = visit("~+1", {
    UnaryExpression: function (node) {
      if (node.operator === "+") {
        node.update("1");
      }
    }
  });

  t.equal(result, "~1");
});
