const {is, isAny} = require('bpmnlint-utils')
const {getElementById} = require('@packages/bo-utils/extA1ElementUtils')
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

        if (userProperty.openExpireFlag == '0' || userProperty.expireHandlerModel != '') {
            return
        }

        reporter.report(node.id, 'Expiration processing policy cannot be empty')

    }

    return {check}
}
