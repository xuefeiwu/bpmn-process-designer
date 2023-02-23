import {getBusinessObject, is} from 'bpmn-js/lib/util/ModelUtil'
import {createModdleElement} from '@packages/bpmn-utils/BpmnExtensionElements'
import {getModeler} from '@packages/bpmn-utils/BpmnDesignerUtils'


export function saveSkipFirstNode (activeElement, value) {
    const elementRegistry = getModeler().get('elementRegistry')
    const modeling = getModeler.get('modeling')

    const processElement = getProcessElement(elementRegistry)
    const bpmnDefinitionElement = processElement.businessObject.$parent

    const rootBusinessObject = getRelevantBusinessObject(bpmnDefinitionElement)
    // 判断是否存在ExtProperties
    let extPropertiesElement = getExtPropertiesElement('extA1:ExtProperties')
    if (!extPropertiesElement) {
        extPropertiesElement = createModdleElement('extA1:ExtProperties', {}, rootBusinessObject)
        bpmnDefinitionElement.child = [...extPropertiesElement]

        const childrenBusinessObject = getRelevantBusinessObject(extPropertiesElement)
        const extPropertiesDefElement = createModdleElement('extA1:PropertiesDef', {parameterUserAssign: value}, childrenBusinessObject)
        extPropertiesElement.child = [extPropertiesDefElement]
    }
}

function getRelevantBusinessObject (element) {
    const businessObject = getBusinessObject(element)
    if (is(element, 'bpmn:Participant')) {
        return businessObject.get('processRef')
    }
    return businessObject
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
        if (element.$type == type) {
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
