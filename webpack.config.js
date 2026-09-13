import path from 'path';
import { fileURLToPath } from 'url';
import GopeedPolyfillPlugin from 'gopeed-polyfill-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (_, argv) => [
  {
    name: 'webview',
    context: __dirname,
    target: 'web',
    entry: './src/lib/sabr/webview.js',
    devtool: false,
    output: {
      filename: 'bgutils.js',
      path: path.resolve(__dirname, '.generated'),
      library: { name: 'GopeedBgutils', type: 'var' },
    },
  },
  {
    name: 'extension',
    dependencies: ['webview'],
    context: __dirname,
    entry: './src/index.js',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    devtool: argv.mode === 'production' ? undefined : false,
    plugins: [
      new GopeedPolyfillPlugin(),
      new CleanWebpackPlugin({
        protectWebpackAssets: false,
        cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
      }),
    ],
    module: {
      rules: [
        {
          resourceQuery: /raw/,
          type: 'asset/source',
        },
        {
          test: /\.m?js$/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  },
];
