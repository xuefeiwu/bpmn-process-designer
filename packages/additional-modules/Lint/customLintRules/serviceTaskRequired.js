const { is, isAny } = require('bpmnlint-utils')
const {getElementById} = require('@packages/bo-utils/extA1ElementUtils')
const {getExtA1UserRules} = require('@packages/bo-utils/extA1Util')

module.exports = function () {
    function check (node, reporter) {
        if (!isAny(node, ['bpmn:ServiceTask'])) {
            return
        }

        let element = getElementById(node.id).businessObject
        if (element.class && (element.class == '' || element.class.indexOf(' ') != -1)) {
            reporter.report(node.id, 'Fully qualified class name cannot be empty')
        } else if (element.expression && (element.expression == '' || element.expression.indexOf(' ') != -1)) {
            reporter.report(node.id, 'Expression cannot be empty')
        } else if (element.delegateExpression) {
            if (element.delegateExpression == '' || element.delegateExpression.indexOf(' ') != -1) {
                reporter.report(node.id, 'Delegate expression cannot be empty')
            } else if (element.delegateExpression == '#{customServiceTask}') {
                // 自动传阅
                let userRuleList = getExtA1UserRules((index, item) => item.nodeId == node.id)
                if (!userRuleList || userRuleList.length == 0) {
                    reporter.report(node.id, 'Circulation node miss node personnel')
                }
            }
        }
    }

    return { check }
}
