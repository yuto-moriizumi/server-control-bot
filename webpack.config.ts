import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import Dotenv from "dotenv-webpack";

const config: import("webpack").Configuration = {
  target: "node",
  entry: "./index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
    sourceMapFilename: "[file].map",
  },
  plugins: [new Dotenv()],
  externals: ["discord.js"],
};

module.exports = config;
