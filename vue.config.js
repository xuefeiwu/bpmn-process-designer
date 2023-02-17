const { defineConfig } = require("@vue/cli-service");
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = process.env.port || process.env.npm_config_port || 9528

module.exports = defineConfig({
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    // 代理配置
    proxy: {
      // 这里的api 表示如果我们的请求地址有/api的时候,就出触发代理机制
      // localhost:8888/api/abc  => 代理给另一个服务器
      // 本地的前端  =》 本地的后端  =》 代理我们向另一个服务器发请求 （行得通）
      // 本地的前端  =》 另外一个服务器发请求 （跨域 行不通）
      '/els': {
        target: process.env.VUE_APP_BASE_API, // 跨域请求的地址
        changeOrigin: true, // 是否跨域 需要设置此值为true 才可以让本地服务代理我们发出请求
        ws: false,
      }
    }
    // before: require('./mock/mock-server.js')
  },
  pages: {
    index: {
      entry: "playground/main.js",
      template: "public/index.html"
    }
  },
  transpileDependencies: false,
  runtimeCompiler: true,
  parallel: true,
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
        "@packages": resolve("packages"),
        "@utils": resolve("utils")
      }
    }
  },
  chainWebpack(config) {
    config.module.rule("svg").exclude.add(resolve("packages/bpmn-icons")).end();
    config.module // 将xml-loader替换成raw-loader
        .rule('raw-loader')
        .test(/.(bpmn|xml)$/)
        .use('raw-loader')
        .loader('raw-loader')
        .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("packages/bpmn-icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "[name]"
      })
      .end();
  }
});
