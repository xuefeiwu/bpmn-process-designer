import { catchError, catchWarning } from './printCatch'

export function emptyXML (definitionsId, processId, name) {
    return `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:activiti="http://activiti.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:extA1="http://www.a1bpm.com/schema/1.0/A1" xmlns:A1Category="http://a1bpm.category/schema/bpmn/ExtCategory/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_17m7czq" targetNamespace="purchaseRequest_bpmn_1628636597530550274" A1Category:categoryId="" A1Category:title="" A1Category:modelId="1129">
  <extA1:ExtProperties id="ExtProperties_1pzqvmq">
    <extA1:PropertiesDef id="PropertiesDef_0itoeeh" subjectRule="" description="" propNotifyType="" parameterUserAssign="" propSkipRules="sameUser,emptyUser" propDateType="" dateTypeDay="" dateTypeHour="0" dateTypeMinute="0" startMethod="start" />
  </extA1:ExtProperties>
  <extA1:Buttons id="Buttons_12pbb5b" />
  <extA1:UserRules id="UserRules_1ei2q83">
    <extA1:UserRule id="UserRule_0h8g9xc" nodeId="UserTask_0pmvmol" pluginType="users" pluginVal="" logicCal="" ruleId="currentUser" ruleVal="" ruleDisplayName="[当前登录用户]" />
    <extA1:UserRule id="UserRule_187lo6e" nodeId="UserTask_1i7h057" pluginType="users" pluginVal="" logicCal="" ruleId="currentUser" ruleVal="" ruleDisplayName="[当前登录用户]" specId="" />
  </extA1:UserRules>
  <extA1:UserPropertyes id="UserPropertyes_0mx5h1d">
    <extA1:UserProperty id="UserProperty_0j2lz6p" nodeId="UserTask_0pmvmol" backNode="-1" backUserMode="history" dateType="worktime" jumpType="jumpType_common" nodePropertiesDay="-1" notifyType="-1" postHandler="-1" prevHand="-1" nodePropertiesHour="-1" nodePropertiesMinute="1" window="1" executor="none" choose="0" parallelFlag="false" openExpireFlag="0" expireHandlerModel="taskExpireAutoTransfer" />
    <extA1:UserProperty id="UserProperty_0r3d7v9" nodeId="UserTask_1i7h057" backNode="-1" backUserMode="none" dateType="worktime" jumpType="jumpType_common" nodePropertiesDay="-1" notifyType="-1" postHandler="-1" prevHand="-1" nodePropertiesHour="-1" nodePropertiesMinute="1" window="1" executor="skipExecutorEmpty" choose="0" parallelFlag="false" openExpireFlag="1" expireHandlerModel="taskExpireAutoTransfer" />
  </extA1:UserPropertyes>
  <extA1:Globals id="Globals_1rkyzbr">
    <extA1:Global id="Global_0lj02va" url="454545" desc="4545" header="4545454" invokeMode="1" callTime="" nodeId="UserTask_0pmvmol" callNodes="" scope="0" callNode="UserTask_0pmvmol" />
  </extA1:Globals>
  <extA1:VariableDefs id="VariableDefs_0ackb0k" />
  <extA1:Conditions id="Conditions_1r12rhe" />
  <extA1:CommonScripts id="CommonScripts_0f1qqdw" />
  <extA1:SignNodes id="SignNodes_0f1qqdw">
    <extA1:SignNode id="SignNode_1k0zxit" nodeId="UserTask_1i7h057" signType="scale" signScale="60" all="false" pass="pre" unPass="next" />
  </extA1:SignNodes>
  <extA1:GlobalForms id="GlobalForms_0f1qqdw" />
  <extA1:ExtAttributes id="ExtAttributes_0f1qqd2">
    <extA1:ExtAttribute id="ExtAttribute_0q6yybl" name="www" nodeId="UserTask_0pmvmol" val="ee" flag="rrr" />
  </extA1:ExtAttributes>
  <bpmn:process id="purchaseRequest_bpmn_1628636597530550274" name="采购申请" isExecutable="true">
    <bpmn:documentation></bpmn:documentation>
    <bpmn:startEvent id="StartEvent_1" name="开始" activiti:initiator="startUser">
      <bpmn:outgoing>SequenceFlow_0k8gx9h</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:userTask id="UserTask_0pmvmol" name="用户任务1">
      <bpmn:incoming>SequenceFlow_0k8gx9h</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0cl9q2t</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="SequenceFlow_0k8gx9h" sourceRef="StartEvent_1" targetRef="UserTask_0pmvmol" />
    <bpmn:userTask id="UserTask_1i7h057" name="自动转办">
      <bpmn:incoming>SequenceFlow_0cl9q2t</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1vghe6s</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics activiti:collection="PANGUASSIGNEES" activiti:elementVariable="PANGUELEMENTASSIGNEE" />
    </bpmn:userTask>
    <bpmn:sequenceFlow id="SequenceFlow_0cl9q2t" sourceRef="UserTask_0pmvmol" targetRef="UserTask_1i7h057" />
    <bpmn:endEvent id="EndEvent_1w606k9" name="结束1">
      <bpmn:incoming>SequenceFlow_1vghe6s</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1vghe6s" sourceRef="UserTask_1i7h057" targetRef="EndEvent_1w606k9" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="purchaseRequest_bpmn_1628636597530550274">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="159" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="186" y="195" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="UserTask_0pmvmol_di" bpmnElement="UserTask_0pmvmol">
        <dc:Bounds x="270" y="137" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0k8gx9h_di" bpmnElement="SequenceFlow_0k8gx9h">
        <di:waypoint x="215" y="177" />
        <di:waypoint x="270" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="UserTask_1i7h057_di" bpmnElement="UserTask_1i7h057">
        <dc:Bounds x="430" y="137" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0cl9q2t_di" bpmnElement="SequenceFlow_0cl9q2t">
        <di:waypoint x="370" y="177" />
        <di:waypoint x="430" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_1w606k9_di" bpmnElement="EndEvent_1w606k9">
        <dc:Bounds x="592" y="159" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="596" y="198" width="28" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1vghe6s_di" bpmnElement="SequenceFlow_1vghe6s">
        <di:waypoint x="530" y="177" />
        <di:waypoint x="592" y="177" />
      </bpmndi:BPMNEdge>
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
