const path = require(`path`);

module.exports = {
  entry: `./src/index.tsx`,
  mode: 'development',
  output: {
    filename: `bundle.js`,
  },
  devServer: {
    contentBase: path.resolve(__dirname, `build`),
    open: false,
    port: 1337,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: `ts-loader`,
        },
      }
    ],
  },
  resolve: {
    extensions: [`.ts`, `.tsx`, `.js`, `.jsx`]
  },
  devtool: `source-map`,
};
