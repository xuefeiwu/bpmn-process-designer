import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider'
import {is} from 'bpmn-js/lib/util/ModelUtil'

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
        const {
            autoPlace,
            create,
            elementFactory,
            translate,
            modeling,
            bpmnFactory
        } = this

        const actions = {}

        // 删除元素
        const removeElement = (event) => {
            modeling.removeElements([element])
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
            title: translate('移除'),
            action: {
                click: removeElement
            }
        }

        // 添加服务节点
        actions['append.service-task'] = {
            group: 'model',
            className: 'bpmn-icon-service-task',
            title: translate('添加服务任务'),
            action: {
                dragstart: appendServiceTaskStart,
                click: appendServiceTask
            }
        }

        // 添加创建用户任务按钮
        actions['append.append-user-task'] = {
            group: 'model',
            className: 'bpmn-icon-user-task',
            title: translate('添加用户任务'),
            action: {
                click: appendUserTask,
                dragstart: appendUserTaskStart
            }
        }

        actions['delete'] = deleteElement

        if (is(element, 'bpmn:EndEvent') || is(element, 'bpmn:SequenceFlow')|| is(element, 'bpmn:Lane')|| is(element, 'bpmn:Participant')|| is(element, 'bpmn:TextAnnotation')) {
            return {
                'delete': {
                    group: 'model',
                    className: 'bpmn-icon-trash',
                    title: translate('移除'),
                    action: {
                        click: removeElement
                    }
                }
            }
        } else if (element.type=='label') {
            return {}
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
