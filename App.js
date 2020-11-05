"use strict";

var config = require("./config/server/main.js");
config = config.create();
const express = require("express");
const logger = require("morgan");

const app = new express();
app.set("view engine", "ejs");
var versionCompile = new Date().getTime();
var viewModeFolder = (function(config){
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
      publicPath: webpackConfig.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler));
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
    app.use(express.static(`${__dirname}/dist`));
    app.use(express.static(`${__dirname}/dist/public`));
    break;
}
/*
    Jika posisinya development
    Ini harus di bawah webpackDevMiddleware ya!!!
    - Routes
*/
// app.get("/auth/*", function (req, res) {
//   res.render(__dirname + "/views/admin/v1/"+viewModeFolder+"/auth", {title: 'Artywiz - Auth Partner', date: versionCompile});
//   /* res.sendFile(__dirname + "/views/auth.html"); */
// });

app.get("/*", function (req, res) {
  res.render(__dirname + "/views/v1/"+viewModeFolder+"/main", {title: 'Artyplanet', date: versionCompile});
  /* res.sendFile(__dirname + "/views/index.html"); */
});

app.listen(config.port, () => console.log(`Server running on port ${config.port}...`));
