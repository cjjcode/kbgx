import axios from 'axios'
// import NProgress from 'nprogress'
import Vue from 'vue'
import { Notify } from 'vant'

Vue.use(Notify)
const service = axios.create({
  timeout: 15000,
  headers: {
    common: {
      // 'X-Requested-With': 'XMLHttpRequest',
    },
    post: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
})
let start = 0
let done = 0

service.interceptors.request.use(
  config => {
    start++
    // NProgress.start()
    axios.defaults.headers.post['Content-Type'] = 'application/json'
    config.method = config.method || 'POST'
    // console.log('config', config)
    return config
  },
  error => {
    Promise.reject(error)
  }
)
// response interceptor
service.interceptors.response.use(
  response => {
    done++
    if (start === done) {
      // NProgress.done()
    }
    // console.log(response)
    if (response.data) {
      if (response.data.code === 200) {
        return response.data.data ? response.data.data : true
      } else {
        Notify({ type: 'danger', message: response.data.msg })
        // return response.data.data
        return Promise.reject(response.data.data)
      }
    }
  },
  error => {
    done = start = 0
    // NProgress.done()
    if (error.message === 'timeout of 15000ms exceeded') {
      Notify({ type: 'danger', message: '请求超时，请稍后再试' })
      return Promise.reject(error)
    }
    console.log('response-err', error.message)
    Notify({ type: 'danger', message: error.message || '操作失败！' })
    return Promise.reject(error)
  }
)
export default service
