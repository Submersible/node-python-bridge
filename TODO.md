# TODO

# Non-ES6 API

## python(expression, args...).then(...)

Evaluates an expression, or calls an expression with arguments.

```javascript
python('2 + 2').then((x) => assert.equal(x, 4));
python('sorted', [6, 4, 1, 3]).then((x) => assert.deepEqual(x, [1, 3, 4, 6]));
```

## python.ex(statement).then(...)

Execute a statement that does not return a value.

```javascript
python.ex('import math').then(function () {
    console.log('Python library `math` imported');
});
```

## python.kw(expression, args..., kwargs).then(...)

Calls an expression, with arguments, and the last being an object of key-value arguments.

```javascript
let obj = {hello: 'world', foo: 'bar'};
python.kw('dict', obj).then(function (x) {
    assert.notStrictEqual(x, obj);
    assert.deepEqual(x, obj);
});
```
