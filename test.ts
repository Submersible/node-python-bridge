#!/usr/bin/env ts-node

import { pythonBridge } from './index';

const { test } = require('tap');

test('TypeScript', async t => {
    t.plan(1);

    let python = pythonBridge();
    let a = 123, b = 321;
    python.ex`
        def hello(a, b):
            return a + b
    `;
    const x = await python`hello(${a}, ${b})`
    t.equal(x, a + b, 'should get the same result between node & python')
    python.end();
});
