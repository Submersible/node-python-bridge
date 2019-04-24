'use strict';

var _ = _interopRequireWildcard(require("./"));

var _tap = require("tap");

var _path = _interopRequireDefault(require("path"));

var _es6Promisify = require("es6-promisify");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _templateObject47() {
  var data = _taggedTemplateLiteral(["(lambda x: x)(", ")"]);

  _templateObject47 = function _templateObject47() {
    return data;
  };

  return data;
}

function _templateObject46() {
  var data = _taggedTemplateLiteral(["(lambda x: x)(", ")"]);

  _templateObject46 = function _templateObject46() {
    return data;
  };

  return data;
}

function _templateObject45() {
  var data = _taggedTemplateLiteral(["hello(", ", ", ", ", ")"]);

  _templateObject45 = function _templateObject45() {
    return data;
  };

  return data;
}

function _templateObject44() {
  var data = _taggedTemplateLiteral(["hello(", ")"]);

  _templateObject44 = function _templateObject44() {
    return data;
  };

  return data;
}

function _templateObject43() {
  var data = _taggedTemplateLiteral(["hello(", ", ", ")"]);

  _templateObject43 = function _templateObject43() {
    return data;
  };

  return data;
}

function _templateObject42() {
  var data = _taggedTemplateLiteral(["hello(", ")"]);

  _templateObject42 = function _templateObject42() {
    return data;
  };

  return data;
}

function _templateObject41() {
  var data = _taggedTemplateLiteral(["hello()"]);

  _templateObject41 = function _templateObject41() {
    return data;
  };

  return data;
}

function _templateObject40() {
  var data = _taggedTemplateLiteral(["\n        def hello(a, b):\n            return a + b\n    "]);

  _templateObject40 = function _templateObject40() {
    return data;
  };

  return data;
}

function _templateObject39() {
  var data = _taggedTemplateLiteral(["1 / 0"]);

  _templateObject39 = function _templateObject39() {
    return data;
  };

  return data;
}

function _templateObject38() {
  var data = _taggedTemplateLiteral(["1 / 0"]);

  _templateObject38 = function _templateObject38() {
    return data;
  };

  return data;
}

function _templateObject37() {
  var data = _taggedTemplateLiteral(["1 / 0"]);

  _templateObject37 = function _templateObject37() {
    return data;
  };

  return data;
}

function _templateObject36() {
  var data = _taggedTemplateLiteral(["hello + 321"]);

  _templateObject36 = function _templateObject36() {
    return data;
  };

  return data;
}

function _templateObject35() {
  var data = _taggedTemplateLiteral(["hello = 123"]);

  _templateObject35 = function _templateObject35() {
    return data;
  };

  return data;
}

function _templateObject34() {
  var data = _taggedTemplateLiteral(["hello + 808"]);

  _templateObject34 = function _templateObject34() {
    return data;
  };

  return data;
}

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _templateObject33() {
  var data = _taggedTemplateLiteral(["del hello"]);

  _templateObject33 = function _templateObject33() {
    return data;
  };

  return data;
}

function _templateObject32() {
  var data = _taggedTemplateLiteral(["world + 191"]);

  _templateObject32 = function _templateObject32() {
    return data;
  };

  return data;
}

function _templateObject31() {
  var data = _taggedTemplateLiteral(["world = 808"]);

  _templateObject31 = function _templateObject31() {
    return data;
  };

  return data;
}

function _templateObject30() {
  var data = _taggedTemplateLiteral(["hello + 321"]);

  _templateObject30 = function _templateObject30() {
    return data;
  };

  return data;
}

function _templateObject29() {
  var data = _taggedTemplateLiteral(["hello = 123"]);

  _templateObject29 = function _templateObject29() {
    return data;
  };

  return data;
}

function _templateObject28() {
  var data = _taggedTemplateLiteral(["1 / 0"]);

  _templateObject28 = function _templateObject28() {
    return data;
  };

  return data;
}

function _templateObject27() {
  var data = _taggedTemplateLiteral(["", " / ", ""]);

  _templateObject27 = function _templateObject27() {
    return data;
  };

  return data;
}

