var packFlat = require('browser-pack-flat/plugin')
var commonShake = require('common-shakeify')
var unassertify = require('unassertify')
var uglify = require('minify-stream')
var envify = require('envify/custom')
var uglifyify = require('uglifyify')

module.exports = function (b, opts) {
  if (typeof b !== 'object') {
    throw new Error('tinyify: must be used as a plugin, not a transform')
  }

  var env = Object.assign({
    NODE_ENV: 'production'
  }, process.env)

  // Remove `assert()` calls.
  b.transform(unassertify, { global: true })
  // Replace `process.env.NODE_ENV` with "production".
  b.transform(envify(env), { global: true })
  // Remove dead code.
  b.transform(uglifyify, {
    global: true,
    toplevel: true,
    // No need to mangle here, will do that at the end.
    mangle: false
  })

  // Output a flat bundle, without function wrappers for each module.
  b.plugin(packFlat)
  // Remove unused exports from modules.
  b.plugin(commonShake)

  // Minify the final output.
  var uglifyOpts = {}
  if (!b._options.debug) {
    uglifyOpts.sourceMap = false
  }
  b.pipeline.get('pack').push(uglify(uglifyOpts))
}
