var path = require('path');

var BUILD_DIR = path.join(__dirname, 'dist');
var APP_DIR = path.join(__dirname, 'src');

var config = {
  mode: 'development', // development // production
  entry: {
    'app': APP_DIR + '/index.js'
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,  
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets:  [
							['@babel/preset-env',
                {
                  "corejs": { "version":3 },
                  "useBuiltIns": "usage",
                  "targets": {
                    "edge": "17",
                    "firefox": "60",
                    "chrome": "67",
                    "safari": "11.1",
                    "ie": "9"
                  }
                }
              ],
							'@babel/preset-react',
							'@babel/preset-typescript'
						]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '/img/[name].[ext]',
            },
          },
        ],
      },
    ]
  }
}

module.exports = config;
