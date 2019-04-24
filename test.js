'use strict';

import pythonBridge from './';
import {PythonException, isPythonException} from './';
import {test} from 'tap';
import path from 'path';
import {promisify} from 'es6-promisify';
const mkdirTemp = promisify(require('temp').mkdir);

test('leave __future__ alone!', t => {
    t.plan(2);

    const python = pythonBridge();
    python.ex`import sys`;
    python`sys.version_info[0] > 2`.then(py3 => {
        python`type('').__name__`.then(x => t.equal(x, 'str'));
        python.ex`from __future__ import unicode_literals`;
        if (py3) {
            python`type('').__name__`.then(x => t.equal(x, 'str'));
        } else {
            python`type('').__name__`.then(x => t.equal(x, 'unicode'));
        }
    }).then(() => {
        python.end();
    }, () => {
        python.end();
    });
});

test('readme', t => {
    t.test('example', t => {
        t.plan(2);

        const python = pythonBridge();
        python.ex`import math`;
        python`math.sqrt(9)`.then(x => t.equal(x, 3));

        const list = [3, 4, 2, 1];
        python`sorted(${list})`.then(x => t.deepEqual(x, list.sort()));

        python.end();
    });

    t.test('expression', t => {
        t.plan(2);

        const python = pythonBridge();
        // Interpolates arguments using JSON serialization.
        python`sorted(${[6, 4, 1, 3]})`.then(x => t.deepEqual(x, [1, 3, 4, 6]));

        // Passing key-value arguments
        const obj = {hello: 'world', foo: 'bar'};
        python`dict(baz=123, **${obj})`.then(x => {
            t.deepEqual(x, {baz: 123, hello: 'world', foo: 'bar'});
        });
        python.end();
    });

    t.test('execute', t => {
        t.plan(1);

        const python = pythonBridge();
        const a = 123, b = 321;
        python.ex`
            def hello(a, b):
                return a + b
        `;
        python`hello(${a}, ${b})`.then(x => t.equal(x, a + b));
        python.end();
    });

    t.test('lock', t => {
        t.plan(3);

        const python = pythonBridge();

        python.lock(python => {
            python.ex`hello = 123`;
            const value = python`hello + 321`;
            return new Promise(resolve => setTimeout(() => {
                python.ex`del hello`.then(() => resolve(value));
            }, 100));
        }).then(x => t.equal(x, 444));

        python`hello + 321`.catch(e => {
            if (isPythonException('NameError', e)) {
                t.ok(true);
            }
        });
        python.ex`hello = 123`;
        python`hello + 321`.then(x => t.equal(x, 444));

        python.disconnect();
    });

    t.test('lock recommended', t => {
        t.plan(1);

        const python = pythonBridge();

        python.ex`
            def atomic():
                hello = 123
                return hello + 321
        `;
        python`atomic()`.then(x => t.equal(x, 444));

        python.disconnect();
    });

    t.test('stdout', t => {
        t.plan(1);
        const python = pythonBridge({stdio: ['pipe', 'pipe', process.stderr]});

        mkdirTemp('node-python-bridge-test').then(tempdir => {
            const OUTPUT = path.join(tempdir, 'output.txt');

            const fs = require('fs');
            const readFileAsync = promisify(fs.readFile);
            const fileWriter = fs.createWriteStream(OUTPUT);

            python.stdout.pipe(fileWriter);

            // listen on Python process's stdout
            python.ex`
                import sys
                for line in sys.stdin:
                    sys.stdout.write(line)
                    sys.stdout.flush()
            `.then(function () {
                fileWriter.end();
                readFileAsync(OUTPUT, {encoding: 'utf8'}).then(x => {
                    t.equal(x.replace(/\r/g, ''), 'hello\nworld\n')
                });
            });

            // write to Python process's stdin
            python.stdin.write('hello\n');
            setTimeout(() => {
                python.stdin.write('world\n');
                python.stdin.end();
            }, 10);

            python.end();
        });
    });

    t.test('kill', t => {
        t.plan(2);

        const pTimeout = require('p-timeout');
        let python = pythonBridge();

        pTimeout(python.ex`
            from time import sleep
            sleep(9000)
        `, 100).then(x => {
            t.ok(false);
        }).catch(e => {
            if (e instanceof pTimeout.TimeoutError) {
                python.kill('SIGKILL');
                t.ok(true);
                python = pythonBridge();
            }
        });
        setTimeout(() => {
            python`1 + 2`.then(x => t.equal(x, 3));
            python.disconnect();
        }, 200);
    });

    t.test('exceptions', t => {
        t.plan(6);

        const python = pythonBridge();

        python.ex`
            hello = 123
            print(hello + world)
            world = 321
        `.catch(e => {
            if (e instanceof python.Exception) {
                t.ok(true);
            }
        });

        python.ex`
            hello = 123
            print(hello + world)
            world = 321
        `.catch(e => {
            if (e instanceof pythonBridge.PythonException) {
                t.ok(true);
            }
        });

        function pyDivide(numerator, denominator) {
            return python`${numerator} / ${denominator}`
                .catch(e => {
                    if (python.isException('ZeroDivisionError', e)) {
                        return Promise.resolve(Infinity);
                    }
                });
        }

        pyDivide(1, 0).then(x => {
            t.equal(x, Infinity);
            t.equal(1 / 0, Infinity);
        });
        pyDivide(6, 2).then(x => t.equal(x, 3));

        python`1 / 0`
            .catch(e => {
                if (pythonBridge.isPythonException('ZeroDivisionError', e)) {
                    return Promise.resolve(Infinity);
                }
            })
            .then(x => t.equal(x, 1 / 0));

        python.disconnect();
    });

    t.end();
});

