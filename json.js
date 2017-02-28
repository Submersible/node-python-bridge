'use strict';

module.exports = function json(text_nodes) {
    let values = Array.prototype.slice.call(arguments, 1);
    return dedent(text_nodes.reduce((cur, acc, i) => cur + JSON.stringify(values[i - 1]) + acc));
};
