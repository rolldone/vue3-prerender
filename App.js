"use strict";

const path = require("path");
var config = require("./config/server/main.js");
config = config.create();
const express = require("express");
const logger = require("morgan");
const robots = require('express-robots-txt');
var mime = require('mime-types')
const HomeRoute = require('./server/routes/Home');

const app = new express();
app.set("view engine", "ejs");

var versionCompile = new Date().getTime();  
var viewModeFolder = (function(config){
  console.log('config -> ',config);
  switch(config){
    case 'dev':
    case 'development':
      return 'dev';
    case 'devserver':
    case 'production':
      return 'prod';
  }
})(config.env);

// ## Middleware
switch (config.env) {
  case "development":
  case "dev":
    app.use(logger("dev"));
    var webpack = require("webpack");
    var webpackConfig = require("./webpack.dev.config.js");
    // const DashboardPlugin = require('webpack-dashboard/plugin');
    var webpackDevMiddleware = require("webpack-dev-middleware");
    var webpackHotMiddleware = require("webpack-hot-middleware");
    var compiler = webpack(webpackConfig);
    // compiler.apply(new DashboardPlugin());
    app.use(webpackDevMiddleware(compiler, {
      logLevel: "warn",
      publicPath: webpackConfig.output.publicPath,
      stats: { colors: true },
      writeToDisk: true,
      logTime: true,
      logLevel: 'debug'
    }));  
    app.use(webpackHotMiddleware(compiler));
    /* Because the data in memory is little different to get the data assets */
    app.use('/public/*', function (req, res, next) {
      var filename = path.join(compiler.outputPath,req.originalUrl);
      compiler.outputFileSystem.readFile(filename, function(err, result){
        if (err) {
          return res.status(400).send(err.message);
        }
        res.set('content-type',mime.lookup(filename));
        res.send(result);
        res.end();
      });
    });
    break;
  case "production":
  case "devserver":
    var webpack = require("webpack");
    var webpackConfig = require("./webpack.config.js");
    // const DashboardPlugin = require('webpack-dashboard/plugin');
    var webpackDevMiddleware = require("webpack-dev-middleware");
    var webpackHotMiddleware = require("webpack-hot-middleware");
    // var compiler = webpack(webpackConfig);
    //  compiler.apply(new DashboardPlugin());
    // app.use(
    //   webpackDevMiddleware(compiler, {
    //     logLevel: "warn",
    //     publicPath: webpackConfig.output.publicPath
    //   })
    // );
    // app.use(webpackHotMiddleware(compiler));
    app.use('/dist',express.static(`${__dirname}/dist`));
    app.use('/public',express.static(`${__dirname}/dist/public`));
    break;
}

/*
    Jika posisinya development
    Ini harus di bawah webpackDevMiddleware ya!!!
    - Routes
*/
app.use(robots({ UserAgent: '*', Disallow: '/member' }));

app.use('/',HomeRoute({
  versionCompile,
  viewModeFolder,
  basePath : __dirname
}));

app.listen(config.port, () => console.log(`Server running on port ${config.port}...`));

