import {getModeler} from '@packages/bpmn-utils/BpmnDesignerUtils'
import {createFactoyElement} from '@packages/bpmn-utils/BpmnFactoryUtils'
import {getExtA1RootElement, getDefinitionElement, getExtA1ChildElement, removeExtA1ChildElement} from '@packages/bo-utils/ExtA1ElementUtils'
import {is} from 'bpmn-js/lib/util/ModelUtil'

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

        let extPropertiesDefElementList = getExtA1ChildElement(extPropertiesElement)
        if (!extPropertiesDefElementList || extPropertiesDefElementList.length == 0) {
            let extPropertiesDefElement = createFactoyElement('extA1:PropertiesDef', properties, extPropertiesElement)
            extPropertiesDefElement.businessObject = extPropertiesDefElement
            extPropertiesElement.child = [extPropertiesDefElement]
        } else {
            let extPropertiesDefElement = extPropertiesDefElementList[0]
            if (!extPropertiesDefElement.businessObject) {
                extPropertiesDefElement.businessObject = extPropertiesDefElement
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
            return extPropertiesDefElement[0]
        }
    } catch (e) {
        console.log(e)
    }
}

/**
 * extA1:Globals
 * @param extA1RootElementType
 * @param extA1ChildElementType
 * @param properties
 */
export function saveExtA1Globals (element, properties) {
    try {
        const modeling = getModeler.getModeling()
        const bpmnDefinitionElement = getDefinitionElement()

        // 判断是否存在ExtProperties
        let extGlobalsElement = getExtA1RootElement('extA1:Globals')
        if (!extGlobalsElement) {
            extGlobalsElement = createFactoyElement('extA1:Globals', {}, bpmnDefinitionElement)
            /*在第0个元素上添加extA1:ExtProperties节点*/
            bpmnDefinitionElement.rootElements.splice(0, 0, extGlobalsElement)
        }

        let extGlobalElementList = getExtA1ChildElement(extGlobalsElement, (index, item)=>{
            return properties.id && properties.id == item.id
        })

        if (!extGlobalElementList || extGlobalElementList.length == 0) {
            let extGlobalElement = createFactoyElement('extA1:Global', properties, extGlobalsElement)
            extGlobalElement.businessObject = extGlobalElement
            if (!extGlobalsElement.child || extGlobalsElement.child.length == 0) {
                extGlobalsElement.child = [extGlobalElement]
            } else {
                extGlobalsElement.child.push(extGlobalElement)
            }
        } else {
            let extGlobalElement = extGlobalElementList[0]
            if (!extGlobalElement.businessObject) {
                extGlobalElement.businessObject = extGlobalElement
            }
            modeling.updateProperties(extGlobalElement, properties)
        }
    } catch (e) {
        console.log(e)
    }
}

/**
 * extA1:Globals
 * @param extA1RootElementType
 * @param extA1ChildElementType
 * @param properties
 */
export function getExtA1Globals (filter) {
    // 判断是否存在ExtProperties
    let extGlobalsElement = getExtA1RootElement('extA1:Globals')
    if (!extGlobalsElement) {
        return
    }
    return getExtA1ChildElement(extGlobalsElement, (index, item)=> filter(index, item))
}

/**
 * extA1:Globals
 * @param extA1RootElementType
 * @param extA1ChildElementType
 * @param properties
 */
export function getExtA1Attributes (filter) {
    // 判断是否存在ExtProperties
    let extGlobalsElement = getExtA1RootElement('extA1:ExtAttributes')
    if (!extGlobalsElement) {
        return
    }
    return getExtA1ChildElement(extGlobalsElement, (index, item)=> filter(index, item))
}

/**
 * extA1:ExtAttributes
 * @param extA1RootElementType
 * @param extA1ChildElementType
 * @param properties
 */
export function saveExtAttributes (element, properties) {
    try {
        const modeling = getModeler.getModeling()
        const bpmnDefinitionElement = getDefinitionElement()

        // 判断是否存在ExtAttributes
        let extGlobalsElement = getExtA1RootElement('extA1:ExtAttributes')
        if (!extGlobalsElement) {
            extGlobalsElement = createFactoyElement('extA1:ExtAttributes', {}, bpmnDefinitionElement)
            /*在第0个元素上添加extA1:ExtAttributes节点*/
            bpmnDefinitionElement.rootElements.splice(0, 0, extGlobalsElement)
        }

        let extGlobalElementList = getExtA1ChildElement(extGlobalsElement, (index, item)=>{
            return properties.id && properties.id == item.id
        })

        if (extGlobalElementList && extGlobalElementList.length > 0) {
            removeExtA1Attribute(extGlobalElementList[0])
        }

        let extGlobalElement = createFactoyElement('extA1:ExtAttribute', properties, extGlobalsElement)
        extGlobalElement.businessObject = extGlobalElement
        if (!extGlobalsElement.child || extGlobalsElement.child.length == 0) {
            extGlobalsElement.child = [extGlobalElement]
        } else {
            extGlobalsElement.child.push(extGlobalElement)
        }
    } catch (e) {
        console.log(e)
    }
}

/**
 * 移除extA1:ExtAttribute
 * @param element
 */
export function removeExtA1Attribute (element) {
    removeExtA1ChildElement('extA1:ExtAttributes', element)
}

/**
 * 是否为用户节点
 * @param element
 * @returns {boolean}
 */
export function isUserTask (element) {
    return is(element, 'bpmn:UserTask')
}
/**
 * 移除全局事件节点
 * @param element
 */
export function removeExtA1GlobalRequest (element) {
    removeExtA1ChildElement('extA1:Globals', element)
}
/**
 * 获取所有用户节点
 * @param bpmnModeler
 * @returns {*[]}
 */
export function getAllUserTask () {
    const elementRegistry = getModeler().get('elementRegistry')
    const _elements = elementRegistry._elements
    let result = new Array()
    Object.keys(_elements).forEach((key, index) => {
        var _element = elementRegistry.get(key)
        var _type = _element.type
        if (_type == 'bpmn:UserTask') {
            result.push(_element.businessObject)
        }
    })
    return result
}

