const fs = require('fs');
const webpack = require('webpack');
const url = require('url');
const paths = require('./paths');
const clientProdConfig = require('./webpack.config.prod.js');
const getClientEnvironment = require('./env');

// TODO: copied from webpack-config.prod.js, move to an import
function ensureSlash(path, needsSlash) {
  var hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return path + '/';
  } else {
    return path;
  }
}

// TODO: copied from webpack-config.prod.js, move to an import
const homepagePath = require(paths.appPackageJson).homepage;
const homepagePathname = homepagePath ? url.parse(homepagePath).pathname : '/';
const publicPath = ensureSlash(homepagePathname, true);
const publicUrl = ensureSlash(homepagePathname, false);
const env = getClientEnvironment(publicUrl);

if (env['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

// Leave imports from node_modules as commonjs import for Node.js to
// process: http://jlongster.com/Backend-Apps-with-Webpack--Part-I
let nodeModules = {};
fs.readdirSync(paths.appNodeModules)
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

// Extend the client production config
module.exports = Object.assign({}, clientProdConfig, {
  target: 'node',
  entry: [
    require.resolve('./polyfills'),
    paths.appJs
  ],
  output: {
    path: paths.appBuild,
    filename: 'server-bundle.js',
    publicPath,
    library: 'App',
    libraryTarget: 'commonjs'
  },
  module: {
    preLoaders: clientProdConfig.module.preLoaders,
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel',
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin(env),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
  ],
  externals: nodeModules
});
