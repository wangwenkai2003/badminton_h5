import { useUserStore } from '@/stores/user'
import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

const baseURL = '/api'

const instance = axios.create({
  //1.基础地址，超时时间
  baseURL,
  timeout: 100000
})

instance.interceptors.request.use(
  (config) => {
    const useStore = useUserStore()
    //2.携带token
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }

    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    //3.处理业务
    //4.摘取核心响应数据
    if (res.data.code === 1) {
      return res
    }
    ElMessage({ message: res.data.message || '服务异常', type: 'error' })
    return Promise.reject(res.data)
  },
  (err) => {
    //5.处理401错误
    ElMessage({ message: err.data.message || '服务异常', type: 'error' })
    if (err.response?.status === 401) {
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
