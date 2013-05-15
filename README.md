# visitor

walk and transform ASTs with references to parent nodes

This module is heavily inspired by
[astw](https://github.com/substack/astw),
[falafel](https://github.com/substack/node-falafel) and
[acorn](https://github.com/marijnh/acorn). It allows to walk and update ASTs
providing references to parent nodes.

# examples

``` js
var visit = require("visitor");
var assert = require("assert");

visit("var xs = [1, 2, 3];", {
  ArrayExpression: function (node) {
    assert.equal(node.source(), "[1, 2, 3]");
    assert.equal(node.parent.type, "VariableDeclarator");
    assert.equal(node.parent.parent.type, "VariableDeclaration");
  }
});
```

``` js
var visit = require("visitor");
var assert = require("assert");

var result = visit("1 + 2", {
  BinaryExpression: function (node) {
    if (node.operator === "+" &&
        node.left.type === "Literal" &&
        node.right.type === "Literal") {
      node.update(node.left.value + node.right.value);
    }
  }
});

assert(result === "3", "combined both sides of the expression");
```

# install

With [npm](https://npmjs.org) do:

```
npm install visitor
```

# license

MIT

