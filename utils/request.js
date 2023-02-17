// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API + '/els', // 设置axios请求的基础的基础地址s
    withCredentials: false,
    timeout: 5000 // 定义5秒超时
}) // 创建一个axios的实例

service.interceptors.request.use(
    (config) => {
        config.headers['Access-Control-Allow-Origin'] = '*'
        config.headers['Access-Control-Allow-Methods'] = 'GET, POST'
        // 必须return返回信息
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
) // 请求拦截器
service.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        return Promise.reject(error)
    }
) // 响应拦截器

export default service // 导出axios实例
