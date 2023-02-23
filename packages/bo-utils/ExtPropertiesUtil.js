import {getModeler} from '@packages/bpmn-utils/BpmnDesignerUtils'
import {createFactoyElement} from '@packages/bpmn-utils/BpmnFactoryUtils'


export function saveExtProperties (activeElement, properties) {
    try {
        const elementRegistry = getModeler().get('elementRegistry')
        const modeling = getModeler.getModeling()
        const processElement = getProcessElement(elementRegistry)
        const bpmnDefinitionElement = processElement.businessObject.$parent
        // 判断是否存在ExtProperties
        let extPropertiesElement = getExtPropertiesElement(bpmnDefinitionElement, 'extA1:ExtProperties')
        if (!extPropertiesElement) {
            extPropertiesElement = createFactoyElement('extA1:ExtProperties', {}, bpmnDefinitionElement)
            /*在第0个元素上添加extA1:ExtProperties节点*/
            bpmnDefinitionElement.rootElements.splice(0, 0, extPropertiesElement)
        }

        let extPropertiesDefElement = getExtPropertiesDefElement(extPropertiesElement)
        if (!extPropertiesDefElement) {
            extPropertiesDefElement = createFactoyElement('extA1:PropertiesDef', properties, extPropertiesElement)
            extPropertiesDefElement.businessObject = extPropertiesDefElement
            extPropertiesElement.child = [extPropertiesDefElement]
        } else {
            modeling.updateProperties(extPropertiesDefElement, properties)
        }
    } catch (e) {
        console.log(e)
    }
}

export function getExtProperties () {
    try {
        const elementRegistry = getModeler().get('elementRegistry')
        const processElement = getProcessElement(elementRegistry)
        const bpmnDefinitionElement = processElement.businessObject.$parent
        // 判断是否存在ExtProperties
        let extPropertiesElement = getExtPropertiesElement(bpmnDefinitionElement, 'extA1:ExtProperties')
        if (!extPropertiesElement) {
            return
        }

        let extPropertiesDefElement = getExtPropertiesDefElement(extPropertiesElement)
        if (!extPropertiesDefElement) {
            return
        } else {
            return extPropertiesDefElement
        }
    } catch (e) {
        console.log(e)
    }
}
/**
 * 获取PropertiesDef
 * @param element
 * @returns {*}
 */
function getExtPropertiesDefElement (element) {
    if (!element.child) {
        return
    }

    return element.child[0]
}

/**
 * 获取extA1:ExtProperties节点
 * @param elementRegistry
 * @returns {*}
 */
function getExtPropertiesElement (bpmnDefinitionElement, type) {
    let rootElementList = bpmnDefinitionElement.rootElements

    let extPropertiesElement
    for (let index in rootElementList) {
        let element = rootElementList[index]
        if (element && element.$type == type) {
            extPropertiesElement = element
            break
        }
    }
    return extPropertiesElement
}

/**
 * 获取process节点
 * @param elementRegistry
 * @returns {*}
 */
function getProcessElement (elementRegistry) {
    // 获取process元素
    let elementList = Object.keys(elementRegistry._elements)
    let processElement

    for (let index in elementList) {
        let key = elementList[index]
        let element = elementRegistry.get(key)
        if (element.type==('bpmn:Process')) {
            processElement = element
            break
        }
    }

    return processElement
}
