const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = function override(config, env) {
  if (env === 'production') {
    config.plugins.push(
      new InjectManifest({
        swSrc: './public/service-worker.js', // Path to your custom service worker
        swDest: 'service-worker.js',
      })
    );
  }
  return config;
};
