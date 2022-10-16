'use strict'

const tinyify = require('.')
const fromString = require('from2-string')
const browserify = require('browserify')
const test = require('tape')

test('modern syntax with envify', function (t) {
  t.plan(3)
  const source = 'const env = process.env.NODE_ENV\nvar a = {...b}\nconsole.log(env, a)'
  browserify(fromString(source))
    .plugin(tinyify)
    .bundle(function (err, result) {
      t.ifError(err)
      t.ok(result.indexOf('console.log("production"') !== -1)
      t.ok(result.indexOf('{...b}') !== -1)
    })
})
