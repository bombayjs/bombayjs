import {Config} from '../config'
import {randomString, parseHash, } from './tools'
import { GlobalVal } from '../config/global'

export function getCommonMsg() {
  let u = (navigator as any).connection
  let data: CommonMsg = {
    t: '',
    page: getPage(),
    times: 1,
    v: Config.appVersion,
    token: Config.token,
    e: Config.environment,
    begin: new Date().getTime(),
    uid: getUid(),
    sid: GlobalVal.sid,
    sr: screen.width + "x" + screen.height,
    vp: getScreen(),
    ct: u ? u.effectiveType : '',
    ul: getLang(),
    _v: '{{VERSION}}',
    o: location.href,
  }
  return data
}

// 获取页面
function getPage(): string {
  if (GlobalVal.page) return GlobalVal.page
  else {
    return location.pathname.toLowerCase()
  }
}

// 获取uid
function getUid(): string {
  let uid = localStorage.getItem('bombay_uid') || '';
  if (!uid) {
    uid = randomString();
    localStorage.setItem('bombay_uid', uid);
  }
  return uid;
}

// 获得sid
// TODO: 单页面
// function getSid() {
//   const date = new Date();
//   let sid = sessionStorage.getItem('bombay_sid') || '';
//   if (!sid) {
//       sid = randomString();
//       sessionStorage.setItem('bombay_sid', sid);
//   }
//   return sid;
// }

// 获取浏览器默认语言
function getLang() {
  var lang = navigator.language || (navigator as any).userLanguage; //常规浏览器语言和IE浏览器
  lang = lang.substr(0, 2); //截取lang前2位字符
  return lang
}

function getScreen() {
  let w = document.documentElement.clientWidth || document.body.clientWidth;
  let h = document.documentElement.clientHeight || document.body.clientHeight;
  return w + 'x' + h
}