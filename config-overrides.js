// config-overrides.js
const { override, addWebpackPlugin } = require('customize-cra');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = override(
  addWebpackPlugin(
    new InjectManifest({
      swSrc: './src/service-worker.js', // Your custom service worker
      swDest: 'service-worker.js',
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Adjust as needed
    })
  )
);
