import ReplaceMenuProvider from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider'
import {isDifferentType} from 'bpmn-js/lib/features/popup-menu/util/TypeUtil'
import {getBusinessObject, is} from 'bpmn-js/lib/util/ModelUtil'
import * as replaceOptions from './ReplaceOptions'
import {filter, isUndefined} from 'min-dash'
import {isEventSubProcess, isExpanded} from 'bpmn-js/lib/util/DiUtil'

export default class RewritePopupMenuProvider extends ReplaceMenuProvider{
    constructor (
        bpmnFactory, popupMenu, modeling, moddle,
        bpmnReplace, rules, translate) {

        super(bpmnFactory, popupMenu, modeling, moddle, bpmnReplace, rules, translate)

        this._bpmnFactory = bpmnFactory
        this._popupMenu = popupMenu
        this._modeling = modeling
        this._moddle = moddle
        this._bpmnReplace = bpmnReplace
        this._rules = rules
        this._translate = translate
    }

    _getLoopEntries (element) {

        var self = this
        var translate = this._translate

        function toggleLoopEntry (event, entry) {
            var newLoopCharacteristics = getBusinessObject(element).loopCharacteristics

            if (entry.active) {
                newLoopCharacteristics = undefined
            } else {
                if (isUndefined(entry.options.isSequential) || !newLoopCharacteristics
                    || !is(newLoopCharacteristics, entry.options.loopCharacteristics)) {
                    newLoopCharacteristics = self._moddle.create(entry.options.loopCharacteristics)
                }

                newLoopCharacteristics.isSequential = entry.options.isSequential
            }
            self._modeling.updateProperties(element, { loopCharacteristics: newLoopCharacteristics })
        }

        var businessObject = getBusinessObject(element),
            loopCharacteristics = businessObject.loopCharacteristics

        var isSequential,
            isLoop,
            isParallel

        if (loopCharacteristics) {
            isSequential = loopCharacteristics.isSequential
            isLoop = loopCharacteristics.isSequential === undefined
            isParallel = loopCharacteristics.isSequential !== undefined && !loopCharacteristics.isSequential
        }


        var loopEntries = [
            {
                id: 'toggle-parallel-mi',
                className: 'bpmn-icon-parallel-mi-marker',
                title: translate('Parallel Multi Instance'),
                active: isParallel,
                action: toggleLoopEntry,
                options: {
                    loopCharacteristics: 'bpmn:MultiInstanceLoopCharacteristics',
                    isSequential: false
                }
            },
            {
                id: 'toggle-sequential-mi',
                className: 'bpmn-icon-sequential-mi-marker',
                title: translate('Sequential Multi Instance'),
                active: isSequential,
                action: toggleLoopEntry,
                options: {
                    loopCharacteristics: 'bpmn:MultiInstanceLoopCharacteristics',
                    isSequential: true
                }
            }
        ]
        return loopEntries
    }

