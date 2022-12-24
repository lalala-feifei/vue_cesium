module.exports = {  
    // 入口文件
    entry:"./src/main.js",
    output: { 
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          {
            test: /\.css$/,
            use: ['style-loader','css-loader']
          },
          {
          	  //主要是这一段
              test: /\.(jpg|png|svg|ttf|bmp)$/,
              use: 'url-loader'
          }
        ]
      }
}
