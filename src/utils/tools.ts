export function queryString(obj:object):string{
  return encodeURIComponent(JSON.stringify(obj));
}


export function isObject(obj:any):boolean{
  if(Object.prototype.toString.call(obj) == "[object Object]" || Object.prototype.toString.call(obj) == "[object Array]"){
      return true
  }
  return false;
}


export function randomString(len?: number) {
  len = len || 10;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
      pwd = pwd + $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd + new Date().getTime();
}

// 将{ method: 'get', state: '200' }转为?method=get&state=200
export function serialize(obj) {
  var str = [];
  for (var p in obj)
   if (obj.hasOwnProperty(p)) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
   }
  return str.join("&");
}
