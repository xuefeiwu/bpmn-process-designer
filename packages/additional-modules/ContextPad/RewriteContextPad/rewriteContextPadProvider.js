import {is, isAny} from 'bpmn-js/lib/util/ModelUtil'
import {assign, isArray} from 'min-dash'
import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider'
import {isEventSubProcess, isExpanded} from 'bpmn-js/lib/util/DiUtil'
import {getChildLanes} from 'bpmn-js/lib/features/modeling/util/LaneUtil'

export default class RewriteContextPadProvider {
    constructor (contextPad, config, injector, translate, bpmnFactory, elementFactory, create, modeling, connect, popupMenu, canvas, rules) {
        this.create = create
        this.elementFactory = elementFactory
        this.translate = translate
        this.bpmnFactory = bpmnFactory
        this.modeling = modeling
        this.connect = connect
        this.popupMenu = popupMenu
        this.canvas = canvas
        this.rules = rules
        config = config || {}

        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false)
        }
        // 定义这是一个contextPad
        contextPad.registerProvider(this)
    }

    getContextPadEntries (element) {
        if (element.type == 'label') {
            return {}
        }

        const {
            contextPad,
            autoPlace,
            create,
            elementFactory,
            translate,
            modeling,
            popupMenu,
            canvas,
            rules,
            connect
        } = this


        /**
         * 判断是否为指定类型
         * @param eventBo
         * @param type
         * @param definition
         * @returns {false|boolean}
         */
        function isEventType (eventBo, type, definition) {
            let isType = eventBo.$instanceOf(type)
            let isDefinition = false
            let definitions = eventBo.eventDefinitions || []
            definitions.forEach(def => {
                if (def.$type === definition) {
                    isDefinition = true
                }
            })
            return isType && isDefinition
        }

        function splitLaneHandler (count) {
            return function (event, element) {
                // actual split
                modeling.splitLane(element, count)

                // refresh context pad after split to
                // get rid of split icons
                this.contextPad.open(element, true)
            }
        }

        function getReplaceMenuPosition (element) {
            var Y_OFFSET = 5

            var diagramContainer = canvas.getContainer(),
                pad = contextPad.getPad(element).html

            var diagramRect = diagramContainer.getBoundingClientRect(),
                padRect = pad.getBoundingClientRect()

            var top = padRect.top - diagramRect.top
            var left = padRect.left - diagramRect.left

            var pos = {
                x: left,
                y: top + padRect.height + Y_OFFSET
            }

            return pos
        }

        /**
         * 追加一个action
         *
         * @param {String} type
         * @param {String} className
         * @param {String} [title]
         * @param {Object} [options]
         *
         * @return {Object} descriptor
         */
        function appendAction (type, className, title, options) {
            if (typeof title !== 'string') {
                options = title
                title = translate('Append {type}', {type: type.replace(/^bpmn:/, '')})
            }

            function appendStart (event, element) {
                let shape = elementFactory.createShape(assign({type: type}, options))
                create.start(event, shape, element)
            }

            let append = autoPlace ? function (event, element) {
                let shape = elementFactory.createShape(assign({type: type}, options))
                autoPlace.append(element, shape)
            } : appendStart

            return {
                group: 'model',
                className: className,
                title: title,
                action: {
                    dragstart: appendStart,
                    click: append
                }
            }
        }

        let businessObject = element.businessObject
        const actions = {}
        // 添加泳道
        if (isAny(businessObject, ['bpmn:Lane', 'bpmn:Participant']) && isExpanded(businessObject)) {
            let childLanes = getChildLanes(element)
            assign(actions, {
                'lane-insert-above': {
                    group: 'lane-insert-above',
                    className: 'bpmn-icon-lane-insert-above',
                    title: translate('Add Lane above'),
                    action: {
                        click: function (event, element) {
                            modeling.addLane(element, 'top')
                        }
                    }
                }
            })

            if (childLanes.length < 2) {
                if (element.height >= 120) {
                    assign(actions, {
                        'lane-divide-two': {
                            group: 'lane-insert-above',
                            className: 'bpmn-icon-lane-divide-two',
                            title: translate('Divide into two Lanes'),
                            action: {
                                click: splitLaneHandler(2)
                            }
                        }
                    })
                }

                if (element.height >= 180) {
                    assign(actions, {
                        'lane-divide-three': {
                            group: 'lane-insert-above',
                            className: 'bpmn-icon-lane-divide-three',
                            title: translate('Divide into three Lanes'),
                            action: {
                                click: splitLaneHandler(3)
                            }
                        }
                    })
                }
            }

            assign(actions, {
                'lane-insert-below': {
                    group: 'lane-insert-above',
                    className: 'bpmn-icon-lane-insert-below',
                    title: translate('Add Lane below'),
                    action: {
                        click: function (event, element) {
                            modeling.addLane(element, 'bottom')
                        }
                    }
                }
            })
        }

        // 节点
        if (is(businessObject, 'bpmn:FlowNode')) {
            if (is(businessObject, 'bpmn:EventBasedGateway')) {
                assign(actions, {
                    'append.receive-task': appendAction(
                        'bpmn:ReceiveTask',
                        'bpmn-icon-receive-task'
                    ),
                    'append.message-intermediate-event': appendAction(
                        'bpmn:IntermediateCatchEvent',
                        'bpmn-icon-intermediate-event-catch-message',
                        translate('Append MessageIntermediateCatchEvent'),
                        {eventDefinitionType: 'bpmn:MessageEventDefinition'}
                    ),
                    'append.timer-intermediate-event': appendAction(
                        'bpmn:IntermediateCatchEvent',
                        'bpmn-icon-intermediate-event-catch-timer',
                        translate('Append TimerIntermediateCatchEvent'),
                        {eventDefinitionType: 'bpmn:TimerEventDefinition'}
                    ),
                    'append.condtion-intermediate-event': appendAction(
                        'bpmn:IntermediateCatchEvent',
                        'bpmn-icon-intermediate-event-catch-condition',
                        translate('Append ConditionIntermediateCatchEvent'),
                        {eventDefinitionType: 'bpmn:ConditionalEventDefinition'}
                    ),
                    'append.signal-intermediate-event': appendAction(
                        'bpmn:IntermediateCatchEvent',
                        'bpmn-icon-intermediate-event-catch-signal',
                        translate('Append SignalIntermediateCatchEvent'),
                        {eventDefinitionType: 'bpmn:SignalEventDefinition'}
                    )
                })
            } else if (isEventType(businessObject, 'bpmn:BoundaryEvent', 'bpmn:CompensateEventDefinition')) {
                assign(actions, {
                    'append.compensation-activity':
                        appendAction(
                            'bpmn:Task',
                            'bpmn-icon-task',
                            translate('Append compensation activity'),
                            {
                                isForCompensation: true
                            }
                        )
                })
            } else if (!is(businessObject, 'bpmn:EndEvent') &&
                !businessObject.isForCompensation &&
                !isEventType(businessObject, 'bpmn:IntermediateThrowEvent', 'bpmn:LinkEventDefinition') &&
                !isEventSubProcess(businessObject)) {
                assign(actions, {
                    'append.end-event': appendAction(
                        'bpmn:EndEvent',
                        'bpmn-icon-end-event-none',
                        translate('Append EndEvent')
                    ),
                    'append.gateway': appendAction(
                        'bpmn:ExclusiveGateway',
                        'bpmn-icon-gateway-xor',
                        translate('Append Exclusive Gateway')
                    ),
                    'append.append-user-task': appendAction(
                        'bpmn:UserTask',
                        'bpmn-icon-user-task',
                        translate('Append User Task')
                    )
                    // 'append.intermediate-event': appendAction(
                    //     'bpmn:IntermediateThrowEvent',
                    //     'bpmn-icon-intermediate-event-none',
                    //     translate('Append Intermediate/Boundary Event')
                    // )
                })
            }
        }

        if (!popupMenu.isEmpty(element, 'bpmn-replace')) {
            // Replace menu entry
            assign(actions, {
                'replace': {
                    group: 'edit',
                    className: 'bpmn-icon-screw-wrench',
                    title: translate('Change type'),
                    action: {
                        click: function (event, element) {
                            var position = assign(getReplaceMenuPosition(element), {
                                cursor: {x: event.x, y: event.y}
                            })

                            popupMenu.open(element, 'bpmn-replace', position)
                        }
                    }
                }
            })
        }

        function startConnect (event, element) {
            connect.start(event, element)
        }

        function removeElement (e) {
            modeling.removeElements([element])
        }

        if (isAny(businessObject, [
            'bpmn:FlowNode',
            'bpmn:InteractionNode',
            'bpmn:DataObjectReference',
            'bpmn:DataStoreReference'
        ])) {
            assign(actions, {
                'append.text-annotation': appendAction('bpmn:TextAnnotation', 'bpmn-icon-text-annotation'),
                'connect': {
                    group: 'connect',
                    className: 'bpmn-icon-connection-multi',
                    title: translate('Connect using ' +
                        (businessObject.isForCompensation ? '' : 'Sequence/MessageFlow or ') +
                        'Association'),
                    action: {
                        click: startConnect,
                        dragstart: startConnect
                    }
                }
            })
        }

        if (isAny(businessObject, ['bpmn:DataObjectReference', 'bpmn:DataStoreReference'])) {
            assign(actions, {
                'connect': {
                    group: 'connect',
                    className: 'bpmn-icon-connection-multi',
                    title: translate('Connect using DataInputAssociation'),
                    action: {
                        click: startConnect,
                        dragstart: startConnect
                    }
                }
            })
        }

        // delete element entry, only show if allowed by rules
        var deleteAllowed = rules.allowed('elements.delete', {elements: [element]})

        if (isArray(deleteAllowed)) {
            // was the element returned as a deletion candidate?
            deleteAllowed = deleteAllowed[0] === element
        }

        if (deleteAllowed) {
            assign(actions, {
                'delete': {
                    group: 'edit',
                    className: 'bpmn-icon-trash',
                    title: translate('Remove'),
                    action: {
                        click: removeElement
                    }
                }
            })
        }
        return actions
    }
}


RewriteContextPadProvider.$inject = [
    'contextPad',
    'config',
    'injector',
    'translate',
    'bpmnFactory',
    'elementFactory',
    'create',
    'modeling',
    'connect',
    'popupMenu',
    'canvas',
    'rules'
]


// 重写原型链上的
ContextPadProvider.prototype.getContextPadEntries = function (element) {
}
