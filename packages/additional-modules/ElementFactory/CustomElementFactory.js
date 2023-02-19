import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil'
import {isAny} from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'

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
    var  prefix = (element.$type || '').replace(/^[^:]*:/g, '')
    prefix += '_'

    if (!element.id && this._needsId(element)) {
        element.id = this._model.ids.nextPrefixed(prefix, element)
    }
}
export default CustomElementFactory
