const {is, isAny} = require('bpmnlint-utils')
const {getElementById} = require("@packages/bo-utils/extA1ElementUtils");
const {getExtA1SignNodes} = require("@packages/bo-utils/extA1Util");

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
        let signNodeList = getExtA1SignNodes((index, item) => node.id == item.nodeId)
        if (!signNodeList || signNodeList.length == 0) {
            reporter.report(node.id, 'The countersign task is missing the countersign type')
        }
    }

    return {check}
}
