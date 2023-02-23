import { catchError, catchWarning } from './printCatch'

export function emptyXML (definitionsId, processId, name) {
    return `
<?xml version="1.0" encoding="utf-8"?>
<bpmn:definitions 
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
    xmlns:activiti="http://activiti.org/bpmn" x
    mlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:extA1="http://www.a1bpm.com/schema/1.0/A1" 
    id="${definitionsId}" 
    targetNamespace="http://bpmn.io/schema/bpmn">
   
  <bpmn:process id="${processId}" name="${name}" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="开始"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="292" y="212" width="36" height="36"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`
}

export async function createNewDiagram (modeler, newXml, settings) {
    try {
        const timestamp = Date.now()
        const { processId, processName } = settings || {}
        const definitionsId = `Definitions_${timestamp}`
        const newProcessIdId = processId ? processId : `Process_${timestamp}`
        const newName = processName || `业务流程_${timestamp}`
        const xmlString = newXml || emptyXML(definitionsId, newProcessIdId, newName)

        const { warnings } = await modeler.importXML(xmlString)
        if (warnings && warnings.length) {
            warnings.forEach(catchWarning)
        }
    } catch (e) {
        catchError(e)
    }
}
