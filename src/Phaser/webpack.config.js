var path = require('path');
module.exports = {
  mode: 'production',
  entry: './src/Game.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'phaser-maze-game.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/react', '@babel/env']
            }
          }
        ]
      }
    ]
  },
  externals: {
    react: 'commonjs react',
    phaser: 'phaser'
  }
};
