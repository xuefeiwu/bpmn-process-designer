import { catchError, catchWarning } from './printCatch'

export function emptyXML (key, name) {
    return `
<?xml version="1.0" encoding="utf-8"?>
<bpmn:definitions 
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
    xmlns:activiti="http://activiti.org/bpmn" x
    mlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:extA1="http://www.a1bpm.com/schema/1.0/A1" 
    id="Definitions_17m7czq" 
    targetNamespace="http://bpmn.io/schema/bpmn">
    
  <extA1:ExtProperties id="ExtProperties_1pzqvmq" />
  <extA1:Buttons id="Buttons_12pbb5b" />
  <extA1:UserRules id="UserRules_1ei2q83" />
  <extA1:UserPropertyes id="UserPropertyes_0mx5h1d" />
  <extA1:Globals id="Globals_1rkyzbr" />
  <extA1:VariableDefs id="VariableDefs_0ackb0k" />
  <extA1:Conditions id="Conditions_1r12rhe" />
  <extA1:CommonScripts id="CommonScripts_0f1qqdw" />
  <extA1:SignNodes id="SignNodes_0f1qqdw"/>
  <extA1:GlobalForms id="GlobalForms_0f1qqdw"/>
  <extA1:ExtAttributes id="ExtAttributes_0f1qqd2"/>
   
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
</bpmn:definitions>
`
}

export async function createNewDiagram (modeler, newXml, settings) {
    try {
        const timestamp = Date.now()
        const { processId, processName } = settings || {}
        const newId = processId ? processId : `Process_${timestamp}`
        const newName = processName || `业务流程_${timestamp}`
        const xmlString = newXml || emptyXML(newId, newName)
        console.log(xmlString)
        const { warnings } = await modeler.importXML(xmlString)
        if (warnings && warnings.length) {
            warnings.forEach(catchWarning)
        }
    } catch (e) {
        catchError(e)
    }
}
