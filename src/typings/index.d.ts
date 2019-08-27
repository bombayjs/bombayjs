interface ConfigParams {
  domain:string
  appId:string
  record: boolean
}

interface Records {
  type:string
  data: ErrorData
}

type ErrorData = ErrorMsg | ResourceMsg | ApiMsg | PromiseMsg | pvMsg | healthMsg | perfMsg

type MsgType = '' | 'error' | 'resource' | 'api' | 'promise' | 'pv' | 'health' | 'perf'

interface CommonMsg{
  guid: string // 唯一标识
  t: MsgType // 类型
  page: string // 页面
  times?: number // 次数
  v: string // 版本
  appId: string // 项目id
  e: string // 环境
  begin: number // 开始时间戳
  uid: string // user id
  sid: string // session id
  dt: string // document title
  dl: string // document location
  dr: string // 来源
  dpr: number // dpr
  de: string // document 编码
  sr: string // 屏幕分辨率
  vp: string // view 分辨率
  ul: string // 语言
  ct: string // 网络
  _v: string // 脚本sdk版本

}

interface ErrorMsg extends CommonMsg{
  cate:string // 类别
  msg:string // 信息
  stack:string // 错误栈
  file:string // 出错文件
  line:number // 行
  col:number // 列
}

interface ResourceMsg extends CommonMsg{
  outerHTML:string
  src:string
  tagName:string
}

interface PromiseMsg extends CommonMsg{
  message:string,
}

interface ApiMsg extends CommonMsg{
  api:string // 接口
  method:string
  success: boolean // 成功？
  time: number // 耗时
  code: number // 接口返回的code
  msg: string // 信息
  params: string
  query: string
  body: string
  response:string
}

// pv上报
interface pvMsg extends CommonMsg{
  
}

// 健康检查上报
interface healthMsg extends CommonMsg{
  errcount: number // error次数
  apisucc: number // api成功次数
  apifail: number // api错误次数
  healthy: number // 健康？ 0/1
  stay: number // 停留时间
}

// 页面性能上报
interface perfMsg extends CommonMsg{
  dns: number
  tcp: number // 停留时间
  ssl: number // 停留时间
  ttfb: number // 停留时间
  trans: number // 停留时间
  dom: number // 停留时间
  res: number // 停留时间
  firstbyte: number // 停留时间
  fpt: number // 停留时间
  tti: number // 停留时间
  ready: number // 停留时间
  load: number // 停留时间
  bandwidth: number // 停留时间
  navtype: string // nav方式 如reload
  fmp: number // 停留时间
}

// 手动上报 tag: string // 标签
