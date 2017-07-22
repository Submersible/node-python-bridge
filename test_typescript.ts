import { test } from 'tap';
import { join as path_join } from 'path';
import { promisify } from 'bluebird';
import { pythonBridge, PythonException, isPythonException } from './index';

const mkdirTemp = promisify(require('temp').mkdir);

test('readme', t => {
    t.test('example', async assert => {
        const python = pythonBridge();
        try {
            await python.ex`import math`;
            const x = await python`math.sqrt(9)`;
            assert.equal(x, 3);

            const list = [3, 4, 2, 1];
            const sorted = await python`sorted(${list})`;
            assert.deepEqual(sorted, list.sort());
        } finally {
            python.end();
        }
    });

    t.test('expression', async assert => {
        let python = pythonBridge();
        try {
            // Interpolates arguments using JSON serialization.
            assert.deepEqual([1, 3, 4, 6], await python`sorted(${[6, 4, 1, 3]})`);

            // Passing key-value arguments
            const obj = {hello: 'world', foo: 'bar'};
            assert.deepEqual(
                {baz: 123, hello: 'world', foo: 'bar'},
                await python`dict(baz=123, **${obj})`
            );
        } finally {
            python.end();
        }
    });

    t.test('execute', async assert => {
        const python = pythonBridge();
        try {
            const a = 123, b = 321;
            python.ex`
                def hello(a, b):
                    return a + b
            `;
            assert.equal(a + b, await python`hello(${a}, ${b})`);
        } finally {
            python.end();
        }
    });

    t.test('lock', async assert => {
        const python = pythonBridge();
        try {
            const x: number = await python.lock(async python =>{
                await python.ex`hello = 123`;
                return await python`hello + 321`;
            });
            assert.equal(x, 444);

            // Recommended to define function in Python
        } finally {
            python.end();
        }
    });

    t.test('lock recommended', async assert => {
        const python = pythonBridge();
        try {
            const x: number = await python.lock(async python =>{
                await python.ex`hello = 123`;
                return await python`hello + 321`;
            });
            assert.equal(x, 444);
        } finally {

            python.end();
        }
    });


    t.test('stdout', async assert => {
        const python = pythonBridge({stdio: ['pipe', 'pipe', process.stderr]})

        try {
            const tempdir = await mkdirTemp('node-python-bridge-test');
            const OUTPUT = path_join(tempdir, 'output.txt');

            const { delay, promisifyAll } = require('bluebird');
            const { createWriteStream, readFileAsync } = promisifyAll(require('fs'));
            const fileWriter = createWriteStream(OUTPUT);

            python.stdout.pipe(fileWriter);

            // listen on Python process's stdout
            const stdinToStdout = python.ex`
                import sys
                for line in sys.stdin:
                    sys.stdout.write(line)
                    sys.stdout.flush()
            `;

            // write to Python process's stdin
            python.stdin.write('hello\n');
            await delay(10);
            python.stdin.write('world\n');

            // close python's stdin, and wait for python to finish writing
            python.stdin.end();
            await stdinToStdout;

            // assert file contents is the same as what was written
            const fileContents = await readFileAsync(OUTPUT, {encoding: 'utf8'});
            assert.equal(fileContents.replace(/\r/g, ''), 'hello\nworld\n');
        } finally {
            python.end();
        }
    });

    t.test('kill', async assert => {

        let python = pythonBridge();

        let {TimeoutError} = require('bluebird');

        try {
            await python.ex`
                from time import sleep
                sleep(9000)
            `.timeout(100);
            assert.ok(false); // should not reach this
        } catch (e) {
            if (e instanceof TimeoutError) {
                python.kill('SIGKILL');
                python = pythonBridge();
            } else {
                throw e;
            }
        }
        python.end();
    });

    t.test('exceptions', async assert => {
        let python = pythonBridge();

        try {
            await python.ex`
                hello = 123
                print(hello + world)
                world = 321
            `;
            assert.ok(false);
        } catch (e) {
            assert.ok(e instanceof PythonException);
        }

        async function pyDivide(numerator, denominator) {
            try {
                await python`${numerator} / ${denominator}`;
            } catch (e) {
                if (isPythonException('ZeroDivisionError', e)) {
                    return Infinity;
                }
                throw e;
            }
        }

        async function main() {
            assert.equal(Infinity, await pyDivide(1, 0));
            assert.equal(1 / 0, await pyDivide(1, 0));
        }
        await main();

        python.end();
    });

    t.end();
});