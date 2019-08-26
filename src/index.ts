import { defaultConfig, setConfig } from './config'
import { errorEvent, unhandledrejection} from './handlers'

export default class Bombay {
  config: ConfigParams

  constructor(options, fn) {
    this.init(options)
    
  }

  init(options) {
    setConfig(options)
    defaultConfig.isError && this.addListenJs();
    defaultConfig.isAjax && this.addListenAjax();
    defaultConfig.isRecord && this.addRrweb();
  }

  addListenJs() {
    window.addEventListener("error", errorEvent, true);
    window.addEventListener("unhandledrejection", unhandledrejection);
  }

  addListenAjax() {

  }

  addRrweb() {

  }

  removeListenJs() {
    window.removeEventListener("error", errorEvent, true);
    window.removeEventListener("unhandledrejection", unhandledrejection);
  }

  removeListenAjax() {

  }

  removeRrweb() {

  }

  destroy() {
    defaultConfig.isError && this.removeListenJs()
    defaultConfig.isAjax && this.removeListenAjax()
    defaultConfig.isRecord && this.removeRrweb()
  }
}