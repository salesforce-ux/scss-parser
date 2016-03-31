'use strict'

const _ = require('lodash')

/*
 * @typedef {object} InputStream~Position
 * @property {number} cursor
 * @property {number} line
 * @property {number} column
 */

/**
 * Yield characters from a string
 *
 * @protected
 * @class
 */
class InputStream {
  /**
   * Create a new InputStream
   *
   * @param {string} input
   */
  constructor (input) {
    this.input = input
    this.cursor = 0
    this.line = 1
    this.column = 0
  }
  /**
   * Return an object that contains the currrent cursor, line, and column
   *
   * @public
   * @returns {InputStream~Position}
   */
  position () {
    return Object.freeze({
      cursor: this.cursor,
      line: this.line,
      column: this.column
    })
  }
  /**
   * Return the current character with an optional offset
   *
   * @public
   * @param {number} offset
   * @returns {string}
   */
  peek (offset) {
    let cursor = _.isInteger(offset)
      ? this.cursor + offset : this.cursor
    return this.input.charAt(cursor)
  }
  /**
   * Return the current character and advance the cursor
   *
   * @public
   * @returns {string}
   */
  next () {
    let c = this.input.charAt(this.cursor++)
    if (c === '\n') {
      this.line++
      this.column = 0
    } else {
      this.column++
    }
    return c
  }
  /**
   * Return true if the stream has reached the end
   *
   * @public
   * @returns {boolean}
   */
  eof () {
    return this.peek() === ''
  }
  /**
   * Throw an error at the current line/column
   *
   * @public
   * @param {string} message
   * @throws Error
   */
  err (msg) {
    throw new Error(`${msg} (${this.line}:${this.column})`)
  }
}

/**
 * @function createInputStreamP
 * @private
 * @param {string} input
 * @returns {InputStreamProxy}
 */
module.exports = (input) => {
  let i = new InputStream(input)
  /**
   * @namespace
   * @borrows InputStream#position as #position
   * @borrows InputStream#peek as #peek
   * @borrows InputStream#next as #next
   * @borrows InputStream#eof as #eof
   * @borrows InputStream#err as #err
   */
  let InputStreamProxy = {
    position () {
      return i.position()
    },
    peek () {
      return i.peek(...arguments)
    },
    next () {
      return i.next()
    },
    eof () {
      return i.eof()
    },
    err () {
      return i.err(...arguments)
    }
  }
  return InputStreamProxy
}
