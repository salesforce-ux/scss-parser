/*
Copyright (c) 2016, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* global describe, it */

const { expect } = require('chai')
const { createAST } = require('./helpers')
const stringify = require('../lib/stringify')

describe('stringify', () => {
  it('class', () => {
    let css = '.a {}'
    let ast = createAST(css)
    expect(stringify(ast)).to.equal(css)
  })
  it('atkeyword', () => {
    let css = '@mixin myMixin {}'
    let ast = createAST(css)
    expect(stringify(ast)).to.equal(css)
  })
  it('pseudo_class', () => {
    let css = '.a:hover:active:#{focus} {}'
    let ast = createAST(css)
    expect(stringify(ast)).to.equal(css)
  })
  it('sink 1', () => {
    let css = `
      .a {
        .b {
          color: red;
        }
      }
    `
    let ast = createAST(css)
    expect(stringify(ast)).to.equal(css)
  })
  it('sink 2', () => {
    let css = `
      /// Casts a string into a number (integer only)
      ///
      /// @param {String} $value - Value to be parsed
      ///
      /// @return {Number}
      /// @author @HugoGiraudel - Simplified by @kaelig to only convert unsigned integers
      /// @see http://hugogiraudel.com/2014/01/15/sass-string-to-number/
      /// @access private
      @function _d-to-number($value) {
        $result: 0;
        $digits: 0;
        $numbers: ('0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9);

        @for $i from 1 through str-length($value) {
          $character: str-slice($value, $i, $i);

          @if $digits == 0 {
            $result: $result * 10 + map-get($numbers, $character);
          } @else {
            $digits: $digits * 10;
            $result: $result + map-get($numbers, $character) / $digits;
          }
        }

        @return $result;
      }
    `
    let ast = createAST(css)
    expect(stringify(ast)).to.equal(css)
  })
  it('sink 3', () => {
    let css = `
      *,
      *:before,
      *:after {
        box-sizing: border-box;
      }
    `
    let ast = createAST(css)
    expect(stringify(ast)).to.equal(css)
  })
  it('sink 4', () => {
    let css = `
      li:hover:active {
        color:red;
      }
    `
    let ast = createAST(css)
    expect(stringify(ast)).to.equal(css)
  })
})
