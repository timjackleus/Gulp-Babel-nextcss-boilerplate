const fs = require('fs');
const test = require('tape');

const multiply = require('../source/js/components/multiply.js');

test('Multiply 2 with 2', (t) => {
  const actual = multiply(2);
  const expected = 4;

  t.equal(actual, expected);
  t.end();
});
