const test = require('tape')
const tryCatch = require('try_catch')
const interpolate = require('../')

test('is simple {{foo}}', t => {
  t.plan(1)
  t.equal(interpolate('{{foo}}', {foo: 'abc'}), 'abc')
})

test('space inside placeholders', t => {
  t.plan(3)
  t.equal(interpolate('{{ foo}}', {foo: 'abc'}), 'abc')
  t.equal(interpolate('{{foo }}', {foo: 'abc'}), 'abc')
  t.equal(interpolate('{{ foo }}', {foo: 'abc'}), 'abc')
})

test('ignores empty {{}}', t => {
  t.plan(1)
  t.equal(interpolate('{{}}', {}), '')
})

test('multiple simple', t => {
  t.plan(1)
  t.equal(
    interpolate('I {{violence}} the {{role}}', {violence: 'shot', role: 'sheriff'}),
    'I shot the sheriff'
  )
})

test('nested {{foo.bar}}', t => {
  t.plan(1)
  t.equal(interpolate('Cannot {{touch.this}}', {touch: {this: 'touch dis'}}), 'Cannot touch dis')
})

test('bracket syntax', t => {
  t.plan(2)
  t.equal(interpolate('{{foo["bar"]}}', {foo: {bar: 'abc'}}), 'abc')
  t.equal(interpolate('{{foo["bar"].baz}}', {foo: {bar: {baz: 'abc'}}}), 'abc')
})

test('arrays', t => {
  t.plan(5)
  t.equal(interpolate('{{0}}', ['foo']), 'foo')
  t.equal(interpolate('{{1.foo}}', [{}, {foo: 123}]), '123')
  t.equal(interpolate('{{1[0]}}', [{}, [123]]), '123')
  t.equal(interpolate('{{[1][0]}}', [{}, [123]]), '123')
  t.equal(interpolate('{{foo["bar"][1]}}', {foo: {bar: ['abc', 123]}}), '123')
})

test('custom delimiter ${}', t => {
  const options = {left: '${', right: '}'}
  t.plan(3)
  t.equal(interpolate('${foo}', {foo: 'abc'}, options), 'abc')
  t.equal(
    interpolate('I can ${doIt} all the way to schfifty ${n}.', {doIt: 'count', n: 'five'}, options),
    'I can count all the way to schfifty five.'
  )
  t.equal(
    interpolate('a$ $ b $ c d$ {} $${foo} $ {foo} ${', {foo: '  abc '}, options),
                'a$ $ b $ c d$ {} $  abc  $ {foo} ${'
  )
})

test('requires left and right delimiters', t => {
  t.plan(3)
  tryCatch(() => interpolate('{{foo}}', {foo: 'abc'}, {}), t.pass)
  tryCatch(() => interpolate('{{foo}}', {foo: 'abc'}, {left: '{{'}), t.pass)
  tryCatch(() => interpolate('{{foo}}', {foo: 'abc'}, {right: '}}'}), t.pass)
})

// just verifying that nesting is not supported
// nesting is advanced, maybe requires tokenizing instead of a simple regex replace
// it's also weird to nest this way
test('processes placeholders left to right - does not consider nesting', t => {
  t.plan(1)
  t.equal(
    interpolate(
      '{{foo.{{prop}}}}',
      {foo: {'{{prop': '123', bar: 'abc'}, prop: 'bar'}
    ),
    '123}}'
  )
})
