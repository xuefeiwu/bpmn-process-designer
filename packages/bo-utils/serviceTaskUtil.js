import {getModeler, getProcessEngine} from '@packages/bpmn-utils/BpmnDesignerUtils'

export function updateServiceTaskProperty (element, props) {
    const modeling = getModeler.getModeling()
    const prefix = getProcessEngine()
    const { class: eventClass, expression, delegateExpression, skipExpression} = props

    modeling.updateProperties(element, {
        [`${prefix}:class`]: eventClass ? eventClass : null,
        [`${prefix}:expression`]: expression ? expression : null,
        [`${prefix}:delegateExpression`]: delegateExpression ? delegateExpression : null,
        [`${prefix}:skipExpression`]: skipExpression ? skipExpression : null
    })

    const eventBus = getModeler.get('eventBus')
    eventBus.fire('linting.toggle', { elements: element })
}
