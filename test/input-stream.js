/*
Copyright (c) 2015, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* global describe, it */

'use strict'

const { expect } = require('chai')
const { createInputStream } = require('./helpers')

describe('InputStream', () => {
  it('returns an new InputStream', () => {
    let i = createInputStream()
    expect(i).to.be.an('object')
    expect(i).to.respondTo('position')
    expect(i).to.respondTo('peek')
    expect(i).to.respondTo('next')
    expect(i).to.respondTo('eof')
    expect(i).to.respondTo('err')
  })
  describe('#position', () => {
    it('defaults the position to 0', () => {
      let p = createInputStream().position()
      expect(p).to.be.frozen
      expect(p).to.have.property('cursor').and.to.equal(0)
      expect(p).to.have.property('line').and.to.equal(1)
      expect(p).to.have.property('column').and.to.equal(0)
    })
  })
  describe('#peek', () => {
    it('returns the current character', () => {
      let i = createInputStream('hello')
      expect(i.peek()).to.equal('h')
    })
    it('returns the current character with an offset', () => {
      let i = createInputStream('hello')
      expect(i.peek(1)).to.equal('e')
    })
  })
  describe('#next', () => {
    it('consumes and returns the next character', () => {
      let i = createInputStream('hello')
      expect(i.next()).to.equal('h')
    })
    it('advances the cursor', () => {
      let i = createInputStream('hello')
      expect(i.next()).to.equal('h')
      expect(i.position().cursor).to.equal(1)
      expect(i.position().line).to.equal(1)
      expect(i.position().column).to.equal(1)
    })
    it('advances the line', () => {
      let i = createInputStream('h\ni')
      expect(i.next()).to.equal('h')
      expect(i.next()).to.equal('\n')
      expect(i.next()).to.equal('i')
      expect(i.position().cursor).to.equal(3)
      expect(i.position().line).to.equal(2)
      expect(i.position().column).to.equal(1)
    })
  })
  describe('#eof', () => {
    it('returns false if there are more characters', () => {
      let i = createInputStream('hello')
      expect(i.eof()).to.be.false
    })
    it('returns true if there are no more characters', () => {
      let i = createInputStream('hi')
      expect(i.eof()).to.be.false
      i.next()
      i.next()
      expect(i.eof()).to.be.true
    })
  })
  describe('#err', () => {
    it('throws an error', () => {
      let i = createInputStream('hello')
      i.next()
      i.next()
      expect(() => {
        i.err('Whoops')
      }).to.throw(/Whoops \(1:2\)/)
    })
  })
})
