const {is, isAny} = require('bpmnlint-utils')
const {getExtA1UserProperties} = require('@packages/bo-utils/extA1Util')

module.exports = function () {
    function check (node, reporter) {
        if (!isAny(node, ['bpmn:UserTask'])) {
            return
        }
        let userPropertyList = getExtA1UserProperties((index, item) => node.id == item.nodeId)
        if (!userPropertyList || userPropertyList.length == 0) {
            return
        }

        let userProperty = userPropertyList[0]
        if (userProperty.backUserMode == 'normal' && userProperty.backNode == '') {
            reporter.report(node.id, 'The node rejection strategy is the specified node, and the rejection node cannot be empty')
        }
    }

    return {check}
}
