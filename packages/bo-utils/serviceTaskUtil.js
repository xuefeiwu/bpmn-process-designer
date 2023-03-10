import {getModeler, getProcessEngine} from '@packages/bpmn-utils/BpmnDesignerUtils'

export function updateServiceTaskProperty (element, props) {
    const modeling = getModeler.getModeling()
    const prefix = getProcessEngine()
    const { class: eventClass, expression, delegateExpression} = props

    modeling.updateProperties(element, {
        [`${prefix}:class`]: eventClass ? eventClass : '',
        [`${prefix}:expression`]: expression ? expression : '',
        [`${prefix}:delegateExpression`]: delegateExpression ? delegateExpression : ''
    })
}
