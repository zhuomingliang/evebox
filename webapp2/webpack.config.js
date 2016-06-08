var webpack = require("webpack");

module.exports = {
    entry: {
        app: './src/main.ts'
    },

    resolve: {
        extensions: [
            '',
            '.js',
            '.ts'
        ]
    },

    module: {
      loaders: [
          {
              test: /\.ts$/,
              loader: 'ts'
          },
          {
              test: /\.css$/,
              loader: "style!css"
          },
          {
              test: /\.scss$/,
              loader: "style!css!sass"
          },
          {
              test: /(\.eot(\?.*)?$)|(\.woff(\?.*)?$)|(\.woff2(\?.*)?$)|(\.ttf(\?.*)?$)|(\.svg(\?.*)?$)/,
              loader: "url"
          }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
      })
    ],
    output: {
        path: "../public",
        filename: "bundle.js"
    }
};