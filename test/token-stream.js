/*
Copyright (c) 2016, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* global describe, it */
/* eslint-disable no-useless-escape */

const { expect } = require('chai')

const {
  createTokenStream,
  createInputStream,
  cleanNode
} = require('./helpers')

describe('TokenStream', () => {
  it('requires an InputStream', () => {
    expect(() => {
      createTokenStream()
    }).to.throw(/InputStream/)
  })
  it('returns an TokenStream', () => {
    let t = createTokenStream(createInputStream())
    expect(t).to.be.an('object')
    expect(t).to.respondTo('all')
    expect(t).to.respondTo('peek')
    expect(t).to.respondTo('next')
    expect(t).to.respondTo('eof')
    expect(t).to.respondTo('err')
  })
  describe('#all', () => {
    it('tokenizes all characters in the InputStream', () => {
      let t = createTokenStream(createInputStream('hello'))
      expect(t.all()).to.have.length(1)
      expect(t.eof()).to.equal(true)
    })
  })
  describe('#peek', () => {
    it('returns the current token', () => {
      let t = createTokenStream(createInputStream('hello'))
      expect(cleanNode(t.peek())).to.deep.equal({
        type: 'identifier',
        value: 'hello'
      })
    })
    it('returns the current token with an offset', () => {
      let t = createTokenStream(createInputStream('hello world'))
      expect(cleanNode(t.peek(1))).to.deep.equal({
        type: 'space',
        value: ' '
      })
    })
  })
  describe('#next', () => {
    it('consumes returns and the next token', () => {
      let t = createTokenStream(createInputStream('hello world'))
      expect(cleanNode(t.next())).to.deep.equal({
        type: 'identifier',
        value: 'hello'
      })
      expect(cleanNode(t.peek())).to.deep.equal({
        type: 'space',
        value: ' '
      })
    })
    describe('tokens', () => {
      describe('space', () => {
        it('single space', () => {
          let t = createTokenStream(createInputStream(' '))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'space',
            value: ' '
          })
        })
        it('multiple spaces', () => {
          let t = createTokenStream(createInputStream('    hello'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'space',
            value: '    '
          })
        })
        it('whitespace characters', () => {
          let t = createTokenStream(createInputStream('\n\n\t  hello'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'space',
            value: '\n\n\t  '
          })
        })
      })
      describe('comment', () => {
        it('single comment', () => {
          let t = createTokenStream(createInputStream('// Hello\nWorld'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'comment_singleline',
            value: ' Hello'
          })
        })
        it('single comment', () => {
          let t = createTokenStream(createInputStream('/** Hello World */'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'comment_multiline',
            value: '* Hello World '
          })
        })
      })
      describe('number', () => {
        it('integer', () => {
          let t = createTokenStream(createInputStream('3'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'number',
            value: '3'
          })
        })
        it('float', () => {
          let t = createTokenStream(createInputStream('3.0'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'number',
            value: '3.0'
          })
        })
        it('float (leading decimal)', () => {
          let t = createTokenStream(createInputStream('.3'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'number',
            value: '.3'
          })
        })
      })
      describe('hex', () => {
        it('6 digit lowercase', () => {
          let t = createTokenStream(createInputStream('#ff0099'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'color_hex',
            value: 'ff0099'
          })
        })
        it('6 digit uppercase', () => {
          let t = createTokenStream(createInputStream('#FF0099'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'color_hex',
            value: 'FF0099'
          })
        })
        it('3 digit lowercase', () => {
          let t = createTokenStream(createInputStream('#ff0'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'color_hex',
            value: 'ff0'
          })
        })
        it('3 digit uppercase', () => {
          let t = createTokenStream(createInputStream('#FF0'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'color_hex',
            value: 'FF0'
          })
        })
        it('3 digit (trailing invalid)', () => {
          let t = createTokenStream(createInputStream('#FF0;'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'color_hex',
            value: 'FF0'
          })
        })
        it('6 digit numbers', () => {
          let t = createTokenStream(createInputStream('#000000'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'color_hex',
            value: '000000'
          })
        })
      })
      describe('atkeyword', () => {
        it('works', () => {
          let t = createTokenStream(createInputStream('@mixin'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'atkeyword',
            value: 'mixin'
          })
        })
      })
      describe('puctuation', () => {
        it('{', () => {
          let t = createTokenStream(createInputStream('{'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'punctuation',
            value: '{'
          })
        })
      })
      describe('operator', () => {
        it('+', () => {
          let t = createTokenStream(createInputStream('+'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'operator',
            value: '+'
          })
        })
        it('repeatable', () => {
          let t = createTokenStream(createInputStream('&&'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'operator',
            value: '&&'
          })
        })
        it('non-repeatable', () => {
          let t = createTokenStream(createInputStream('++'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'operator',
            value: '+'
          })
        })
        it('repeatable followed by non-repeatable', () => {
          let t = createTokenStream(createInputStream('&++'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'operator',
            value: '&'
          })
        })
      })
      describe('identifier', () => {
        it('checks for valid starting characters', () => {
          let t = createTokenStream(createInputStream('_hello world'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'identifier',
            value: '_hello'
          })
        })
        it('ignores invalid starting characters', () => {
          let t = createTokenStream(createInputStream('0hello world'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'number',
            value: '0'
          })
        })
      })
      describe('string', () => {
        it('single quotes', () => {
          let t = createTokenStream(createInputStream('\'hello\''))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'string_single',
            value: 'hello'
          })
        })
        it('double quotes', () => {
          let t = createTokenStream(createInputStream('"hello"'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'string_double',
            value: 'hello'
          })
        })
        it('escaped characters', () => {
          let t = createTokenStream(createInputStream('"hello \\"world\\""'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'string_double',
            value: 'hello \\\"world\\\"'
          })
        })
        it('preserves escape characters', () => {
          let t = createTokenStream(createInputStream('token(\'\'+myVar+\'font(\\\'world\\\')\')'))
          let a = t.all()
          expect(cleanNode(a[6])).to.deep.equal({
            type: 'string_single',
            value: 'font(\\\'world\\\')'
          })
        })
      })
      describe('variable', () => {
        it('works', () => {
          let t = createTokenStream(createInputStream('$size'))
          expect(cleanNode(t.next())).to.deep.equal({
            type: 'variable',
            value: 'size'
          })
        })
      })
      describe('sink', () => {
        it('1', () => {
          let t = createTokenStream(createInputStream('($var)'))
          expect(t.all().map(cleanNode)).to.deep.equal([
            { type: 'punctuation', value: '(' },
            { type: 'variable', value: 'var' },
            { type: 'punctuation', value: ')' }
          ])
        })
        it('2', () => {
          let t = createTokenStream(createInputStream('// ($var)\n@mixin myMixin'))
          expect(t.all().map(cleanNode)).to.deep.equal([
            { type: 'comment_singleline', value: ' ($var)' },
            { type: 'space', value: '\n' },
            { type: 'atkeyword', value: 'mixin' },
            { type: 'space', value: ' ' },
            { type: 'identifier', value: 'myMixin' }
          ])
        })
      })
    })
  })
  describe('#eof', () => {
    it('returns false if there are more tokens', () => {
      let t = createTokenStream(createInputStream('hello'))
      expect(t.eof()).to.equal(false)
    })
    it('returns true if there are no more tokens', () => {
      let t = createTokenStream(createInputStream('hello world'))
      expect(t.eof()).to.equal(false)
      cleanNode(t.next())
      cleanNode(t.next())
      cleanNode(t.next())
      expect(t.eof()).to.equal(true)
    })
  })
  describe('#err', () => {
    it('throws an error', () => {
      let t = createTokenStream(createInputStream('hello world'))
      cleanNode(t.next())
      cleanNode(t.next())
      expect(() => {
        t.err('Whoops')
      }).to.throw(/Whoops \(1:6\)/)
    })
  })
})