function _templateObject26() {
  var data = _taggedTemplateLiteral(["\n            hello = 123\n            print(hello + world)\n            world = 321\n        "]);

  _templateObject26 = function _templateObject26() {
    return data;
  };

  return data;
}

function _templateObject25() {
  var data = _taggedTemplateLiteral(["\n            hello = 123\n            print(hello + world)\n            world = 321\n        "]);

  _templateObject25 = function _templateObject25() {
    return data;
  };

  return data;
}

function _templateObject24() {
  var data = _taggedTemplateLiteral(["1 + 2"]);

  _templateObject24 = function _templateObject24() {
    return data;
  };

  return data;
}

function _templateObject23() {
  var data = _taggedTemplateLiteral(["\n            from time import sleep\n            sleep(9000)\n        "]);

  _templateObject23 = function _templateObject23() {
    return data;
  };

  return data;
}

function _templateObject22() {
  var data = _taggedTemplateLiteral(["\n                import sys\n                for line in sys.stdin:\n                    sys.stdout.write(line)\n                    sys.stdout.flush()\n            "]);

  _templateObject22 = function _templateObject22() {
    return data;
  };

  return data;
}

function _templateObject21() {
  var data = _taggedTemplateLiteral(["atomic()"]);

  _templateObject21 = function _templateObject21() {
    return data;
  };

  return data;
}

function _templateObject20() {
  var data = _taggedTemplateLiteral(["\n            def atomic():\n                hello = 123\n                return hello + 321\n        "]);

  _templateObject20 = function _templateObject20() {
    return data;
  };

  return data;
}

function _templateObject19() {
  var data = _taggedTemplateLiteral(["hello + 321"]);

  _templateObject19 = function _templateObject19() {
    return data;
  };

  return data;
}

function _templateObject18() {
  var data = _taggedTemplateLiteral(["hello = 123"]);

  _templateObject18 = function _templateObject18() {
    return data;
  };

  return data;
}

function _templateObject17() {
  var data = _taggedTemplateLiteral(["hello + 321"]);

  _templateObject17 = function _templateObject17() {
    return data;
  };

  return data;
}

function _templateObject16() {
  var data = _taggedTemplateLiteral(["del hello"]);

  _templateObject16 = function _templateObject16() {
    return data;
  };

  return data;
}

function _templateObject15() {
  var data = _taggedTemplateLiteral(["hello + 321"]);

  _templateObject15 = function _templateObject15() {
    return data;
  };

  return data;
}

function _templateObject14() {
  var data = _taggedTemplateLiteral(["hello = 123"]);

  _templateObject14 = function _templateObject14() {
    return data;
  };

  return data;
}

