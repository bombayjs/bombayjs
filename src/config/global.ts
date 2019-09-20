import {randomString, } from '../utils/tools'

// 默认参数
export let GlobalVal = {
  page: '', // 当前页面
  sid: '', // session id,页面切换就会改变
  sBegin: Date.now(), // 修改sid时间 
}

export function setGlobalPage(page) {
  GlobalVal.page = page
}

export function setGlobalSid() {
  GlobalVal.sid = randomString()
  GlobalVal.sBegin = Date.now()
}