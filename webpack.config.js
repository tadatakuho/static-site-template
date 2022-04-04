const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackWatchedGlobEntries = require("webpack-watched-glob-entries-plugin");

// エントリーポイントとして、tsファイルを設定
const entries = WebpackWatchedGlobEntries.getEntries(
  [path.resolve(__dirname, "./src/ts/**/*.ts")],
  {}
)();

const webpackConfig = {
  entry: entries,
  // 出力設定
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "images/[hash][ext][query]",
  },
  // 開発環境設定
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    compress: true,
    port: 3000,
    open: true,
  },
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      // SCSSを使うための設定
      {
        test: /(\.s[ac]ss)$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      // TypeScriptを使うための設定
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};

// 複数ページを書き出すための設定
Object.keys(webpackConfig.entry).forEach((key) => {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: `./src/${key}.html`, // 読み込み元のhtmlパス
      filename: `./${key}.html`, // 出力するhtmlパス
      inject: true,
      chunks: [key],
    })
  );
});

module.exports = webpackConfig;
