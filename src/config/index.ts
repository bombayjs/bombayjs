// 默认参数
export let defaultConfig = {
  // 上报地址
  domain: 'http://localhost/api',
  // 提交参数
  appId: '',
  // 脚本延迟上报时间
  outtime: 300,
  // ajax请求时需要过滤的url信息
  filterUrl: ['/api/v1/report/web', 'livereload.js?snipver=1', '/sockjs-node/info'],
  // 是否上报页面性能数据
  isPage: true,
  // 是否上报ajax性能数据
  isAjax: true,
  // 是否上报页面资源数据
  isResource: true,
  // 是否上报错误信息
  isError: true,
  // 是否录屏
  isRecord: true,
}

// 设置参数
export function setConfig(options) {
  defaultConfig = {
    ...defaultConfig,
      ...options
  }
}