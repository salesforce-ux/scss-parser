'use strict'

const _ = require('lodash')

let type = {
  arguments: (n) =>
    '(' + walkValue(n.value) + ')',
  atkeyword: (n) =>
    '@' + n.value,
  attribute: (n) =>
    '[' + walkValue(n.value) + ']',
  block: (n) =>
    '{' + walkValue(n.value) + '}',
  class: (n) =>
    '.' + walkValue(n.value),
  color_hex: (n) =>
    '#' + n.value,
  id: (n) =>
    '#' + walkValue(n.value),
  interpolation: (n) =>
    '#{' + walkValue(n.value) + '}',
  comment_multiline: (n) =>
    '/*' + n.value + '*/',
  comment_singleline: (n) =>
    '//' + n.value,
  parentheses: (n) =>
    '(' + walkValue(n.value) + ')',
  pseudo_class: (n) =>
    ':' + walkValue(n.value),
  psuedo_element: (n) =>
    '::' + walkValue(n.value),
  string_double: (n) =>
   `"${n.value}"`,
  string_single: (n) =>
   `'${n.value}'`,
  variable: (n) =>
    '$' + n.value
}

let walkNode = (node) => {
  if (type[node.type]) return type[node.type](node)
  if (_.isString(node.value)) return node.value
  if (_.isArray(node.value)) return walkValue(node.value)
  return ''
}

let walkValue = (value) => {
  if (!_.isArray(value)) return ''
  return value.reduce((s, node) => {
    return s + walkNode(node)
  }, '')
}

module.exports = (node) => walkNode(node)
