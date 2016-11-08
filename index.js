var at = require('object-at')
var Regex = require('interpolate-regex')

var defaults = {
  left: '{{',
  right: '}}'
}

var interpolate = function (template, data, options) {
  options = options || defaults
  if (options.left === undefined || options.right === undefined) {
    throw new Error('left and right delimiters required')
  }
  var regex = Regex(options.left, options.right, true)
  return template.replace(regex, function (_, contents) {
    return at(data, contents.trim()) || ''
  })
}

module.exports = interpolate