    getEntries (element) {
        var businessObject = element.businessObject

        var rules = this._rules

        var entries

        if (!rules.allowed('shape.replace', { element: element })) {
            return []
        }

        var differentType = isDifferentType(element)

        if (is(businessObject, 'bpmn:DataObjectReference')) {
            return this._createEntries(element, replaceOptions.DATA_OBJECT_REFERENCE)
        }

        if (is(businessObject, 'bpmn:DataStoreReference') && !is(element.parent, 'bpmn:Collaboration')) {
            return this._createEntries(element, replaceOptions.DATA_STORE_REFERENCE)
        }

        // start events outside sub processes
        if (is(businessObject, 'bpmn:StartEvent') && !is(businessObject.$parent, 'bpmn:SubProcess')) {

            entries = filter(replaceOptions.START_EVENT, differentType)

            return this._createEntries(element, entries)
        }

        // expanded/collapsed pools
        if (is(businessObject, 'bpmn:Participant')) {

            entries = filter(replaceOptions.PARTICIPANT, function (entry) {
                return isExpanded(element) !== entry.target.isExpanded
            })

            return this._createEntries(element, entries)
        }

        // start events inside event sub processes
        if (is(businessObject, 'bpmn:StartEvent') && isEventSubProcess(businessObject.$parent)) {
            entries = filter(replaceOptions.EVENT_SUB_PROCESS_START_EVENT, function (entry) {

                var target = entry.target

                var isInterrupting = target.isInterrupting !== false

                var isInterruptingEqual = getBusinessObject(element).isInterrupting === isInterrupting

                // filters elements which types and event definition are equal but have have different interrupting types
                return differentType(entry) || !differentType(entry) && !isInterruptingEqual

            })

            return this._createEntries(element, entries)
        }

        // start events inside sub processes
        if (is(businessObject, 'bpmn:StartEvent') && !isEventSubProcess(businessObject.$parent)
            && is(businessObject.$parent, 'bpmn:SubProcess')) {
            entries = filter(replaceOptions.START_EVENT_SUB_PROCESS, differentType)

            return this._createEntries(element, entries)
        }

        // end events
        if (is(businessObject, 'bpmn:EndEvent')) {

            entries = filter(replaceOptions.END_EVENT, function (entry) {
                var target = entry.target

                // hide cancel end events outside transactions
                if (target.eventDefinitionType == 'bpmn:CancelEventDefinition' && !is(businessObject.$parent, 'bpmn:Transaction')) {
                    return false
                }

                return differentType(entry)
            })

            return this._createEntries(element, entries)
        }

        // boundary events
        if (is(businessObject, 'bpmn:BoundaryEvent')) {

            entries = filter(replaceOptions.BOUNDARY_EVENT, function (entry) {

                var target = entry.target

                if (target.eventDefinitionType == 'bpmn:CancelEventDefinition' &&
                    !is(businessObject.attachedToRef, 'bpmn:Transaction')) {
                    return false
                }
                var cancelActivity = target.cancelActivity !== false

                var isCancelActivityEqual = businessObject.cancelActivity == cancelActivity

                return differentType(entry) || !differentType(entry) && !isCancelActivityEqual
            })

            return this._createEntries(element, entries)
        }

        // intermediate events
        if (is(businessObject, 'bpmn:IntermediateCatchEvent') ||
            is(businessObject, 'bpmn:IntermediateThrowEvent')) {

            entries = filter(replaceOptions.INTERMEDIATE_EVENT, differentType)

            return this._createEntries(element, entries)
        }

        // gateways
        if (is(businessObject, 'bpmn:Gateway')) {

            entries = filter(replaceOptions.GATEWAY, differentType)

            return this._createEntries(element, entries)
        }

        // transactions
        if (is(businessObject, 'bpmn:Transaction')) {

            entries = filter(replaceOptions.TRANSACTION, differentType)

            return this._createEntries(element, entries)
        }

        // expanded event sub processes
        if (isEventSubProcess(businessObject) && isExpanded(element)) {

            entries = filter(replaceOptions.EVENT_SUB_PROCESS, differentType)

            return this._createEntries(element, entries)
        }

        // expanded sub processes
        if (is(businessObject, 'bpmn:SubProcess') && isExpanded(element)) {

            entries = filter(replaceOptions.SUBPROCESS_EXPANDED, differentType)

            return this._createEntries(element, entries)
        }

        // collapsed ad hoc sub processes
        if (is(businessObject, 'bpmn:AdHocSubProcess') && !isExpanded(element)) {

            entries = filter(replaceOptions.TASK, function (entry) {

                var target = entry.target

                var isTargetSubProcess = target.type === 'bpmn:SubProcess'

                var isTargetExpanded = target.isExpanded === true

                return isDifferentType(element, target) && (!isTargetSubProcess || isTargetExpanded)
            })

            return this._createEntries(element, entries)
        }

        // sequence flows
        if (is(businessObject, 'bpmn:SequenceFlow')) {
            return this._createSequenceFlowEntries(element, replaceOptions.SEQUENCE_FLOW)
        }

        // flow nodes
        if (is(businessObject, 'bpmn:FlowNode')) {
            entries = filter(replaceOptions.TASK, differentType)

            // collapsed SubProcess can not be replaced with itself
            if (is(businessObject, 'bpmn:SubProcess') && !isExpanded(element)) {
                entries = filter(entries, function (entry) {
                    return entry.label !== 'Sub Process (collapsed)'
                })
            }

            return this._createEntries(element, entries)
        }

        return []
    }
}
