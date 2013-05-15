var _ = require("underscore");
var parse = require("esprima").parse;

module.exports = function (src, visitors) {
  var ast = parse(src, {range: true});
  var chunks = src.split("");

  (function walk(node, parent) {
    insertHelpers(node, parent, chunks);

    _.each(_.keys(node), function (key) {
      if (key === "parent") {
        return;
      }

      var child = node[key];
      if (_.isArray(child)) {
        _.each(child, function (c) {
          if (c && typeof c.type === "string") {
            walk(c, node);
          }
        });
      } else if (child && typeof child.type === "string") {
        walk(child, node);
      }
    });

    if (node.type in visitors && typeof visitors[node.type] === "function") {
      insertUpdate(node, chunks);
      visitors[node.type](node);
    }
  })(ast, []);

  return chunks.join("");
};

function insertHelpers(node, parent, chunks) {
  node.parent = parent;
  node.source = function () {
    return chunks.slice(node.range[0], node.range[1]).join("");
  };
}

function insertUpdate(node, chunks) {
  if (node.update && typeof node.update === "object") {
    _.each(_.keys(node.update), function (key) {
      update[key] = node.update[key];
    });
  }

  node.update = update;

  function update(s) {
    chunks[node.range[0]] = s;
    for (var i = node.range[0] + 1; i < node.range[1]; i++) {
      chunks[i] = "";
    }
  }
}
