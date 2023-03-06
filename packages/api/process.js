/**
 * 获取流程历史
 * @param processInstanceId
 * @param processInstanceModelId
 * @returns {*}
 */
import {getAction} from '@utils/manage'


export function loadProcessHistory(processInstanceId, processInstanceModelId, config) {
    return getAction(
        `/a1bpmn/api/runtime/hisInstance/v1/nodeOpinion?processInstanceId=${processInstanceId}&processInstanceModelId=${processInstanceModelId}`, {}, config
    )
}

/**
 * 加载流程模型xml
 * @param modelId
 * @param config
 * @returns {*}
 */
export function loadProcessModel(modelId, config) {
    return getAction(
        `/a1bpmn/api/model/get/${modelId}`, {}, config
    )
}


/**
 * page=1&length=10&fullName=33&account=44&userNo=55&admin=false
 * 获取用户
 * @param modelId
 * @param config
 * @returns {*}
 */
export function getUserListPage(params, config) {
    return getAction(
        `/uc/api/user/page/listAll`, params, config
    )
}

/**
 * page=1&length=10&name=d
 * 获取角色
 * @param params
 * @param config
 */
export function getRoleListPage(params, config) {
    return getAction(
        `uc/api/role/list/page`, params, config
    )
}

/**
 * page=1&length=10&deptName=d
 * 获取部门
 * @param params
 * @param config
 */
export function getOrgListPage(params, config) {
    return getAction(
        `/uc/api/org/page/list`, params, config
    )
}

/**
 * page=1&length=10&scriptName=d&scriptCode=d
 * 获取脚本
 * @param params
 * @param config
 */
export function getScriptListPage(params, config) {
    return getAction(
        `/uc/api/script/page/list`, params, config
    )
}
