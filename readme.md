# tinyify

a browserify plugin that runs various optimizations, so you don't have to install them all manually.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/tinyify.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/tinyify
[travis-image]: https://img.shields.io/travis/browserify/tinyify.svg?style=flat-square
[travis-url]: https://travis-ci.org/browserify/tinyify
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

```bash
npm install --save-dev tinyify

browserify -p tinyify app.js
```

## Included

 - [unassertify][] - Remove `assert()` calls
 - [envify][] - Replace environment variables—by default, replaces `NODE_ENV` with `"production"`
 - [uglifyify][] - Remove dead code from modules
 - [common-shakeify][] - Remove unused exports from modules
 - [browser-pack-flat][] - Output a "flat" bundle, with all modules in a single scope
 - [minify-stream][] - Uglify the final bundle

## Options

Options can be provided on the command line using subarg syntax, or in a separate options object using the browserify API.

### `env: {}`

Supply custom environment variables for [envify][].

```js
b.plugin('tinyify', {
  env: {
    PUBLIC_PATH: 'https://mywebsite.surge.sh/'
  }
})
```

This option is only available in the API.
On the CLI, you can define environment variables beforehand instead:

```bash
PUBLIC_PATH=https://mywebsite.surge.sh browserify app.js -p tinyify
```

### `--no-flat`, `flat: false`

Disable [browser-pack-flat][].
This is useful if you want to generate a [browser-pack][] style bundle, like required by [disc][] for example.

```bash
browserify app.js -p [ tinyify --no-flat ]
```

```js
b.plugin('tinyify', { flat: false })
```

## License

[Apache-2.0](./LICENSE.md)

[unassertify]: https://github.com/unassert-js/unassertify
[envify]: https://github.com/hughsk/envify
[uglifyify]: https://github.com/hughsk/uglifyify
[common-shakeify]: https://github.com/browserify/common-shakeify
[browser-pack-flat]: https://github.com/goto-bus-stop/browser-pack-flat
[minify-stream]: https://github.com/goto-bus-stop/minify-stream
[browser-pack]: https://github.com/browserify/browser-pack
[disc]: https://github.com/hughsk/disc
