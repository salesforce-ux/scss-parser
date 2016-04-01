# SCSS Parser

[![Build Status](https://travis-ci.org/salesforce-ux/scss-parser.svg?branch=master)](https://travis-ci.org/salesforce-ux/scss-parser)

## Getting Started

```javascript
let { parse, stringify } = require('scss-parser')

let ast = parse('.hello { color: red; }')
let scss = stringify(ast)
```

## Traversal

For an easy way to traverse/modify the generated AST, check out [QueryAST](https://github.com/salesforce-ux/query-ast)

```javascript
let { parse, stringify } = require('scss-parser')
let createQueryWrapper = require('query-ast')

// Create an AST
let ast = parse('.hello { color: red; } .world { color: blue; }')
// Create a function to traverse/modify the AST
let $ = createQueryWrapper(ast)
// Make some modifications
$().find('rule').eq(1).remove()
// Convert the modified AST back to a string
let scss = stringify($().get(0))
```

## Running tests

Clone the repository, then:

```bash
npm install
# requires node >= 5.0.0
npm test
```
