# python-bridge [![Build Status](https://secure.travis-ci.org/Submersible/node-python-bridge.png?branch=master)](http://travis-ci.org/Submersible/node-python-bridge) [![Build Status](https://ci.appveyor.com/api/projects/status/8h64yyve684nn900/branch/master?svg=true)](https://ci.appveyor.com/project/munro/node-python-bridge/branch/master)

Most robust and simple Python bridge.  [Features](#features), and [comparisons](#comparisons) to other Python bridges below, supports Windows.

# API

[View documentation with TypeScript examples.](README.ts.md)

```
npm install python-bridge
```

```javascript
'use strict';

let assert = require('assert');
let pythonBridge = require('python-bridge');

let python = pythonBridge();

python.ex`import math`;
python`math.sqrt(9)`.then(x => assert.equal(x, 3));

let list = [3, 4, 2, 1];
python`sorted(${list})`.then(x => assert.deepEqual(x, list.sort()));

python.end();
```

## var python = pythonBridge(options)

Spawns a Python interpreter, exposing a bridge to the running processing.  Configurable via `options`.

* `options.python` - Python interpreter, defaults to `python`

Also inherits the following from [`child_process.spawn([options])`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).

* `options.cwd` - String Current working directory of the child process
* `options.env` - Object Environment key-value pairs
* `options.stdio` - Array Child's stdio configuration. Defaults to `['pipe', process.stdout, process.stderr]`
* `options.uid` - Number Sets the user identity of the process.
* `options.gid` - Number Sets the group identity of the process.

```javascript
var python = pythonBridge({
    python: 'python3',
    env: {PYTHONPATH: '/foo/bar'}
});
```

## python`` `expression(args...)` ``.then(...)

Evaluates Python code, returning the value back to Node.

```javascript
// Interpolates arguments using JSON serialization.
python`sorted(${[6, 4, 1, 3]})`.then(x => assert.deepEqual(x, [1, 3, 4, 6]));

// Passing key-value arguments
let obj = {hello: 'world', foo: 'bar'};
python`dict(baz=123, **${obj})`.then(x => {
    assert.deepEqual(x, {baz: 123, hello: 'world', foo: 'bar'});
});
```

## python.ex`` `statement` ``.then(...)

Execute Python statements.

```javascript
let a = 123, b = 321;
python.ex`
    def hello(a, b):
        return a + b
`;
python`hello(${a}, ${b})`.then(x => assert.equal(x, a + b));
```

## python.lock(...).then(...)

Locks access to the Python interpreter so code can be executed atomically.  If possible, it's recommend to define a function in Python to handle atomicity.

```javascript
python.lock(python => {
    python.ex`hello = 123`;
    return python`hello + 321'`;
}).then(x => assert.equal(x, 444));

// Recommended to define function in Python
python.ex`
    def atomic():
        hello = 123
        return hello + 321
`;
python`atomic()`.then(x => assert.equal(x, 444));
```

## python.stdin, python.stdout, python.stderr

Pipes going into the Python process, separate from execution & evaluation.  This can be used to stream data between processes, without buffering.

```javascript
let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));

let fileWriter = fs.createWriteStream('output.txt');

python.stdout.pipe(fileWriter);

// listen on Python process's stdout
python.ex`
    import sys
    for line in sys.stdin:
        sys.stdout.write(line)
        sys.stdout.flush()
`.then(function () {
    fileWriter.end();
    fs.readFileAsync('output.txt', {encoding: 'utf8'}).then(x => assert.equal(x, 'hello\nworld\n'));
});

// write to Python process's stdin
python.stdin.write('hello\n');
setTimeout(() => {
    python.stdin.write('world\n');
    python.stdin.end();
}, 10);
```

## python.end()

Stops accepting new Python commands, and waits for queue to finish then gracefully closes the Python process.

## python.disconnect()

_Alias to [`python.end()`](#python-end)_

## python.kill([signal])

Send signal to Python process, same as [`child_process child.kill`](https://nodejs.org/api/child_process.html#child_process_event_exit).

```javascript
let Promise = require('bluebird');

python.ex`
    from time import sleep
    sleep(9000)
`.timeout(100).then(x => {
    assert.ok(false);
}).catch(Promise.TimeoutError, (exit_code) => {
    console.error('Python process taking too long, restarted.');
    python.kill('SIGKILL');
    python = pythonBridge();
});
```

# Handling Exceptions

We can use Bluebird's [`promise.catch(...)`](http://bluebirdjs.com/docs/api/catch.html) catch handler in combination with Python's typed Exceptions to make exception handling easy.


## python.Exception

Catch any raised Python exception.

```javascript
python.ex`
    hello = 123
    print(hello + world)
    world = 321
`.catch(python.Exception, () => console.log('Woops!  `world` was used before it was defined.'));
```

## python.isException(name)

Catch a Python exception matching the passed name.

```javascript
function pyDivide(numerator, denominator) {
    return python`${numerator} / ${denominator}`
        .catch(python.isException('ZeroDivisionError'), () => Promise.resolve(Infinity));
}
pyDivide(1, 0).then(x => {
    assert.equal(x, Infinity);
    assert.equal(1 / 0, Infinity);
});
```

## pythonBridge.PythonException

_Alias to `python.Exception`, this is useful if you want to import the function to at the root of the module._

## pythonBridge.isPythonException

_Alias to `python.isException`, this is useful if you want to import the function to at the root of the module._

----

# Features

* Does not affect Python's stdin, stdout, or stderr pipes.
* Exception stack traces forwarded to Node for easy debugging.
* Python 2 & 3 support, end-to-end tested.
* Windows support, end-to-end tested.
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
