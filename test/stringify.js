/* global describe, it */

'use strict'

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
})
