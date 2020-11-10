'use strict';

/**
 * Development-only webpack settings.
 */
const webpack = require('webpack');
const config = require('./webpack.config');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
config.mode = "development";
config.devtool = 'cheap-module-eval-source-map';
/* Biar mau refresh pada saat compile otomatis */
const entryName = ['main','auth'];

for(var a=0;a<entryName.length;a++){
  if (typeof config.entry[entryName[a]] == 'string') {
    config.entry[entryName[a]] = ['webpack-hot-middleware/client', config.entry[entryName[a]]];
  } else {
    if(config.entry[entryName[a]] != null){
      config.entry[entryName[a]].unshift('webpack-hot-middleware/client');
    }else{
      console.log('WARNING DONNY!!! - this module to watch "'+entryName[a]+'" is not found, CHECK your webpack');
    }
  }
}
config.output = {
  // path: path.resolve(__dirname, 'dist'),
  publicPath: '/',
  filename: '[name].js',
}

// config.entry.unshift('webpack-hot-middleware/client');
/* Kalo jalankan aplikasi lebih dari satu sebaiknya matikan  */
// config.plugins.push(new BundleAnalyzerPlugin())

/* Delete plugin HtmlWebpackPlugin */

config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
config.plugins.push(new webpack.HotModuleReplacementPlugin())
config.plugins.push(new webpack.NoEmitOnErrorsPlugin())
config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('development')
  }
}))
config.plugins.push(new webpack.LoaderOptionsPlugin({
  minimize: false,
  debug: true
}))
module.exports = config;
