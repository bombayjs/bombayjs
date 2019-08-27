import { Config, } from './config'
import { queryString, serialize } from './utils/tools'
import { getCommonMsg } from './utils/index'

export function handleErr(error): void {
  switch (error.type) {
    case 'error':
        error instanceof ErrorEvent ? reportCaughtError(error)  : reportResourceError(error)
      break;
    case 'unhandledrejection':
      reportPromiseError(error)
    break;
    // case 'httpError':
    //     reportHttpError(error)
    //   break;
  }
}

function report(msg:any) {
  new Image().src = `${Config.reportUrl}?${serialize(msg)}`
}

// 捕获js异常
function reportCaughtError(error:any):void{
  let commonMsg = getCommonMsg()
  let n = error.name || "CustomError",
      a = error.message || "",
      i = error.error.stack || ""
  let msg: ErrorMsg = {
    ...commonMsg,
    ...{
      t: 'error',
      cate: n, // 类别
      msg: a && a.substring(0, 1e3), // 信息
      stack: i && i.substring(0, 1e3), // 错误栈
      file: error.filename || "", // 出错文件
      line: error.lineno || "", // 行
      col: error.colno || "", // 列
    }
  }
  report(msg)
}

// 捕获资源异常
function reportResourceError(error:any):void{
  let commonMsg = getCommonMsg()
  let target = error.target
  let msg: ResourceMsg = {
    ...commonMsg,
    ...{
      t: 'resource',
      outerHTML: target.outerHTML,
      src: target.src,
      tagName: target.localName.toUpperCase(),
    }
  }
  report(msg)
}

// 捕获promise异常
function reportPromiseError(error:any):void{
  console.log(error)
  let commonMsg = getCommonMsg()
  let msg: PromiseMsg = {
    ...commonMsg,
    ...{
      t: 'promise',
      message: error.reason,
    }
  }
  report(msg)
}

function reportHttpError(msg:CommonMsg,data:any):void{
  // msg.records = [
  //     {
  //         type:'httpError',
  //         data:{
  //             occurTime:new Date().getTime(),
  //             title:document.title,
  //             url:window.location.href,
  //             userAgent:window.navigator.userAgent,
  //             method:data.method ? data.method : 'GET',
  //             status:data.status,
  //             statusText:data.statusText,
  //             response:data.response,
  //             requestUrl:data.url || data.requestUrl
  //         }
  //     }
  // ]
  // console.log(msg)
  // // console.log('httpError :' + queryString(msg))
  // new Image().src = `${Config.reportUrl}?commit=${queryString(msg)}`
}
