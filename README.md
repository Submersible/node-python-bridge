# python-bridge [![Build Status](https://secure.travis-ci.org/Submersible/node-python-bridge.png?branch=master)](http://travis-ci.org/Submersible/node-python-bridge)

Most robust and simple Python bridge.  [Features](#features), and [comparisons](#comparisons) to other Python bridges below.

```
npm install python-bridge
```

```javascript
'use strict';

let assert = require('assert');
let Promise = require('bluebird');
let pythonBridge = require('python-bridge');

let pythonResource = pythonBridge(); // start Python interpreter

Promise.using(pythonResource, function *(python) { // resource management, closes interpreter when done
  python`import math`;
  let sqrt = yield python`math.sqrt(9)`; // commands queue up, so no need to wait on `import math`
  assert.equal(sqrt, 3);

  let list = [3, 4, 2, 1];
  let sorted = yield python`sorted(${list})`;
  assert.deepEqual(sorted, list.sort());
});
```

# API

## let python = pythonBridge(options)

Spawns a Python interpreter, exposing a bridge to the running processing.

* `options.python` - Python interpreter, defaults to `'python'`
* `options.cwd` - Working directory of the Python process, defaults to `process.cwd()`
* `options.env` - Environment variables, defaults to `process.env`
* `options.stdin` - Defaults to `'pipe'`
* `options.stdout` - Defaults to `process.stdout`
* `options.stderr` - Defaults to `process.stderr`
* `options.uid` - Number Sets the user identity of the process.
* `options.gid` - Number Sets the group identity of the process.

```javascript
var python = pythonBridge({
  python: 'python3',
  env: {PYTHONPATH: '/foo/bar'}
});
```

## python&#96;code&#96;.then(...)  

Runs Python code in the interpreter, returning the value back to Node.

```javascript
Promise.using(python, function *(python) {
  // Interpolates arguments using JSON serialization.
  let x = yield python`sorted(${[6, 4, 1, 3]})`;
  assert.deepEqual(x, [1, 3, 4, 6]);

  // Passing key-value arguments
  let obj = {hello: 'world', foo: 'bar'};
  let dict = yield python`dict(baz=123, **${obj})`;
  assert.deepEqual(dict, {baz: 123, hello: 'world', foo: 'bar'});

  // Define function in Python
  python`
    def hello(a, b):
      return a + b
  `;

  // Then call it
  let a = 123, b = 321;
  let hello = python`hello(${a}, ${b})`;
  assert.equal(hello, a + b);
});
```

## python.lock(python => ...).then(...)

Locks access to the Python interpreter so code can be executed atomically.  If possible, it's recommend to define a function in Python to handle atomicity.  

```javascript
Promise.using(python, function *(python) {
  let lock = yield python.lock(function *() {
    python`hello = 123`;
    let value = yield python`hello + 321'`;
    return value;
  });
  assert.equal(lock, 444);

  // If possible, it's better to define a Python function to do things atomically
  python`
    def atomic():
      hello = 123
      return hello + 321
  `;
  let atomic = python`atomic()`;
  assert.equal(atomic, 444);
});
```

## python.stdin, python.stdout, python.stderr

Pipes going into the Python process, separate from execution & evaluation.  This can be used to stream data between processes, without buffering.

```javascript
'use strict';

let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));

let python = pythonBridge({stdout: 'pipe'});

// listen on Python process's stdout
Promse.using(python, function *(python) {
  let fileWriter = fs.createWriteStream('output.txt');
  python.stdout.pipe(fileWriter);

  yield python`
    import sys
    for line in sys.stdin:
      sys.stdout.write(line)
      sys.stdout.flush()
  `;
  fileWriter.end();
  let output = yield fs.readFileAsync('output.txt', {encoding: 'utf8'});
  assert.equal(output, 'hello\nworld\n'));
});

// write to Python process's stdin
Promse.using(python, function *(python) {
  python.stdin.write('hello\n');
  yield Promise.delay(10);
  python.stdin.write('world\n');
  python.stdin.end();
});
```

## python.end()

Stops accepting new Python commands, and waits for queue to finish then gracefully closes the Python process.

## python.kill([signal])

Send signal to Python process, same as [`child_process child.kill`](https://nodejs.org/api/child_process.html#child_process_event_exit).

```javascript
let Promise = require('bluebird');
let pythonResource = pythonBridge();

Promise.using(pythonResource, function *(python) {
  try {
    yield python`
        from time import sleep
        sleep(9000)
    `.timeout(100);
    assert.ok(false); // shouldn't ever hit this
  } catch (e) {
    if (e instanceof Promise.TimeoutError) {
      console.error('Python process taking too long, restarted.');
      python.kill('SIGKILL');
      pythonResource = pythonBridge();
    } else {
      throw e;
    }
  }
});
```

# Handling Exceptions

We can use Bluebird's [`promise.catch(...)`](http://bluebirdjs.com/docs/api/catch.html) catch handler in combination with Python's typed Exceptions to make exception handling easy.

## pythonBridge.PythonException

Catch any raised Python exception.

```javascript
python`
    hello = 123
    print(hello + world)
    world = 321
`.catch(PythonException, () => console.log('Woops!  `world` was used before it was defined.'));
```

## pythonBridge.isPythonException

Catch a Python exception matching the passed name.

```javascript
function pyDivide(numerator, denominator) {
    return python`${numerator} / ${denominator}`
        .catch(isPythonException('ZeroDivisionError'), () => Promise.resolve(Infinity));
}
pyDivide(1, 0).then(x => {
    assert.equal(x, Infinity);
    assert.equal(1 / 0, Infinity);
});
```

----

# Features

* Does not affect Python's stdin, stdout, or stderr pipes.
* Exception stack traces forwarded to Node for easy debugging.
* Python 2 & 3 support, end-to-end tested.
* Command queueing, with promises.
* Long running Python sessions.
* ES6 template tags for easy interpolation & multiline code.

# Comparisons

After evaluating of the existing landscape of Python bridges, the following issues are why python-bridge was built.

* [python-shell](https://github.com/extrabacon/python-shell) — No promises for queued requests; broken evaluation parser; conflates evaluation and stdout; complex configuration.
* [python](https://github.com/73rhodes/node-python) — Broken evaluation parsing; no exception handling; conflates evaluation, stdout, and stderr.
* [node-python](https://github.com/JeanSebTr/node-python) — Complects execution protocol with incomplete Python embedded DSL.
* [python-runner](https://github.com/teamcarma/node-python-runner) — No long running sessions; `child_process.spawn` wrapper with unintuitive API; no serialization.
* [python.js](https://github.com/monkeycz/python.js) — Embeds specific version of CPython; requires compiler and CPython dev packages; incomplete Python embedded DSL.
* [cpython](https://github.com/eljefedelrodeodeljefe/node-cpython) — Complects execution protocol with incomplete Python embedded DSL.
* [eval.py](https://www.npmjs.com/package/eval.py) — Can only evaluate single line expressions.
* [py.js](https://www.npmjs.com/package/py.js) — For setting up virtualenvs only.

# License

MIT
