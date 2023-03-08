const {is, isAny} = require('bpmnlint-utils')
const {getElementById} = require("@packages/bo-utils/extA1ElementUtils");
const {getExtA1UserProperties} = require("@packages/bo-utils/extA1Util");

module.exports = function () {
    function check(node, reporter) {
        if (!isAny(node, ['bpmn:UserTask'])) {
            return
        }
        let ele = getElementById(node.id)

        let userPropertyList = getExtA1UserProperties((index, item) => node.id == item.nodeId)
        if (!userPropertyList || userPropertyList.length == 0) {
            return;
        }

        let userProperty = userPropertyList[0]

        if (userProperty.openExpireFlag == '0') {
            return;
        }

        if (userProperty.nodePropertiesDay == '' && userProperty.nodePropertiesHour == '' && userProperty.nodePropertiesMinute == '') {
            reporter.report(node.id, 'Expiration time cannot be empty')
        }
    }

    return {check}
}
