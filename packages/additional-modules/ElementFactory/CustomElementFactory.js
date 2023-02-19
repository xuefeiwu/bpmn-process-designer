import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
import {getBusinessObject, is} from 'bpmn-js/lib/util/ModelUtil'
import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import Modeling from 'bpmn-js/lib/features/modeling/Modeling.js'

class CustomElementFactory extends ElementFactory {
    constructor (config, bpmnFactory, moddle, translate) {
        super(bpmnFactory, moddle, translate)
        this._config = config
        this._bpmnFactory = bpmnFactory
    }

    getDefaultSize (element, di) {
        const bo = getBusinessObject(element)
        const types = Object.keys(this._config || {})
        for (const type of types) {
            if (is(bo, type)) {
                return this._config[type]
            }
        }
        return super.getDefaultSize(element, di)
    }
}

CustomElementFactory.$inject = ['config.elementFactory', 'bpmnFactory', 'moddle', 'translate']

BpmnFactory.prototype._ensureId = function (element) {
    if (element.id) {
        this._model.ids.claim(element.id, element)
        return
    }

    // generate semantic ids for elements
    // bpmn:SequenceFlow -> SequenceFlow_ID
    var prefix = (element.$type || '').replace(/^[^:]*:/g, '')
    prefix += '_'

    if (!element.id && this._needsId(element)) {
        element.id = this._model.ids.nextPrefixed(prefix, element)
    }
}

/**
 * 创建节点自动添加节点默认名称
 *
 * @param {djs.model.Shape|Object} shape
 * @param {Point} position
 * @param {djs.model.Shape|djs.model.Root} target
 * @param {Number} [parentIndex] position in parents children list
 * @param {Object} [hints]
 * @param {Boolean} [hints.attach] whether to attach to target or become a child
 *
 * @return {djs.model.Shape} the created shape
 */
Modeling.prototype.createShape = function (shape, position, target, parentIndex, hints) {

    if (typeof parentIndex !== 'number') {
        hints = parentIndex
        parentIndex = undefined
    }

    hints = hints || {}

    var attach = hints.attach,
        parent,
        host

    shape = this._create('shape', shape)

    if (attach) {
        parent = target.parent
        host = target
    } else {
        parent = target
    }

    var displayName = ''
    var prefix = (shape.type || '').replace(/^[^:]*:/g, '')
    if (prefix == 'StartEvent') {
        displayName = '开始事件'
    } else if (prefix == 'EndEvent') {
        displayName = '结束事件'
    } else if (prefix == 'ExclusiveGateway') {
        displayName = '排他网关'
    } else if (prefix == 'ParallelGateway') {
        displayName = '并行网关'
    } else if (prefix == 'InclusiveGateway') {
        displayName = '包含网关'
    } else if (prefix == 'UserTask') {
        displayName = '用户任务'
    } else if (prefix == 'ServiceTask') {
        displayName = '服务任务'
    } else if (prefix == 'SendTask') {
        displayName = '发送任务'
    } else if (prefix == 'ReceiveTask') {
        displayName = '接收任务'
    } else if (prefix == 'ManualTask') {
        displayName = '手工任务'
    } else if (prefix == 'BusinessRuleTask') {
        displayName = '业务规则任务'
    } else if (prefix == 'ScriptTask') {
        displayName = '脚本任务'
    } else if (prefix == 'SubProcess') {
        displayName = '子流程'
    } else if (prefix == 'CallActivity') {
        displayName = '引用活动'
    } else if (prefix == 'Transaction') {
        displayName = '事件子流程'
    }
    var rootElements = parent.children
    var index = []

    for (var i = 0; i < rootElements.length; i++) {

        if (rootElements[i] && rootElements[i].type == shape.type) {
            index.push(i)
        }
    }
    var generateDisplayName = ''
    if (index && index.length > 0) {
        generateDisplayName = displayName + (index.length + 1)
    } else {
        generateDisplayName = displayName + 1
    }
    shape.businessObject.name = generateDisplayName


    var context = {
        position: position,
        shape: shape,
        parent: parent,
        parentIndex: parentIndex,
        host: host,
        hints: hints
    }


    this._commandStack.execute('shape.create', context)

    return context.shape
}
export default CustomElementFactory
