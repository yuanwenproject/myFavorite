// 公用方法
// 过滤参数是空的值
function addSqlForm (data) {
  let arr = []
  Object.keys(data).forEach(key => {
    if (data[key] && data[key] != null && data[key] != undefined) {
      if (typeof data[key] !== 'object') {
        arr.push(`${key}='${data[key]}'`)
      } else {
        getResult(data[key])
      }
    }
  })
  let str = arr.join(',')
  return str
}

module.exports = {
  addSqlForm
}