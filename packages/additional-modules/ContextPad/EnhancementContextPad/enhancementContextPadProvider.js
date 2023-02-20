import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider'
import {is} from 'bpmn-js/lib/util/ModelUtil'
import EventEmitter from '@utils/EventEmitter'

// 重写原型链上的
ContextPadProvider.prototype.getContextPadEntries = function (element) {
}

export default class EnhancementContextPadProvider {
    constructor (contextPad, config, injector, translate, bpmnFactory, elementFactory, create, modeling, connect) {
        this.create = create
        this.elementFactory = elementFactory
        this.translate = translate
        this.bpmnFactory = bpmnFactory
        this.modeling = modeling
        this.connect = connect
        config = config || {}
        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false)
        }
        // 定义这是一个contextPad
        contextPad.registerProvider(this)
    }

    getContextPadEntries (element) {
        if (element.type=='label') {
            return {}
        }

        const {
            autoPlace,
            create,
            elementFactory,
            translate,
            modeling,
            connect,
            bpmnFactory
        } = this

        const actions = {}
        // 删除元素
        const removeElement = (event) => {
            modeling.removeElements([element])
        }

        // 连线
        const startConnect = (event, element) => {
            connect.start(event, element)
        }

        // 结束节点,追加节点
        const appendEndEvent = (event, element) => {
            if (autoPlace) {
                const shape = elementFactory.createShape({type: 'bpmn:EndEvent'})
                autoPlace.append(element, shape)
            } else {
                appendServiceTaskStart(event, element)
            }
        }

        const appendEndEventStart = (event) => {
            const shape = elementFactory.createShape({type: 'bpmn:EndEvent'})
            create.start(event, shape, element)
        }

        // 添加排他网关
        const appendGateway = (event, element) => {
            if (autoPlace) {
                const shape = elementFactory.createShape({type: 'bpmn:ExclusiveGateway'})
                autoPlace.append(element, shape)
            } else {
                appendServiceTaskStart(event, element)
            }
        }

        const appendGatewayStart = (event) => {
            const shape = elementFactory.createShape({type: 'bpmn:ExclusiveGateway'})
            create.start(event, shape, element)
        }

        // 服务节点,追加节点
        const appendServiceTask = (event, element) => {
            if (autoPlace) {
                const shape = elementFactory.createShape({type: 'bpmn:ServiceTask'})
                autoPlace.append(element, shape)
            } else {
                appendServiceTaskStart(event, element)
            }
        }

        const appendServiceTaskStart = (event) => {
            const shape = elementFactory.createShape({type: 'bpmn:ServiceTask'})
            create.start(event, shape, element)
        }


        // 用户节点
        const appendUserTask = (event, element) => {
            if (autoPlace) {
                const shape = elementFactory.createShape({type: 'bpmn:UserTask'})
                autoPlace.append(element, shape)
            } else {
                appendUserTaskStart(event, element)
            }
        }

        const appendUserTaskStart = (event) => {
            const shape = elementFactory.createShape({type: 'bpmn:UserTask'})
            create.start(event, shape, element)
        }

        // 删除按钮
        const deleteElement = {
            group: 'edit',
            className: 'bpmn-icon-trash',
            title: translate('Remove'),
            action: {
                click: removeElement
            }
        }

        const changeTypeElement =  {
            group: 'edit',
            className: 'bpmn-icon-screw-wrench',
            title: translate('Change type'),
            action: {
                click: function (event, element) {
                    return EventEmitter.emit('show-contextmenu', event, element)
                }
            }
        }
        // 连线
        const connectElement = {
            group: 'connect',
            className: 'bpmn-icon-connection-multi',
            title: translate('Connect using DataInputAssociation'),
            action: {
                dragstart: startConnect,
                click: startConnect
            }
        }

        // 结束节点
        actions['append.end-event'] = {
            group: 'model',
            className: 'bpmn-icon-end-event-none',
            title: translate('Append EndEvent'),
            action: {
                dragstart: appendEndEventStart,
                click: appendEndEvent
            }
        }

        // 排他网关
        actions['append.gateway'] = {
            group: 'model',
            className: 'bpmn-icon-gateway-xor',
            title: translate('Append Exclusive Gateway'),
            action: {
                dragstart: appendGatewayStart,
                click: appendGateway
            }
        }

        // 添加服务节点
        actions['append.service-task'] = {
            group: 'model',
            className: 'bpmn-icon-service-task',
            title: translate('Append Service Task'),
            action: {
                dragstart: appendServiceTaskStart,
                click: appendServiceTask
            }
        }

        // 添加创建用户任务按钮
        actions['append.append-user-task'] = {
            group: 'model',
            className: 'bpmn-icon-user-task',
            title: translate('Append User Task'),
            action: {
                click: appendUserTask,
                dragstart: appendUserTaskStart
            }
        }

        actions['delete'] = deleteElement
        actions['connect'] = connectElement
        actions['replace'] = changeTypeElement

        if (is(element, 'bpmn:EndEvent') || is(element, 'bpmn:SequenceFlow')|| is(element, 'bpmn:Lane')|| is(element, 'bpmn:Participant')|| is(element, 'bpmn:TextAnnotation')) {
            return {
                'delete': {
                    group: 'model',
                    className: 'bpmn-icon-trash',
                    title: translate('Remove'),
                    action: {
                        click: removeElement
                    }
                }
            }
        }
        return actions
    }
}

EnhancementContextPadProvider.$inject = [
    'contextPad',
    'config',
    'injector',
    'translate',
    'bpmnFactory',
    'elementFactory',
    'create',
    'modeling',
    'connect'
]
