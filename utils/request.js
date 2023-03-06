// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@packages/store'

const service = axios.create({
    baseURL: '/els', // 设置axios请求的基础的基础地址s
    withCredentials: false,
    timeout: 5000 // 定义5秒超时
}) // 创建一个axios的实例

/**
 * 获取请求参数
 * @param name
 * @returns {string|null}
 */
export function getParamter (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var params = window.location.search.substr(1).match(reg)
    if (params != null) return unescape(params[2])
    return null
}

service.interceptors.request.use(
    (config) => {
        // if (!store.getters.getToken) {
        //     return Promise.reject(new Error('token不存在！'))
        // }
        // config.headers['x-access-token'] = store.getters.getToken
        config.headers['x-access-token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NzgwOTEyMTQsImFjY291bnQiOiIzMDcwMDBfZGFpd2VpIn0.wXym2Hk20Qgx-0sVsEq3wk-rqGs66ZUU0XHZPzcj-JQ'
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