test('nested locks', t => {
    t.plan(3);

    const python = pythonBridge();

    python.lock(python => {
        python.ex`hello = 123`;
        const $value1 = python`hello + 321`;
        const $value2 = python.lock(python => {
            python.ex`world = 808`;
            return python`world + 191`;
        });
        return new Promise(resolve => setTimeout(() => {
            python.ex`del hello`.then(() => {
                return Promise.all([$value1, $value2]).then(([value1, value2]) => {
                    resolve(value1 + value2);
                })
            });
        }, 100));
    }).then(x => t.equal(x, 1443));

    python`hello + 808`.catch(e => {
        if (isPythonException('NameError', e)) {
            t.ok(true);
        }
    });
    python.ex`hello = 123`;
    python`hello + 321`.then(x => t.equal(x, 444));

    python.disconnect();
});

test('exceptions', t => {
    t.plan(3);

    const python = pythonBridge();
    python`1 / 0`.catch(() => t.ok(true));
    python`1 / 0`
        .catch(e => {
            if (e instanceof ReferenceError) {
                t.ok(false);
            } else {
                return Promise.reject(e);
            }
        })
        .catch(e => {
            if (e instanceof PythonException) {
                t.ok(true);
            }
        });
    python`1 / 0`
        .catch(e => {
            if (isPythonException('IOError', e)) {
                t.ok(false)
            } else {
                return Promise.reject(e);
            }
        })
        .catch(e => {
            if (isPythonException('ZeroDivisionError', e)) {
                t.ok(true)
            }
        });
    python.end();
});

test('json interpolation', t => {
    t.equal(pythonBridge.json`
        def hello(a, b):
            return a + b
    `, 'def hello(a, b):\n    return a + b\n');
    t.equal(pythonBridge.json`hello()`, 'hello()');
    t.equal(pythonBridge.json`hello(${'world'})`, 'hello("world")');
    t.equal(pythonBridge.json`hello(${'world'}, ${[1, 2, 3]})`, 'hello("world", [1, 2, 3])');
    t.equal(pythonBridge.json`hello(${new Map([[1, 2], [3, 4]])})`, 'hello({1: 2, 3: 4})');
    t.equal(pythonBridge.json`hello(${NaN}, ${Infinity}, ${-Infinity})`, "hello(float('nan'), float('inf'), float('-inf'))");
    t.end();
});

test('bug #22 returning NaN or infinity does not work', t => {
    t.plan(1);
    const s = {a: NaN, b: Infinity, c: -Infinity};
    const python = pythonBridge();
    python`(lambda x: x)(${s})`.then(x => t.deepEqual(x, s));
    python.end();
});

test('bug #24 support more than just numbers and strings', t => {
    t.plan(1);
    const s = {a: 'asdf', b: 1, c: true, d: [1, 2, null]};
    const python = pythonBridge();
    python`(lambda x: x)(${s})`.then(x => t.deepEqual(x, s));
    python.end();
});
