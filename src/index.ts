import { Config, setConfig } from './config'
import { handleErr } from './handlers'

export default class Bombay {
  config: ConfigParams

  constructor(options, fn) {
    this.init(options)
    
  }

  init(options) {
    // 没有token,则不监听任何事件
    if (options && !options.token) {
      console.warn('请输入一个token')
      return
    }
    setConfig(options)
    Config.isError && this.addListenJs();
    Config.isAjax && this.addListenAjax();
    Config.isRecord && this.addRrweb();
  }

  addListenJs() {
    // js错误或静态资源加载错误
    window.addEventListener("error", handleErr, true);
    //promise错误
    window.addEventListener("unhandledrejection", handleErr);
    // window.addEventListener('rejectionhandled', rejectionhandled, true);
    
  }

  addListenAjax() {

  }

  addRrweb() {

  }

  removeListenJs() {
    window.removeEventListener("error", handleErr, true);
    window.removeEventListener("unhandledrejection", handleErr);
  }

  removeListenAjax() {

  }

  removeRrweb() {

  }

  destroy() {
    Config.isError && this.removeListenJs()
    Config.isAjax && this.removeListenAjax()
    Config.isRecord && this.removeRrweb()
  }
}