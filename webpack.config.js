const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const webpackConfig = {
  entry: { index: "./src/js/index.ts", index2: "./src/js/index2.ts" },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "docs"),
  },
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /(\.s[ac]ss)$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "postcss-loader",
          "sass-loader", // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

Object.keys(webpackConfig.entry).forEach((key) => {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: `./src/${key}.html`, // Source
      filename: `./${key}.html`,
      inject: true,
      chunks: [key], // insert to the root of output folder
    })
  );
});

module.exports = webpackConfig;
