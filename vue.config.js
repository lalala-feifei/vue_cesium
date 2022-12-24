const path = require('path');
module.exports = {
  lintOnSave: false,
  devServer: {
    port: 8080, // 设置端口号
    host: '127.0.0.1', // ip 本地
    disableHostCheck: true, //是否关闭用于 DNS 重绑定的 HTTP 请求的 HOST 检查
    hotOnly: true, // 热更新
    https: false, // https:{type:Boolean}配置前缀
    open: false, //配置自动启动浏览器
    proxy: null,  //设置代理
    // proxy: { //目的是解决跨域，若测试环境不需要跨域，则不需要进行该配置
    //   '/t0': { // 拦截以 /api 开头的url接口
    //     target: 'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix=11&TileRow=441&TileCol=620&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb', //目标接口域名
    //     changeOrigin: true, //是否跨域
    //     ws: true, //如果要代理 websockets，配置这个参数
    //     secure: false, // 如果是https接口，需要配置这个参数
    //     // 标识替换
    //     // 原请求地址为 /api/getData 将'/api'替换''时，
    //     // 代理后的请求地址为： http://xxx.xxx.xxx/getData
    //     // 若替换为'/other',则代理后的请求地址为 http://xxx.xxx.xxx/other/getData 
    //     // pathRewrite: { // 标识替换
    //     //   '^/api': '/'   //重写接口 后台接口指向不统一  所以指向所有/
    //     //   '^/api': '/api/mock'
    //     // }
    //   }
    // }
  },
}