'use strict'

const packFlat = require('browser-pack-flat/plugin')
const collapser = require('bundle-collapser/plugin')
const packFlatStream = require('browser-pack-flat')
const commonShake = require('common-shakeify')
const unassertify = require('unassertify')
const minifyStream = require('minify-stream')
const envify = require('@browserify/envify/custom')
const uglifyify = require('@browserify/uglifyify')

function getUglify () {
  // For older Node.js versions, fall back to an earlier `terser` version.
  let uglify = null
  try {
    Function('var a = async () => {}') // eslint-disable-line no-new-func
  } catch (_err) {
    uglify = require('terser')
  }

  return uglify
}

function makeUglifyOptions (debug) {
  const uglifyOpts = {
    uglify: getUglify(),
    output: {
      ascii_only: true
    },
    mangle: {
      safari10: true
    }
  }
  if (!debug) {
    uglifyOpts.sourceMap = false
  }
  return uglifyOpts
}

module.exports = function (b, opts) {
  if (typeof b !== 'object') {
    throw new Error('tinyify: must be used as a plugin, not a transform')
  }

  opts = Object.assign({
    flat: true,
    env: {}
  }, opts)

  const env = Object.assign({
    NODE_ENV: 'production'
  }, process.env, opts.env)

  // Remove `assert()` calls.
  b.transform(unassertify, { global: true })
  // Replace `process.env.NODE_ENV` with "production".
  b.transform(envify(env), { global: true })
  // Remove dead code.
  b.transform(uglifyify, {
    uglify: getUglify(),
    global: true,
    toplevel: true,
    // No need to mangle here, will do that at the end.
    mangle: false,
    output: {
      ascii_only: true
    }
  })

  if (!b._options.fullPaths) {
    if (opts.flat) {
      // Output a flat bundle, without function wrappers for each module.
      b.plugin(packFlat)
    } else {
      // Replace file paths in require() calls with module IDs.
      b.plugin(collapser)
    }
  }

  // Remove unused exports from modules.
  b.plugin(commonShake)

  // Minify the final output.
  const uglifyOpts = makeUglifyOptions(b._options.debug)
  b.pipeline.get('pack').push(minifyStream(uglifyOpts))
}

module.exports.applyToPipeline = function applyToPipeline (pipeline, opts) {
  opts = Object.assign({
    flat: true,
    debug: false,
    basedir: process.cwd()
  }, opts)

  if (opts.flat) {
    pipeline.get('pack').splice(0, 1, packFlatStream({
      raw: true,
      debug: opts.debug,
      basedir: opts.basedir
    }))
  }

  // Minify the final output.
  const uglifyOpts = makeUglifyOptions(opts.debug)
  pipeline.get('pack').push(minifyStream(uglifyOpts))
}
