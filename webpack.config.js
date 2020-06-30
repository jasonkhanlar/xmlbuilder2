const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  mode: 'production', // production | development
  node: {
    global: true,
    __filename: false,
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              sourceType: "unambiguous",
              presets: [
                [
                  '@babel/preset-env',
                  { 
                    useBuiltIns: "usage",
                    modules: false,
                    corejs: 3,
                    //debug: true,
                    targets: {
                      browsers: [
                        "defaults",
                        "ie >= 11"
                      ]
                    }
                  }
                ]
              ]
            },
          },
          { loader: 'ts-loader' }
        ],
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'xmlbuilder2',
    libraryTarget: 'umd' 
  }
};