import { catchError, catchWarning } from './printCatch'

export function emptyXML (key, name) {
    return `
<?xml version="1.0" encoding="utf-8"?>
<bpmn:Definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0001" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="${key}" name="${name}" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="开始"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="292" y="212" width="36" height="36"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:Definitions>
`
}

export async function createNewDiagram (modeler, newXml, settings) {
    try {
        const timestamp = Date.now()
        const { processId, processName } = settings || {}
        const newId = processId ? processId : `Process_${timestamp}`
        const newName = processName || `业务流程_${timestamp}`
        const xmlString = newXml || emptyXML(newId, newName)
        const { warnings } = await modeler.importXML(xmlString)
        if (warnings && warnings.length) {
            warnings.forEach(catchWarning)
        }
    } catch (e) {
        catchError(e)
    }
}
