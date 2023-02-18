/**
 * 获取流程历史
 * @param processInstanceId
 * @param processInstanceModelId
 * @returns {*}
 */
import {getAction} from '@utils/manage'


export function loadProcessHistory (processInstanceId, processInstanceModelId, config) {
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
export function loadProcessModel (modelId, config) {
    return getAction(
        `/a1bpmn/api/model/get/${modelId}`, {}, config
    )
}
