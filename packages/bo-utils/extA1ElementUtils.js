import {getModeler} from '@packages/bpmn-utils/BpmnDesignerUtils'


/**
 * 获取ExtA1的顶层元素
 * @param elementType
 * @returns {*}
 */
export function getExtA1RootElement (elementType) {
    const elementRegistry = getModeler().get('elementRegistry')
    const bpmnDefinitionElement = getDefinitionElement(elementRegistry)

    let rootElementList = bpmnDefinitionElement.rootElements

    let extPropertiesElement
    for (let index in rootElementList) {
        let element = rootElementList[index]
        if (element && element.$type == elementType) {
            extPropertiesElement = element
            break
        }
    }
    return extPropertiesElement
}

/**
 * 获取ExtA1的子元素元素
 * @param element
 * @returns {*}
 */
export function getExtA1ChildElement (extA1RootElement, filter) {
    if (!extA1RootElement.child) {
        return
    }

    if (!filter) {
        return  extA1RootElement.child
    }

    let result = extA1RootElement.child.filter((index, item, self)=>{
        return filter(item, index, self)
    })

    if (result) {
        return result
    }
}


/**
 * 获取ExtA1的子元素元素
 * @param element
 * @returns {*}
 */
export function removeExtA1ChildElement (elementType, removeElement) {
    let extA1RootElement = getExtA1RootElement(elementType)
    if (!extA1RootElement || !extA1RootElement.child) {
        return
    }

    extA1RootElement.child = extA1RootElement.child.filter((item, index, self)=> item.id != removeElement.id)
}

/**
 * 获取DefinitionElement节点
 * @param elementRegistry
 * @returns {*}
 */
export function getDefinitionElement () {
    // 获取process元素
    const elementRegistry = getModeler().get('elementRegistry')
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

    return processElement.businessObject.$parent
}


/**
 * 通过id获取节点
 * @param id
 */
export function getElementById (id) {
    const elementRegistry = getModeler().get('elementRegistry')
    return elementRegistry.get(id)
}
