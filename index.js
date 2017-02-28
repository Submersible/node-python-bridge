'use strict';

let Promise = require('bluebird');
let Channel = require('./channel');
let dedent = require('./dedent');
let json = require('./json');
let path = require('path');
let child_process = Promise.promisifyAll(require('child_process'));

const PYTHON_BRIDGE_SCRIPT = path.join(__dirname, 'node_python_bridge.py');

function pythonBridge({
  python:intepreter='python', cwd, env, uid, gid,
  stdin='pipe', stdout=process.stdout, stderr=process.stderr
}) {
  return new Promise((resolve, reject) => {
    let ps = child_process.spawn(intepreter, [PYTHON_BRIDGE_SCRIPT], {
      cwd, env, uid, gid, stdio: [stdin, stdout, stderr, 'ipc']
    });

    // test that it works
    // @TODO

    ps.once('close', () => {
      // @TODO handle closing
      __proto__.connected = false;
    });

    // open up bridge
    let lock = new Channel();
    let __proto__ = {
      end: () => {
        throw Error('@TODO NOT IMPLEMENTED');
      },
      kill: signal => {
        __proto__.connected = false;
        ps.kill(signal);
      },
      pid: ps.pid, stdin: ps.stdin, stdout: ps.stdout, stderr: ps.stderr,
      connected: true
    };
    lock.put();
    resolve(createPython(ps, __proto__, lock));
  }).disposer(python => {
    python.end();
  });
}

function createPython(ps, __proto__, lock) {
  function python(c) {
    let code = json.apply(this, arguments);
    return lock.get().then(() => new Promise((resolve, reject) => {
      ps.send({type: 'code', code: code});
      ps.once('message', onMessage);
      ps.once('close', onClose);

      function onMessage(data) {
        ps.removeListener('close', onClose);
        if (data && data.type && data.type === 'success') {
          resolve(data.value);
        } else if (data && data.type && data.type === 'exception') {
          reject(new PythonException(data.value));
        } else {
          reject(data);
        }
      }

      function onClose(exit_code, message) {
        ps.removeListener('message', onMessage);
        if (!message) {
          reject(new Error(`Python process closed with exit code ${exit_code}`));
        } else {
          reject(new Error(`Python process closed with exit code ${exit_code} and message: ${message}`));
        }
      }
    }).finally(() => lock.put()));
  }
  python.lock = function (f) {
    return lock.get().then(() => {
      let nestedLock = new Channel();
      nestedLock.put();
      return Promise.try(f, createPython(ps, __proto__, nestedLock)).finally(() => lock.put());
    });
  };
  python.__proto__ == __proto__;
  return python;
}

class PythonException extends Error {
    constructor(exc) {
        if (exc && exc.format) {
            super(exc.format.join(''));
        } else if (exc && exc.error) {
            super(`Python exception: ${exc.error}`);
        } else {
            super('Unknown Python exception');
        }
        this.error = exc.error;
        this.exception = exc.exception;
        this.traceback = exc.traceback;
        this.format = exc.format;
    }
}
function isPythonException(name) {
  return exc => exc instanceof PythonException && exc.exception && exc.exception.type.name === name;
}

pythonBridge.PythonException = PythonException;
pythonBridge.isPythonException = isPythonException;
module.exports = pythonBridge;

// before 182 LOC

/*
[ ] convert python stack trace to javascript stack trace
[ ] write tests for stack traces
[ ] provide better error reporting for common mistakes
[ ] use bluebird resources
[ ] use channels to implement locking
[ ] polymorphic expression / statement usage
[ ] test with gevent
[ ] test with asyncio
[ ] provide ASYNC usage!!
[ ] modernize readme to use async/await library
[ ] test randomly dying app
*/
