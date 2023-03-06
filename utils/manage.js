import request from '@utils/request'

/**
 * post请求
 * @param url
 * @param parameter
 * @param config
 * @returns {*}
 */
export function postAction(url, parameter, data, config) {
    let params = {
        url: url,
        method: 'POST',
        params: parameter,
        data: data
    }
    if (config) {
        Object.assign(params, config)
    }
    return request(params)
}

/**
 * get请求
 * @param url
 * @param parameter
 * @param config
 * @returns {*}
 */
export function getAction(url, parameter, config) {
    let params = {
        url: url,
        method: 'get',
        params: parameter
    }
    if (config) {
        Object.assign(params, config)
    }
    return request(params)
}
