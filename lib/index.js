'use strict'

const createInputStream = require('./input-stream')
const createTokenStream = require('./token-stream')

const _parse = require('./parse')
const _stringify = require('./stringify')

/**
 * Parse the proivded input as a @{link Node}
 *
 * @param {string} css
 * @returns {Node}
 */
let parse = (css) =>
  _parse(createTokenStream(createInputStream(css)))

/**
 * Convert a @{link Node} back into a stirng
 *
 * @param {Node} node
 * @returns {string}
 */
let stringify = (node) => _stringify(node)

module.exports = {
  parse,
  stringify
}
