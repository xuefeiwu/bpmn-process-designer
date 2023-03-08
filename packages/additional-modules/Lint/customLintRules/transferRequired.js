const {is, isAny} = require('bpmnlint-utils')
const {getElementById} = require("@packages/bo-utils/extA1ElementUtils");
const {getExtensionProperties} = require("@packages/bo-utils/extensionPropertiesUtil");
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
        if (userProperty.expireHandlerModel != 'taskExpireAutoTransfer') {
            return;
        }

        let extensionsRaw = getExtensionProperties(ele).filter((item) => item.name == 'nodeTransferAtaff')
        if (!extensionsRaw || extensionsRaw.length == 0 ) {
            reporter.report(node.id, 'Auto transfer personnel cannot be empty')
        }

    }

    return {check}
}
