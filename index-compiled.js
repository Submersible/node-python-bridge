'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var path = require('path');

var child_process = require('child_process');

var PYTHON_BRIDGE_SCRIPT = path.join(__dirname, 'node_python_bridge.py');

function pythonBridge(opts) {
  // default options
  var intepreter = opts && opts.python || 'python';
  var stdio = opts && opts.stdio || ['pipe', process.stdout, process.stderr];
  var options = {
    cwd: opts && opts.cwd,
    env: opts && opts.env,
    uid: opts && opts.uid,
    gid: opts && opts.gid,
    stdio: stdio.concat(['ipc'])
  }; // create process bridge

  var ps = child_process.spawn(intepreter, [PYTHON_BRIDGE_SCRIPT], options);
  var queue = singleQueue();

  function sendPythonCommand(type, enqueue, self) {
    function wrapper() {
      self = self || wrapper;
      var code = json.apply(this, arguments);

      if (!(this && this.connected || self.connected)) {
        return Promise.reject(new PythonBridgeNotConnected());
      }

      return enqueue(function () {
        return new Promise(function (resolve, reject) {
          ps.send({
            type: type,
            code: code
          });
          ps.once('message', onMessage);
          ps.once('close', onClose);

          function onMessage(data) {
            ps.removeListener('close', onClose);

            if (data && data.type && data.type === 'success') {
              resolve(eval("(".concat(data.value, ")")));
            } else if (data && data.type && data.type === 'exception') {
              reject(new PythonException(data.value));
            } else {
              reject(data);
            }
          }

          function onClose(exit_code, message) {
            ps.removeListener('message', onMessage);

            if (!message) {
              reject(new Error("Python process closed with exit code ".concat(exit_code)));
            } else {
              reject(new Error("Python process closed with exit code ".concat(exit_code, " and message: ").concat(message)));
            }
          }
        });
      });
    }

    return wrapper;
  }

  function setupLock(enqueue) {
    return function (f) {
      return enqueue(function () {
        var lock_queue = singleQueue();
        var lock_python = sendPythonCommand('evaluate', lock_queue);
        lock_python.ex = sendPythonCommand('execute', lock_queue, lock_python);
        lock_python.lock = setupLock(lock_queue);
        lock_python.connected = true;
        lock_python.__proto__ = python;
        return f(lock_python);
      });
    };
  } // API


  var python = sendPythonCommand('evaluate', queue);
  python.ex = sendPythonCommand('execute', queue, python);
  python.lock = setupLock(queue);
  python.pid = ps.pid;
  python.connected = true;
  python.Exception = PythonException;
  python.isException = isPythonException;

  python.disconnect = function () {
    python.connected = false;
    return queue(function () {
      ps.disconnect();
    });
  };

  python.end = python.disconnect;

  python.kill = function (signal) {
    python.connected = false;
    ps.kill(signal);
  };

  python.stdin = ps.stdin;
  python.stdout = ps.stdout;
  python.stderr = ps.stderr;
  return python;
}

var PythonException =
/*#__PURE__*/
function (_Error) {
  _inherits(PythonException, _Error);

  function PythonException(exc) {
    var _this;

    _classCallCheck(this, PythonException);

    if (exc && exc.format) {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(PythonException).call(this, exc.format.join('')));
    } else if (exc && exc.error) {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(PythonException).call(this, "Python exception: ".concat(exc.error)));
    } else {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(PythonException).call(this, 'Unknown Python exception'));
    }

    _this.error = exc.error;
    _this.exception = exc.exception;
    _this.traceback = exc.traceback;
    _this.format = exc.format;
    return _possibleConstructorReturn(_this);
  }

  return PythonException;
}(_wrapNativeSuper(Error));

var PythonBridgeNotConnected =
/*#__PURE__*/
function (_Error2) {
  _inherits(PythonBridgeNotConnected, _Error2);

  function PythonBridgeNotConnected() {
    _classCallCheck(this, PythonBridgeNotConnected);

    return _possibleConstructorReturn(this, _getPrototypeOf(PythonBridgeNotConnected).call(this, 'Python bridge is no longer connected.'));
  }

  return PythonBridgeNotConnected;
}(_wrapNativeSuper(Error));

function isPythonException(name, exc) {
  var thunk = function thunk(exc) {
    return exc instanceof PythonException && exc.exception && exc.exception.type.name === name;
  };

  if (exc === undefined) {
    return thunk;
  }

  return thunk(exc);
}

function singleQueue() {
  var last = Promise.resolve();
  return function enqueue(f) {
    var wait = last;
    var done;
    last = new Promise(function (resolve) {
      done = resolve;
    });
    return promiseFinally(new Promise(function (resolve, reject) {
      promiseFinally(wait, function () {
        promiseTry(f).then(resolve, reject);
      });
    }), function () {
      return done();
    });
  };
}

function dedent(code) {
  // dedent text
  var lines = code.split('\n');
  var offset = null; // remove extra blank starting line

  if (!lines[0].trim()) {
    lines.shift();
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var line = _step.value;
      var trimmed = line.trimLeft();

      if (trimmed) {
        offset = line.length - trimmed.length + 1;
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (!offset) {
    return code;
  }

  var match = new RegExp('^' + new Array(offset).join('\\s?'));
  return lines.map(function (line) {
    return line.replace(match, '');
  }).join('\n');
}

function json(text_nodes) {
  var values = Array.prototype.slice.call(arguments, 1);
  return dedent(text_nodes.reduce(function (cur, acc, i) {
    return cur + serializePython(values[i - 1]) + acc;
  }));
}

function serializePython(value) {
  if (value === null || typeof value === 'undefined') {
    return 'None';
  } else if (value === true) {
    return 'True';
  } else if (value === false) {
    return 'False';
  } else if (value === Infinity) {
    return "float('inf')";
  } else if (value === -Infinity) {
    return "float('-inf')";
  } else if (value instanceof Array) {
    return "[".concat(value.map(serializePython).join(', '), "]");
  } else if (typeof value === 'number') {
    if (isNaN(value)) {
      return "float('nan')";
    }

    return JSON.stringify(value);
  } else if (typeof value === 'string') {
    return JSON.stringify(value);
  } else if (value instanceof Map) {
    var props = Array.from(value.entries()).map(function (kv) {
      return "".concat(serializePython(kv[0]), ": ").concat(serializePython(kv[1]));
    });
    return "{".concat(props.join(', '), "}");
  } else {
    var _props = Object.keys(value).map(function (k) {
      return "".concat(serializePython(k), ": ").concat(serializePython(value[k]));
    });

    return "{".concat(_props.join(', '), "}");
  }
}

function promiseTry(f) {
  return new Promise(function (resolve, reject) {
    try {
      resolve(f());
    } catch (e) {
      reject(e);
    }
  });
}

function promiseFinally(promise, cb) {
  promise.then(cb, cb);
  return promise;
}

pythonBridge.pythonBridge = pythonBridge;
pythonBridge.PythonException = PythonException;
pythonBridge.PythonBridgeNotConnected = PythonBridgeNotConnected;
pythonBridge.isPythonException = isPythonException;
pythonBridge.json = json;
pythonBridge.serializePython = serializePython;
module.exports = pythonBridge.pythonBridge = pythonBridge;
