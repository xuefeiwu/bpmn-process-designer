const {is, isAny} = require('bpmnlint-utils')

module.exports = function () {
    function check (node, reporter) {
        if (!isAny(node, ['bpmn:Task', 'bpmn:Gateway'])) {
            return
        }

        const incoming = node.incoming || []
        if (!incoming || incoming.length == 0) {
            reporter.report(node.id, 'Node is missing incoming Sequence')
        }
    }

    return {check}
}
