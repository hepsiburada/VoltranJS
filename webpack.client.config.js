const path = require("path");
const fs = require("fs");

const webpack = require("webpack");
const { merge } = require("webpack-merge");
const AssetsPlugin = require("assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

require("intersection-observer");

const { createComponentName } = require("./src/universal/utils/helper.js");
const packageJson = require(path.resolve(process.cwd(), "package.json"));

const isBuildingForCDN = process.argv.includes("--for-cdn");
const env = process.env.VOLTRAN_ENV || "local";

const voltranConfig = require("./voltran.config");
const appConfigFilePath = `${voltranConfig.appConfigFile.entry}/${env}.conf.js`;
const appConfig = require(appConfigFilePath);
const commonConfig = require("./webpack.common.config");
const postCssConfig = require("./postcss.config");
const babelConfig = require("./babel.server.config");

const voltranClientConfigPath = voltranConfig.webpackConfiguration.client;
const voltranClientConfig = voltranClientConfigPath
  ? require(voltranConfig.webpackConfiguration.client)
  : "";

const normalizeUrl = require("./lib/os.js");
const replaceString = require("./config/string.js");

const fragmentManifest = require(voltranConfig.routing.dictionary);

const isDebug = voltranConfig.dev;
const reScript = /\.(js|jsx|mjs)$/;
const distFolderPath = voltranConfig.distFolder;
const prometheusFile = voltranConfig.monitoring.prometheus;

const chunks = {};

chunks.client = [
  path.resolve(__dirname, "src/client/client.js")
];

for (const index in fragmentManifest) {
  if (!fragmentManifest[index]) {
    continue;
  }

  const fragment = fragmentManifest[index];
  const fragmentUrl = fragment.path;
  const name = createComponentName(fragment.routePath);

  chunks[name] = [fragmentUrl];
}

const GO_PIPELINE_LABEL = process.env.GO_PIPELINE_LABEL || packageJson.version;
const appConfigFileTarget = `${voltranConfig.appConfigFile.output.path}/${voltranConfig.appConfigFile.output.name}.js`;

fs.copyFileSync(appConfigFilePath, appConfigFileTarget);

if (isDebug) {
  const appConfigJSONContent = require(appConfigFileTarget);

  for (const service in appConfigJSONContent.services) {
    appConfigJSONContent.services[service].clientUrl =
      appConfigJSONContent.services[service].serverUrl;
  }

  const moduleExportsText = "module.exports";
  const appConfigFileContent = fs.readFileSync(appConfigFileTarget).toString();
  const moduleExportsIndex = appConfigFileContent.indexOf(moduleExportsText);

  let context = appConfigFileContent.substr(0, moduleExportsIndex + moduleExportsText.length);
  context += "=";
  context += JSON.stringify(appConfigJSONContent);
  context += ";";

  fs.writeFileSync(appConfigFileTarget, context);

  chunks.client.unshift(
    "regenerator-runtime/runtime.js",
    "core-js/stable",
    "intersection-observer"
  );
  chunks.client.push("webpack-hot-middleware/client");
}

const outputPath = voltranConfig.output.client.path;

const clientConfig = merge(commonConfig, voltranClientConfig, {
  name: "client",

  target: "web",

  mode: isDebug ? "development" : "production",

  entry: chunks,

  output: {
    path: outputPath,
    publicPath: `${appConfig.mediaUrl}/project/assets/`,
    filename: voltranConfig.output.client.filename,
    chunkFilename: voltranConfig.output.client.chunkFilename,
    chunkLoadingGlobal: `WP_${voltranConfig.prefix.toUpperCase()}_VLTRN`
  },

  module: {
    rules: [
      {
        test: reScript,
        loader: "esbuild-loader",
        include: [path.resolve(__dirname, "src"), voltranConfig.inputFolder],
        options: {
          loader: "jsx",
          target: "es2015"
        }
      },
      {
        test: /\.js$/,
        loader: "string-replace-loader",
        options: {
          multiple: [...replaceString()]
        }
      },
      {
        test: /\.css$/,
        use: [
          isDebug
            ? {
              loader: "style-loader",
              options: {
                injectType: "singletonStyleTag"
              }
            }
            : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: false,
              importLoaders: 1,
              sourceMap: isDebug
            }
          },
          {
            loader: "postcss-loader",
            options: postCssConfig
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          isDebug
            ? {
              loader: "style-loader",
              options: {
                injectType: "singletonStyleTag"
              }
            }
            : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: appConfig.isCssClassNameObfuscationEnabled
                  ? `${voltranConfig.prefix}-[name]-[hash:base64]`
                  : `${voltranConfig.prefix}-[path][name]__[local]`,
                localIdentHashSalt: packageJson.name
              },
              importLoaders: 1,
              sourceMap: isDebug
            }
          },
          {
            loader: "postcss-loader",
            options: postCssConfig
          },
          {
            loader: "sass-loader"
          },
          ...(voltranConfig.sassResources
            ? [
              {
                loader: "sass-resources-loader",
                options: {
                  sourceMap: false,
                  resources: voltranConfig.sassResources
                }
              }
            ]
            : [])
        ]
      }
    ]
  },

  optimization: {
    // emitOnErrors: false,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: "es2015",
        css: true
      }),
      new TerserWebpackPlugin({
        terserOptions: {
          mangle: {
            safari10: true
          }
        }
      }),
      new CssMinimizerPlugin({})
    ]
  },

  resolve: {
    alias: {
      "react": path.resolve(process.cwd(), "node_modules/react"),
      "react-dom": path.resolve(process.cwd(), "node_modules/react-dom")
    }
  },

  plugins: [
    ...(isBuildingForCDN
      ? []
      : [
        new CleanWebpackPlugin({
          verbose: false,
          dangerouslyAllowCleanPatternsOutsideProject: true
        })
      ]),

    new webpack.DefinePlugin({
      "process.env": {},
      "process.env.BROWSER": true,
      __DEV__: isDebug,
      GO_PIPELINE_LABEL: JSON.stringify(GO_PIPELINE_LABEL)
    }),

    new CopyWebpackPlugin([
      {
        from: voltranConfig.output.client.publicPath,
        to: voltranConfig.publicDistFolder
      }
    ]),

    ...(isDebug
      ? [new webpack.HotModuleReplacementPlugin()]
      : [
        new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[id]-[contenthash].css"
        })
      ]),

    new AssetsPlugin({
      path: voltranConfig.inputFolder,
      filename: "assets.json",
      prettyPrint: true
    }),

    ...(appConfig?.bundleAnalyzerStaticEnabled ? [new BundleAnalyzerPlugin({analyzerMode: 'static', openAnalyzer: false})] : [])
  ]
});

module.exports = clientConfig;
