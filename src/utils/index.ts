import {Config} from '../config'
import {randomString} from './tools'

export function getCommonMsg() {
  let u = (navigator as any).connection
  let data: CommonMsg = {
    guid: randomString(11),
    t: '',
    page: Config.enableSPA && location.hash ? location.hash.replace('#', '') : location.pathname,
    times: 1,
    v: Config.appVersion,
    appId: Config.appId,
    e: Config.environment,
    begin: new Date().getTime(),
    uid: getUid(),
    sid: getSid(),
    dt: document.title,
    dl: location.href,
    dr: document.referrer,
    dpr: window.devicePixelRatio,
    de: document.charset,
    sr: screen.width + "x" + screen.height,
    vp: getScreen(),
    ul: getLang(),
    ct: u ? u.effectiveType : '',
    _v: '{{VERSION}}',
  }
  return data
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
function getSid() {
  const date = new Date();
  let sid = sessionStorage.getItem('bombay_sid') || '';
  if (!sid) {
      sid = randomString();
      sessionStorage.setItem('bombay_sid', sid);
  }
  return sid;
}

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