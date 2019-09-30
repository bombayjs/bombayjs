interface ConfigParams {
  domain:string
  token:string
  record: boolean
}

interface Records {
  type:string
  data: ReportData
}

type ReportData = ErrorMsg | ResourceMsg | ApiMsg  | pvMsg | healthMsg | perfMsg | behaviorMsg | sumMsg | avgMsg | percentMsg | msgMsg

type MsgType = '' | 'error' | 'res' | 'api' | 'pv' | 'health' | 'perf' | 'behavior' | 'sum' | 'avg' | 'percent' | 'msg'

interface CommonMsg{
  t: MsgType // 类型
  times?: number // 次数
  page: string // 页面
  v: string // 版本
  e: string // 开发生产环境
  token: string // 项目id
  begin: number // 开始时间戳
  sr: string // 屏幕分辨率
  vp: string // view 分辨率
  _v: string // 脚本sdk版本
  uid: string // user id
  sid: string // session id
  ct: string // 网络
  ul: string // 语言
  o: string // 原始url
}

// pv上报
interface pvMsg extends CommonMsg{
  dt: string // document title
  dl: string // document location
  dr: string // 来源
  dpr: number // dpr
  de: string // document 编码
}
interface ErrorMsg extends CommonMsg{
  st: string // sub type
  msg:string // 信息
  cate?:string // 类别
  detail?:string // 错误栈 或 出错标签
  file?:string // 出错文件
  line?:number // 行
  col?:number // 列
}

interface ResourceMsg extends CommonMsg{
  dom: number // 所有解析时间 domInteractive - responseEnd
  load: number // 所有资源加载完时间 loadEventStart- fetchStart
  res: PerformanceEntry[]
}

interface ApiMsg extends CommonMsg{
  url:string // 接口
  success: boolean // 成功？
  time: number // 耗时
  code: number // 接口返回的code
  msg: string // 信息
  // method:string
  // params: string
  // query: string
  // body: string
  // response:string
}


// 健康检查上报
interface healthMsg extends CommonMsg, Health{
  healthy: number // 健康？ 0/1
  stay: number // 停留时间
}

interface Health {
  errcount: number // error次数
  apisucc: number // api成功次数
  apifail: number // api错误次数
}

// 页面性能上报
interface perfMsg extends CommonMsg{
  dns: number // dns时间
  tcp: number // tcp时间
  ssl: number // ssl时间
  ttfb: number // ResponseStart - RequestStart (首包时间，关注网络链路耗时)
  trans: number // 停留时间
  dom: number // dom解析时间
  res: number // 停留时间
  firstbyte: number // 首字节时间
  fpt: number // ResponseEnd - FetchStart （首次渲染时间 / 白屏时间）
  tti: number // DomInteractive - FetchStart （首次可交付时间）
  ready: number // DomContentLoadEventEnd - FetchStart （加载完成时间）
  load: number // LoadEventStart - FetchStart （页面完全加载时间）
  bandwidth: number // 估计的带宽 单位M/s
  navtype: string // nav方式 如reload
  fmp: number // 停留时间
}

// 行为上报
interface behaviorMsg extends CommonMsg{
  behavior: Behavior
}

// 手动上报 tag: string // 标签


type Behavior = navigationBehavior | consoleBehavior | eventBehavior;


interface navigationBehavior {
  type: 'navigation',
  data: {
    from: string,
    to: string,
  },
}

interface consoleBehavior {
  type: 'console',
  data: {
    level: string,
    message: string,
  },
}

interface eventBehavior {
  type: string,
  data: {
    path: string,
    message: string,
  },
}

interface sumMsg extends CommonMsg {
  group: string
  key: string
  val: number,
}

interface avgMsg extends CommonMsg {
  group: string
  key: string
  val: number,
}

interface percentMsg extends CommonMsg {
  group: string
  key: string
  subkey: string,
  val: number,
}

interface msgMsg extends CommonMsg {
  group: string
  msg: string,
}