'use strict';

let Promise = require('bluebird');

module.exports = class Channel {
    constructor() {
        this._reader = [];
        this._writer = [];
    }
    put(x) {
        return new Promise(done => {
            if (this._reader.length) {
                let write = this._reader.shift();
                write(x);
                done();
            } else {
                this._writer.push([x, done]);
            }
        });
    }
    get() {
      return new Promise(write => {
          if (this._writer.length) {
              let item = this._writer.shift(), value = item[0], done = item[1];
              write(value);
              done();
          } else {
              this._reader.push(write);
          }
      });
    }
};