function _templateObject13() {
  var data = _taggedTemplateLiteral(["hello(", ", ", ")"]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _templateObject12() {
  var data = _taggedTemplateLiteral(["\n            def hello(a, b):\n                return a + b\n        "]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = _taggedTemplateLiteral(["dict(baz=123, **", ")"]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral(["sorted(", ")"]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral(["sorted(", ")"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["math.sqrt(9)"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["import math"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["type('').__name__"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["type('').__name__"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["from __future__ import unicode_literals"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["type('').__name__"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["sys.version_info[0] > 2"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["import sys"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var mkdirTemp = (0, _es6Promisify.promisify)(require('temp').mkdir);
(0, _tap.test)('leave __future__ alone!', function (t) {
  t.plan(2);
  var python = (0, _["default"])();
  python.ex(_templateObject());
  python(_templateObject2()).then(function (py3) {
    python(_templateObject3()).then(function (x) {
      return t.equal(x, 'str');
    });
    python.ex(_templateObject4());

    if (py3) {
      python(_templateObject5()).then(function (x) {
        return t.equal(x, 'str');
      });
    } else {
      python(_templateObject6()).then(function (x) {
        return t.equal(x, 'unicode');
      });
    }
  }).then(function () {
    python.end();
  }, function () {
    python.end();
  });
});
(0, _tap.test)('readme', function (t) {
  t.test('example', function (t) {
    t.plan(2);
    var python = (0, _["default"])();
    python.ex(_templateObject7());
    python(_templateObject8()).then(function (x) {
      return t.equal(x, 3);
    });
    var list = [3, 4, 2, 1];
    python(_templateObject9(), list).then(function (x) {
      return t.deepEqual(x, list.sort());
    });
    python.end();
  });
  t.test('expression', function (t) {
    t.plan(2);
    var python = (0, _["default"])(); // Interpolates arguments using JSON serialization.

    python(_templateObject10(), [6, 4, 1, 3]).then(function (x) {
      return t.deepEqual(x, [1, 3, 4, 6]);
    }); // Passing key-value arguments

    var obj = {
      hello: 'world',
      foo: 'bar'
    };
    python(_templateObject11(), obj).then(function (x) {
      t.deepEqual(x, {
        baz: 123,
        hello: 'world',
        foo: 'bar'
      });
    });
    python.end();
  });
  t.test('execute', function (t) {
    t.plan(1);
    var python = (0, _["default"])();
    var a = 123,
        b = 321;
    python.ex(_templateObject12());
    python(_templateObject13(), a, b).then(function (x) {
      return t.equal(x, a + b);
    });
    python.end();
  });
  t.test('lock', function (t) {
    t.plan(3);
    var python = (0, _["default"])();
    python.lock(function (python) {
      python.ex(_templateObject14());
      var value = python(_templateObject15());
      return new Promise(function (resolve) {
        return setTimeout(function () {
          python.ex(_templateObject16()).then(function () {
            return resolve(value);
          });
        }, 100);
      });
    }).then(function (x) {
      return t.equal(x, 444);
    });
    python(_templateObject17())["catch"](function (e) {
      if ((0, _.isPythonException)('NameError', e)) {
        t.ok(true);
      }
    });
    python.ex(_templateObject18());
    python(_templateObject19()).then(function (x) {
      return t.equal(x, 444);
    });
    python.disconnect();
  });
  t.test('lock recommended', function (t) {
    t.plan(1);
    var python = (0, _["default"])();
    python.ex(_templateObject20());
    python(_templateObject21()).then(function (x) {
      return t.equal(x, 444);
    });
    python.disconnect();
  });
  t.test('stdout', function (t) {
    t.plan(1);
    var python = (0, _["default"])({
      stdio: ['pipe', 'pipe', process.stderr]
    });
    mkdirTemp('node-python-bridge-test').then(function (tempdir) {
      var OUTPUT = _path["default"].join(tempdir, 'output.txt');

      var fs = require('fs');

      var readFileAsync = (0, _es6Promisify.promisify)(fs.readFile);
      var fileWriter = fs.createWriteStream(OUTPUT);
      python.stdout.pipe(fileWriter); // listen on Python process's stdout

      python.ex(_templateObject22()).then(function () {
        fileWriter.end();
        readFileAsync(OUTPUT, {
          encoding: 'utf8'
        }).then(function (x) {
          t.equal(x.replace(/\r/g, ''), 'hello\nworld\n');
        });
      }); // write to Python process's stdin

      python.stdin.write('hello\n');
      setTimeout(function () {
        python.stdin.write('world\n');
        python.stdin.end();
      }, 10);
      python.end();
    });
  });
  t.test('kill', function (t) {
    t.plan(2);

    var pTimeout = require('p-timeout');

    var python = (0, _["default"])();
    pTimeout(python.ex(_templateObject23()), 100).then(function (x) {
      t.ok(false);
    })["catch"](function (e) {
      if (e instanceof pTimeout.TimeoutError) {
        python.kill('SIGKILL');
        t.ok(true);
        python = (0, _["default"])();
      }
    });
    setTimeout(function () {
      python(_templateObject24()).then(function (x) {
        return t.equal(x, 3);
      });
      python.disconnect();
    }, 200);
  });
  t.test('exceptions', function (t) {
    t.plan(6);
    var python = (0, _["default"])();
    python.ex(_templateObject25())["catch"](function (e) {
      if (e instanceof python.Exception) {
        t.ok(true);
      }
    });
    python.ex(_templateObject26())["catch"](function (e) {
      if (e instanceof _["default"].PythonException) {
        t.ok(true);
      }
    });

    function pyDivide(numerator, denominator) {
      return python(_templateObject27(), numerator, denominator)["catch"](function (e) {
        if (python.isException('ZeroDivisionError', e)) {
          return Promise.resolve(Infinity);
        }
      });
    }

    pyDivide(1, 0).then(function (x) {
      t.equal(x, Infinity);
      t.equal(1 / 0, Infinity);
    });
    pyDivide(6, 2).then(function (x) {
      return t.equal(x, 3);
    });
    python(_templateObject28())["catch"](function (e) {
      if (_["default"].isPythonException('ZeroDivisionError', e)) {
        return Promise.resolve(Infinity);
      }
    }).then(function (x) {
      return t.equal(x, 1 / 0);
    });
    python.disconnect();
  });
  t.end();
});
(0, _tap.test)('nested locks', function (t) {
  t.plan(3);
  var python = (0, _["default"])();
  python.lock(function (python) {
    python.ex(_templateObject29());
    var $value1 = python(_templateObject30());
    var $value2 = python.lock(function (python) {
      python.ex(_templateObject31());
      return python(_templateObject32());
    });
    return new Promise(function (resolve) {
      return setTimeout(function () {
        python.ex(_templateObject33()).then(function () {
          return Promise.all([$value1, $value2]).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                value1 = _ref2[0],
                value2 = _ref2[1];

            resolve(value1 + value2);
          });
        });
      }, 100);
    });
  }).then(function (x) {
    return t.equal(x, 1443);
  });
  python(_templateObject34())["catch"](function (e) {
    if ((0, _.isPythonException)('NameError', e)) {
      t.ok(true);
    }
  });
  python.ex(_templateObject35());
  python(_templateObject36()).then(function (x) {
    return t.equal(x, 444);
  });
  python.disconnect();
});
(0, _tap.test)('exceptions', function (t) {
  t.plan(3);
  var python = (0, _["default"])();
  python(_templateObject37())["catch"](function () {
    return t.ok(true);
  });
  python(_templateObject38())["catch"](function (e) {
    if (e instanceof ReferenceError) {
      t.ok(false);
    } else {
      return Promise.reject(e);
    }
  })["catch"](function (e) {
    if (e instanceof _.PythonException) {
      t.ok(true);
    }
  });
  python(_templateObject39())["catch"](function (e) {
    if ((0, _.isPythonException)('IOError', e)) {
      t.ok(false);
    } else {
      return Promise.reject(e);
    }
  })["catch"](function (e) {
    if ((0, _.isPythonException)('ZeroDivisionError', e)) {
      t.ok(true);
    }
  });
  python.end();
});
(0, _tap.test)('json interpolation', function (t) {
  t.equal(_["default"].json(_templateObject40()), 'def hello(a, b):\n    return a + b\n');
  t.equal(_["default"].json(_templateObject41()), 'hello()');
  t.equal(_["default"].json(_templateObject42(), 'world'), 'hello("world")');
  t.equal(_["default"].json(_templateObject43(), 'world', [1, 2, 3]), 'hello("world", [1, 2, 3])');
  t.equal(_["default"].json(_templateObject44(), new Map([[1, 2], [3, 4]])), 'hello({1: 2, 3: 4})');
  t.equal(_["default"].json(_templateObject45(), NaN, Infinity, -Infinity), "hello(float('nan'), float('inf'), float('-inf'))");
  t.end();
});
(0, _tap.test)('bug #22 returning NaN or infinity does not work', function (t) {
  t.plan(1);
  var s = {
    a: NaN,
    b: Infinity,
    c: -Infinity
  };
  var python = (0, _["default"])();
  python(_templateObject46(), s).then(function (x) {
    return t.deepEqual(x, s);
  });
  python.end();
});
(0, _tap.test)('bug #24 support more than just numbers and strings', function (t) {
  t.plan(1);
  var s = {
    a: 'asdf',
    b: 1,
    c: true,
    d: [1, 2, null]
  };
  var python = (0, _["default"])();
  python(_templateObject47(), s).then(function (x) {
    return t.deepEqual(x, s);
  });
  python.end();
});
