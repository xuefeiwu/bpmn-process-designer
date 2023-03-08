const {is, isAny} = require('bpmnlint-utils')
const {getElementById} = require("@packages/bo-utils/extA1ElementUtils");

module.exports = function () {
    function check(node, reporter) {
        if (!isAny(node, ['bpmn:UserTask'])) {
            return
        }
        let ele = getElementById(node.id)
        let loopCharacteristics = ele.businessObject.loopCharacteristics
        if (!loopCharacteristics) {
            return
        }

        let sequential = loopCharacteristics.isSequential && loopCharacteristics.isSequential == true ? 'true' : 'false'
        console.log(sequential)
        // if (!hasStartEvent(node)) {
        //     const type = is(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process'
        //
        //     reporter.report(node.id, type + ' is missing task node')
        // }
    }

    return {check}
}
