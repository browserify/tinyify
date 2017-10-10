# tinyify

a browserify plugin that runs various optimizations, so you don't have to install them all manually.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/browserify-tiny.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/browserify-tiny
[travis-image]: https://img.shields.io/travis/goto-bus-stop/browserify-tiny.svg?style=flat-square
[travis-url]: https://travis-ci.org/goto-bus-stop/browserify-tiny
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

```bash
npm install --saved-dev tinyify

browserify -p tinyify app.js
```

## Included

 - [unassertify][] - Remove `assert()` calls
 - [envify][] - Replace environment variables—by default, replaces `NODE_ENV` with `"production"`
 - [uglifyify][] - Remove dead code from modules
 - [common-shakeify][] - Remove unused exports from modules
 - [browser-pack-flat][] - Output a "flat" bundle, with all modules in a single scope
 - [minify-stream][] - Uglify the final bundle

## License

[Apache-2.0](./LICENSE.md)

[unassertify]: https://github.com/unassert-js/unassertify
[envify]: https://github.com/hughsk/envify
[uglifyify]: https://github.com/hughsk/uglifyify
[common-shakeify]: https://github.com/goto-bus-stop/common-shakeify
[browser-pack-flat]: https://github.com/goto-bus-stop/browser-pack-flat
[minify-stream]: https://github.com/goto-bus-stop/minify-stream
