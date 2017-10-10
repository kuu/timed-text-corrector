const test = require('ava');
const util = require('../../libs/util');

test('util:safePropAccess', t => {
  t.is(util.safePropAccess(), undefined);
  t.is(util.safePropAccess(undefined, 'a'), undefined);
  t.is(util.safePropAccess({}, 'a'), undefined);
  t.is(util.safePropAccess({a: 1}, 'a'), 1);
  t.is(util.safePropAccess({a: 1}, 'a.b'), undefined);
  t.is(util.safePropAccess({a: {b: 2}}, 'a.b'), 2);
  t.is(util.safePropAccess({a: {b: 2}}, 'a.b.c'), undefined);
  t.is(util.safePropAccess({a: {b: {c: 3}}}, 'a.b.c'), 3);
});
