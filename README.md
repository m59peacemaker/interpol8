# interpol8

Basic templating by interpolating values into placeholders.

## install

```sh
npm install interpol8
```

## example

```js
const interpolate = require('interpol8')

interpolate(
  'Hello, {{place}}',
  {place: 'world'}
) // -> 'Hello, world'

// nested, arrays, brackets, dots, whatever, it all works as one would expect
interpolate(
  'Hello, {{[0].foo.bar["places"][1]}}',
  [{foo: bar: {{places: ['', 'world']}}}]
) // -> 'Hello, world'

// custom delimiters
interpolate(
  'Hello, <% place %>',
  {place: 'world'},
  {left: '<%', right: '%>'}
) // -> 'Hello, world'
```

## API

### `interpolate(template, data, options)`

- `template: string`
- `data: object`
- `options: object`
  - `left: string, {{` left delimiter
  - `right: string, }}` right delimiter
