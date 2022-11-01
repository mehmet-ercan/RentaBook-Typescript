import path from "path";

const webpackConfig = () => ({
  mode: "production",
  entry: path.resolve(__dirname, "./src/index.ts"),
  devtool:'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "script.js",
    path: path.resolve(__dirname, "public","static","bundle"),
  }
  });

export default webpackConfig;
