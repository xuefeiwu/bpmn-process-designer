const {is, isAny} = require('bpmnlint-utils')
const {getElementById} = require('@packages/bo-utils/extA1ElementUtils')
const {getExtA1SignNodes, getExtA1UserRules} = require('@packages/bo-utils/extA1Util')

module.exports = function () {
    function check (node, reporter) {
        if (!isAny(node, ['bpmn:UserTask'])) {
            return
        }
        let ele = getElementById(node.id)
        let loopCharacteristics = ele.businessObject.loopCharacteristics
        if (!loopCharacteristics) {
            return
        }
        let userRuleList = getExtA1UserRules((index, item) => node.id == item.nodeId)
        if (!userRuleList || userRuleList.length == 0) {
            reporter.report(node.id, 'Countersignature node lacks node staffing')
        }
    }

    return {check}
}
