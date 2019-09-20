
import { Config, } from './config'
import { queryString, serialize } from './utils/tools'

// 上报
export function report(msg:any) {
  new Image().src = `${Config.reportUrl}?${serialize(msg)}`
}