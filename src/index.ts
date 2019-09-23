import { Config, setConfig } from './config'
import { handleErr, handlePv, handlePerf, handleHashchange, handleHistorystatechange, handleClick, handleResource, handleSum, handleAvg, handleMsg, handleHealth, } from './handlers'
import {on,off} from './utils/tools'
import { hackState, hackConsole, hackhook, hackOnpopstate, } from './hack'
import { setGlobalPage, setGlobalSid, setGlobalHealth, GlobalVal, } from './config/global'

export default class Bombay {

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
    setGlobalPage(location.pathname.toLowerCase())
    setGlobalSid()

    Config.autoSendPv && this.sendPv();
    Config.isPage && this.sendPerf();

    Config.enableSPA && this.addListenRouterChange();
    Config.isError && this.addListenJs();
    Config.isAjax && this.addListenAjax();
    Config.isRecord && this.addRrweb();
    // 行为是一个页面内的操作
    Config.isBehavior && this.addListenBehavior()
    Config.isResource && this.sendResource()
    // 绑定全局变量
    window.__bb = this
    this.addListenUnload()
    hackOnpopstate()
  }

  sendPv() {
    handlePv()
  }

  sendPerf() {
    handlePerf()
  }

  // 发送资源
  sendResource() {
    'complete' === window.document.readyState ? handleResource() : this.addListenResource()
  }

  // 监听资源
  addListenResource() {
    on('load', handleResource);
  }

  // 监听行为
  addListenBehavior() {
    Config.behavior.console && hackConsole()
    Config.behavior.click && this.addListenClick()
  }

  // 监听click
  addListenClick() {
    on('click', handleClick);
    on('keypress', handleClick);
  }

  // 监听路由
  addListenRouterChange() {
    hackState('pushState')
    hackState('replaceState')
    on('hashchange', handleHashchange)
    on('historystatechange', handleHistorystatechange)
  }

  addListenJs() {
    // js错误或静态资源加载错误
    on('error', handleErr)
    //promise错误
    on('unhandledrejection', handleErr)
    // window.addEventListener('rejectionhandled', rejectionhandled, true);
    
  }

  addListenAjax() {
    hackhook()
  }

  // beforeunload
  addListenUnload() {
    on('beforeunload', handleHealth)
  }

  addRrweb() {

  }

  // 移除路由
  removeListenRouterChange() {
    off('hashchange', handleHashchange)
    off('historystatechange', handleHistorystatechange)
    
  }

  removeListenJs() {
    off('error', handleErr)
    off('unhandledrejection', handleErr)
  }

  // 监听资源
  removeListenResource() {
    off('beforeunload', handleHealth);
  }

  removeListenAjax() {

  }

  removeListenUnload() {
    off('load', handleResource);
  }

  removeRrweb() {

  }

  sum(key: string, val: number) {
    handleSum(key, val)
  }

  avg(key: string, val: number) {
    handleAvg(key, val)
  }

  msg(key: string) {
    handleMsg(key)
  }

  destroy() {
    Config.enableSPA && this.removeListenRouterChange();
    Config.isError && this.removeListenJs()
    Config.isAjax && this.removeListenAjax()
    Config.isRecord && this.removeRrweb()
    Config.isResource && this.removeListenResource()
    this.removeListenResource()
  }
}