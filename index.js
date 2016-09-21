'use strict';

let Promise = require('bluebird');
let path = require('path');
let child_process = Promise.promisifyAll(require('child_process'));

const PYTHON_BRIDGE_SCRIPT = path.join(__dirname, 'node_python_bridge.py');

function pythonBridge(opts) {
    // default options
    let intepreter = opts && opts.python || 'python';
    let stdio = opts && opts.stdio || ['pipe', process.stdout, process.stderr];
    let options = {
        cwd: opts && opts.cwd,
        env: opts && opts.env,
        uid: opts && opts.uid,
        gid: opts && opts.gid,
        stdio: stdio.concat(['ipc'])
    };

    // create process bridge
    let ps = child_process.spawn(intepreter, [PYTHON_BRIDGE_SCRIPT], options);
    let queue = singleQueue();

    function sendPythonCommand(type, enqueue, self) {
        function wrapper() {
            self = self || wrapper;
            let code = json.apply(this, arguments);
            let on_message, on_close;

            if (!(this && this.connected || self.connected)) {
                return Promise.reject(new PythonBridgeNotConnected());
            }

            return enqueue(() => new Promise((resolve, reject) => {
                ps.send({type: type, code: code});
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
            }));
        }
        return wrapper;
    }

    function setupLock(enqueue) {
        return f => {
            return enqueue(() => {
                let lock_queue = singleQueue();
                let lock_python = sendPythonCommand('evaluate', lock_queue);
                lock_python.ex = sendPythonCommand('execute', lock_queue, lock_python);
                lock_python.lock = setupLock(lock_queue);
                lock_python.connected = true;
                lock_python.__proto__ = python;

                return f(lock_python);
            });
        };
    }

    // API
    let python = sendPythonCommand('evaluate', queue);
    python.ex = sendPythonCommand('execute', queue, python);
    python.lock = setupLock(queue);
    python.pid = ps.pid;
    python.connected = true;
    python.Exception = PythonException;
    python.isException = isPythonException;
    python.disconnect = () => {
        python.connected = false;
        return queue(() => {
            ps.disconnect();
        });
    };
    python.end = python.disconnect;
    python.kill = signal => {
        python.connected = false;
        ps.kill(signal);
    };
    python.stdin = ps.stdin;
    python.stdout = ps.stdout;
    python.stderr = ps.stderr;
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

class PythonBridgeNotConnected extends Error {
    constructor() {
        super('Python bridge is no longer connected.');
    }
}

function isPythonException(name) {
    return exc => (
        exc instanceof PythonException &&
        exc.exception &&
        exc.exception.type.name === name
    );
}

function singleQueue() {
    let last = Promise.resolve();
    return function enqueue(f) {
        let wait = last;
        let done;
        last = new Promise(resolve => {
            done = resolve;
        });
        return new Promise((resolve, reject) => {
            wait.finally(() => {
                Promise.try(f).then(resolve, reject);
            });
        }).finally(() => done());
    };
}

function dedent(code) {
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
}

function json(text_nodes) {
    let values = Array.prototype.slice.call(arguments, 1);
    return dedent(text_nodes.reduce((cur, acc, i) => cur + JSON.stringify(values[i - 1]) + acc));
}

pythonBridge.PythonException = PythonException;
pythonBridge.PythonBridgeNotConnected = PythonBridgeNotConnected;
pythonBridge.isPythonException = isPythonException;
pythonBridge.json = json;
module.exports = pythonBridge;
