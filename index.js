var packFlat = require('browser-pack-flat/plugin')
var collapser = require('bundle-collapser/plugin')
var packFlatStream = require('browser-pack-flat')
var commonShake = require('common-shakeify')
var unassertify = require('unassertify')
var uglify = require('minify-stream')
var envify = require('envify/custom')
var uglifyify = require('uglifyify')

function makeUglifyOptions (debug) {
  var uglifyOpts = {
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

function makeModulesDefaultOpts (opts) {
  return {

    packFlat: null,

    collapser: null,

    packFlatStream: null,

    commonShake: null,

    unassertify: {global: true},

    uglify: makeUglifyOptions(opts.debug),

    envify: {global: true},

    uglifyify: {
      global: true,
      toplevel: true,
      // No need to mangle here, will do that at the end.
      mangle: false,
      output: {
        ascii_only: true
      }
    }

  }
}

function assignOptions (opts, object) {
  const debug = (object && object._options && object._options.debug)
    ? object._options.debug
    : false

  opts = Object.assign({
    basedir: process.cwd(),
    debug: debug,
    flat: true,
    env: {}
  }, opts)

  // Reassign options for modules
  // (required for using options in makeModulesDefaultOpts)
  const modulesDefaultOpts = makeModulesDefaultOpts(object, opts)
  opts.modulesOptions = Object.assign(modulesDefaultOpts, opts.modulesOptions)

  return opts
}

module.exports = function (b, opts) {
  if (typeof b !== 'object') {
    throw new Error('tinyify: must be used as a plugin, not a transform')
  }

  opts = assignOptions(opts, b)

  var env = Object.assign({
    NODE_ENV: 'production'
  }, process.env, opts.env)

  // Remove `assert()` calls.
  b.transform(unassertify, opts.modulesOptions.unassertify)
  // Replace `process.env.NODE_ENV` with "production".
  b.transform(envify(env), opts.modulesOptions.envify)
  // Remove dead code.
  b.transform(uglifyify, opts.modulesOptions.uglifyify)

  if (!b._options.fullPaths) {
    if (opts.flat) {
      // Output a flat bundle, without function wrappers for each module.
      b.plugin(packFlat, opts.modulesOptions.packFlat)
    } else {
      // Replace file paths in require() calls with module IDs.
      b.plugin(collapser, opts.modulesOptions.collapser)
    }
  }

  // Remove unused exports from modules.
  b.plugin(commonShake, opts.modulesOptions.commonShake)

  // Minify the final output.
  b.pipeline.get('pack').push(uglify(opts.modulesOptions.uglify))
}

module.exports.applyToPipeline = function applyToPipeline (pipeline, opts) {
  opts = assignOptions(opts)

  if (opts.flat) {
    pipeline.get('pack').splice(0, 1, packFlatStream({
      raw: true,
      debug: opts.debug,
      basedir: opts.basedir
    }))
  }

  // Minify the final output.
  pipeline.get('pack').push(uglify(opts.modulesOptions.uglify))
}
