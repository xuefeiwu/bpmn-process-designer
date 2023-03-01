import {createFactoyElement} from '@packages/bpmn-utils/BpmnFactoryUtils'
import {getModeler} from '@packages/bpmn-utils/BpmnDesignerUtils'

/**
 * 更新会签节点
 * @param element
 * @param properties
 */
export function updateMultiInstanceLoopCharacteristics (element, isSequential) {
    const modeling = getModeler.getModeling()
    let loopCharacteristics = null
    if (isSequential != '') {
        loopCharacteristics = createFactoyElement('bpmn:MultiInstanceLoopCharacteristics', {
            isSequential: isSequential == 'true',
            'activiti:collection': 'PANGUASSIGNEES',
            'activiti:elementVariable': 'PANGUELEMENTASSIGNEE'
        })
    }

    modeling.updateProperties(element, {
        loopCharacteristics: loopCharacteristics
    })
}
