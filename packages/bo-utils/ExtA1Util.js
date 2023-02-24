import {getModeler} from '@packages/bpmn-utils/BpmnDesignerUtils'
import {createFactoyElement} from '@packages/bpmn-utils/BpmnFactoryUtils'
import {getExtA1RootElement, getDefinitionElement, getExtA1ChildElement} from '@packages/bo-utils/ExtA1ElementUtils'

/**
 * extA1:ExtProperties
 * @param extA1RootElementType
 * @param extA1ChildElementType
 * @param properties
 */
export function saveExtA1Properties (properties) {
    try {
        const modeling = getModeler.getModeling()
        const bpmnDefinitionElement = getDefinitionElement()

        // 判断是否存在ExtProperties
        let extPropertiesElement = getExtA1RootElement('extA1:ExtProperties')
        if (!extPropertiesElement) {
            extPropertiesElement = createFactoyElement('extA1:ExtProperties', {}, bpmnDefinitionElement)
            /*在第0个元素上添加extA1:ExtProperties节点*/
            bpmnDefinitionElement.rootElements.splice(0, 0, extPropertiesElement)
        }

        let extPropertiesDefElement = getExtA1ChildElement(extPropertiesElement)
        if (!extPropertiesDefElement) {
            extPropertiesDefElement = createFactoyElement('extA1:PropertiesDef', properties, extPropertiesElement)
            extPropertiesDefElement.businessObject = extPropertiesDefElement
            extPropertiesElement.child = [extPropertiesDefElement]
        } else {
            if (!extPropertiesDefElement.businessObject) {
                extPropertiesDefElement.businessObject = extPropertiesDefElement
                extPropertiesElement.child = [extPropertiesDefElement]
            }
            modeling.updateProperties(extPropertiesDefElement, properties)
        }
    } catch (e) {
        console.log(e)
    }
}

/**
 * 获取properties配置参数
 * @returns {*}
 */
export function getExtA1Properties () {
    try {
        // 判断是否存在ExtProperties
        let extPropertiesElement = getExtA1RootElement('extA1:ExtProperties')
        if (!extPropertiesElement) {
            return
        }

        let extPropertiesDefElement = getExtA1ChildElement(extPropertiesElement)
        if (!extPropertiesDefElement) {
            return
        } else {
            return extPropertiesDefElement
        }
    } catch (e) {
        console.log(e)
    }
}


