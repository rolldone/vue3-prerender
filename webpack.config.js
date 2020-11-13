const autoprefixer = require("autoprefixer");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require("webpack");
// const PrerenderSPAPlugin = require('prerender-spa-plugin')

var pkg = {
  version: new Date().getTime()
};
module.exports = {
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "async",
      cacheGroups: {
        heavy: {
          chunks: "initial",
          filename: `[name].bundle.js`,
          minChunks: 2,
          name: "heavy",
          reuseExistingChunk: true,
          test: (module, chunks) => chunks.length === 2 && /^(editor|player)$/.test(chunks[0].name) && /^(editor|player)$/.test(chunks[1].name)
        },
        
        common : {
          chunks: "initial",
          name: "common",
          minChunks: 1,
          filename: `[name].js`,
          reuseExistingChunk: true,
          test: /[\/[\\/]node_modules[\\/]((?!moment|jquery).*)[\\/]/
        },
        common2 : {
          chunks: "initial",
          name: "common2",
          minChunks: 1,
          filename: `[name].js`,
          reuseExistingChunk: true,
          test: /[\\/]node_modules[\\/]((moment|jquery).*)[\\/]/
        },
        common3 : {
          chunks: "initial",
          name: "common3",
          minChunks: 1,
          filename: `[name].js`,
          reuseExistingChunk: true,
          test: /[\\/]assets[\\/]((?!semantic).*)[\\/]/
        },
        common4 : {
          chunks: "initial",
          name: "common4",
          minChunks: 1,
          filename: `[name].js`,
          reuseExistingChunk: true,
          test: /[\\/]assets[\\/]((semantic).*)[\\/]/
        },
        
        /* Old Version
        common: {
          chunks: "initial",
          filename: `[name].bundle.js?v=${pkg.version}`,
          minChunks: 2,
          name: "common",
          reuseExistingChunk: true,
          test: (module, chunks) => {
            return !(chunks.length === 2 && /^(editor|player)$/.test(chunks[0].name) && /^(editor|player)$/.test(chunks[1].name));
          }
        } 
        */
      }
    }
  },
  entry: {
    // auth: [path.resolve(__dirname, "./src/v1/partner/auth/index")],
    main: [path.resolve(__dirname, "./src/v1/index")],
    vendor: ["babel-polyfill"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    /* 
        Kalo pengen express jadi pondasi
    */
    publicPath : '/',
    /* 
        Kalo pengen mandiri
    */
    // publicPath: "/dist",
    filename: "[name].js",
    chunkFilename : '[id].[hash].js',
    // chunkFilename : '[name].[hash].js'
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(ico|jpg|png|gif|eot|otf|webp|ttf|woff|woff2|svg)(\?.*)?$/,
        loader: "file-loader",
        query: {
          name: "[path][name].[ext]"
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/,/assets/],
        loaders: ["babel-loader",'eslint-loader']
      },
      // {
      //   test: /\.tsx?$/,
      //   use: 'ts-loader',
      //   exclude: /node_modules/,
      // },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: ["babel-loader",'eslint-loader']
      },
      
      /* If you need create single component vue and watch it */
      {
        test: /\.(vue)$/,
        use: {
            loader: 'vue-loader',
            options: {},
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader"
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "file-loader"
          },
          {
            loader: "svgo-loader",
            options: {
              plugins: [
                {
                  removeTitle: true
                },
                {
                  removeDoctype: true
                },
                {
                  convertColors: {
                    shorthex: false
                  }
                },
                {
                  convertPathData: false
                }
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    /* Load Html-webpack-plugin */
    /* If use NOdejs as rendering you dont need it */
    new HtmlWebpackPlugin({
        title: 'My App',
        chunks: [],
        date : new Date().getTime(),
        template : path.join(__dirname, "views", "v1/prod/index.html"),
        filename: path.join(__dirname, "dist", "main.html")
    }),
    // new PrerenderSPAPlugin({
    //   // Required - The path to the webpack-outputted app to prerender.
    //   staticDir: path.join(__dirname, 'dist'),
    //   indexPath: path.resolve('dist/index.html'),
    //   // Required - Routes to render.
    //   routes: [ '/', '/about' ],
    // }),
    /* Ini artinya membuatkan folder tujuan pada saat di compile */
    new CopyPlugin([
      { from: 'assets/v1/img', to: 'public/img' },
      { from: 'assets/v1/css', to: 'public/css' },
      { from: 'assets/ionicons', to: 'public/ionicons' },
      { from: 'assets/semantic', to: 'public/semantic' },
      { from: 'node_modules/summernote/dist', to: 'public/summernote/dist' },
      { from: 'node_modules/leaflet/dist/images', to: 'public/leaflet/images'},
      { from: '_redirects', to : '' }
    ]),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      moment: "moment",
      Swal: path.resolve(path.join(__dirname, "assets", "sweetalert2/dist/sweetalert2.js")),
      // jQuery: path.resolve(path.join(__dirname, 'lib', 'own_jquery.js')),
      // 'window.jQuery': path.resolve(path.join(__dirname, 'lib', 'own_jquery.js')),
      gettext: path.join(__dirname, "src/base", "Ttag.js"),
      Arg: path.join(__dirname, "assets", "arg/dist/arg.min.js"),
      asyncjs: "async",
      NProgress: "nprogress",
      Pusher: path.join(__dirname, "assets", "pusher-js-master/dist/web/pusher.min.js"),
      _: path.join(__dirname, "assets", "lodash/dist/lodash.min.js"),
      Validator: path.join(__dirname, "assets", "validatorjs/validator.js")
    }),
    //new BundleAnalyzerPlugin()
  ],
  resolve: {
    alias: {
      "BaseVue": path.resolve(path.join(__dirname, "src", "base/BaseVue.jsx")),
      "BaseComposition": path.resolve(path.join(__dirname, "src", "base/BaseComposition.jsx")),
      "@base": path.resolve(__dirname, "src", "base"),
      "@app": path.resolve(__dirname, "src"),
      "@v1": path.resolve(__dirname, "src/v1"),
      "@asset": path.resolve(__dirname, "assets"),
      "@config": path.resolve(
        __dirname + "/config/client",
        (function() {
          switch (process.env.NODE_ENV) {
            case "production":
              return "production.js";
            case "devserver":
              return "devserver.js";
            default:
              return "coding.js";
          }
        })()
      )
    },
    extensions: ['.js', '.jsx', '.vue'],
  }
};
