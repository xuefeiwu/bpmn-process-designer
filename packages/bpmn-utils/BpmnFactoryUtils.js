import {getModeler} from '@packages/bpmn-utils/BpmnDesignerUtils'

export function createFactoyElement (elementType, properties, parent) {
    const bpmnFactory = getModeler.get('bpmnFactory')
    const element = bpmnFactory.create(elementType, properties)
    parent && (element.$parent = parent)
    return element
}
