'use strict';

module.exports = function dedent(code) {
    // dedent text
    let lines = code.split('\n');
    let offset = null;

    // remove extra blank starting line
    if (!lines[0].trim()) {
        lines.shift();
    }
    for (let line of lines) {
        let trimmed = line.trimLeft();
        if (trimmed) {
            offset = (line.length - trimmed.length) + 1;
            break;
        }
    }
    if (!offset) {
        return code;
    }
    let match = new RegExp('^' + new Array(offset).join('\\s?'));
    return lines.map(line => line.replace(match, '')).join('\n');
};
