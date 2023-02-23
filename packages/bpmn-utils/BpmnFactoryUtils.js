import {getModeler} from '@packages/bpmn-utils/BpmnDesignerUtils'

export function createFactoyElement (elementType, properties, parent) {
    let bpmnFactory = getModeler.get('bpmnFactory')
    let element = bpmnFactory.create(elementType, properties)
    element.$parent = parent
    return element
}
