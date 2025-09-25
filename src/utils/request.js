import axios from 'axios'
import { useUserStore } from '@/stores/index'
import { ElMessage } from 'element-plus' // 添加这行导入
import router from '@/router'

const baseURL = 'https://big-event-vue-api-t.itheima.net'

const request = axios.create({
  baseURL,
  timeout: 5000,
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const user = useUserStore()
    if (user.token) {
      config.headers.Authorization = user.token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么

    return Promise.reject(error)
  },
)

// 添加响应拦截器
request.interceptors.response.use(
  function (res) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (res.data?.code === 0) return res

    //请求失败
    if (res.data?.code !== 0) {
      ElMessage({
        message: res.data?.message || '服务错误',
        type: 'error',
      })
      return res.data
    }
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    //401缺少token、或者token过期
    //去登录页
    if (
      error.code === 'ECONNABORTED' ||
      error.message?.toLowerCase().includes('timeout') ||
      error.message?.toLowerCase().includes('exceeded')
    ) {
      // 请求超时的特殊处理
      ElMessage({
        message: '请求超时，请检查网络连接或稍后重试',
        type: 'error',
      })
      return Promise.reject(error) // 继续抛出错误，避免后续逻辑执行
    }
    if (error.response?.status === 401) {
      router.push('/login')
    }
    //默认情况
    ElMessage({ message: error?.response?.data?.message || '服务异常', type: 'error' })
    console.log(error)
    return Promise.reject(error)
  },
)

export default request
export { baseURL }
