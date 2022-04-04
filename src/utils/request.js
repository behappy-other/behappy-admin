import axios from 'axios'
import message from 'element-ui/packages/message'

const url = 'http://localhost:8088/api'
const request = axios.create({
  baseURL: url,
  timeout: 6000
})

// request 拦截器
request.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json; charset=utf-8'
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  // satoken根据不同tokentype来判断是哪个端
  if (user) {
    config.headers[user.tokenType] = user.tokenPrefix + ' ' + user.token
  }
  return config
}, error => {
  return Promise.reject(error)
})

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
  response => {
    let res = response.data
    // 如果是返回的文件
    if (response.config.responseType === 'blob') {
      return res
    }
    // 兼容服务端返回的字符串数据
    if (typeof res === 'string') {
      res = res ? JSON.parse(res) : res
    }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)
const req = (url, method = 'get', params = {}, data = {}, errMsg) => {
  return request({
    url,
    method,
    params,
    data
  }).then(res => {
    if (res.code !== 0) {
      throw new Error(res.msg)
    }
    return res.data
  }).catch(e => {
    const text = errMsg || e
    message.error(text)
    return null
  })
}
export default req
