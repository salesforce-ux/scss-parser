'use strict'

const _ = require('lodash')

const createInputStream = require('../lib/input-stream')
const createTokenStream = require('../lib/token-stream')
const parse = require('../lib/parse')

let cleanNode = (node) => {
  let clone = _.pick(_.clone(node), ['type', 'value'])
  clone.value = _.isArray(clone.value)
    ? clone.value.map(cleanNode) : clone.value
  return clone
}

let createAST = (input) =>
  cleanNode(parse(createTokenStream(createInputStream(input))))

module.exports = {
  createInputStream,
  createTokenStream,
  parse,
  cleanNode,
  createAST
}
