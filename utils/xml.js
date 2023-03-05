import { catchError, catchWarning } from './printCatch'

export function emptyXML (definitionsId, processId, name) {
    return `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:Definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:extA1="http://www.a1bpm.com/schema/1.0/A1" xmlns:A1Category="http://a1bpm.category/schema/bpmn/ExtCategory/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:activiti="http://activiti.org/bpmn" id="Definitions_17m7czq" targetNamespace="purchaseRequest_bpmn_1628636597530550274" A1Category:categoryId="" A1Category:title="" A1Category:modelId="1129">
  <extA1:ExtProperties id="ExtProperties_1pzqvmq">
    <extA1:PropertiesDef id="PropertiesDef_0itoeeh" subjectRule="" description="" propNotifyType="" parameterUserAssign="" propSkipRules="sameUser,emptyUser" propDateType="" dateTypeDay="" dateTypeHour="0" dateTypeMinute="0" startMethod="start" />
  </extA1:ExtProperties>
    <extA1:Buttons id="Buttons_12pbb5b">
    <extA1:Button id="Button_1aatsr8" alias="flowImage" btnName="流程图" cssName="" nodeId="UserTask_1i7h057" />
    <extA1:Button id="Button_0t6irq3" alias="agree" btnName="审批通过" cssName="" nodeId="UserTask_1i7h057" />
    <extA1:Button id="Button_0krc7i6" alias="informed" btnName="传阅" cssName="" nodeId="UserTask_1i7h057" />
    <extA1:Button id="Button_1oq8gbw" alias="transferTask" btnName="转办" cssName="" nodeId="UserTask_1i7h057" />
    <extA1:Button id="Button_0l009w2" alias="backToNode" btnName="退回" cssName="" nodeId="UserTask_1i7h057" />
    <extA1:Button id="Button_14m2ei3" alias="invalid" btnName="作废" cssName="" nodeId="UserTask_1i7h057" />
    <extA1:Button id="Button_1mdg4tk" alias="approvalHistory" btnName="审批历史" cssName="" nodeId="UserTask_1i7h057" />
    <extA1:Button id="Button_18207fw" alias="headmap" btnName="热力图" cssName="" nodeId="UserTask_1i7h057" />
    <extA1:Button id="Button_13pdoao" alias="addNode" btnName="添加临时任务" cssName="" nodeId="UserTask_1i7h057" />
    <extA1:Button id="Button_142ln1b" alias="addSignNode" btnName="添加会签" cssName="" nodeId="UserTask_1i7h057" />
    <extA1:Button id="Button_0cuh5yd" alias="transactionUrge" btnName="特事特办" cssName="" nodeId="UserTask_1i7h057" />
    <extA1:Button id="Button_1ikqv1p" alias="unPass" btnName="拒绝" cssName="" nodeId="UserTask_1i7h057" />
    <extA1:Button id="Button_0yihjj5" alias="flowImage" btnName="流程图" cssName="" nodeId="UserTask_0pmvmol" />
    <extA1:Button id="Button_1jvxwmm" alias="agree" btnName="审批通过" cssName="" nodeId="UserTask_0pmvmol" />
    <extA1:Button id="Button_1r1elzw" alias="informed" btnName="传阅" cssName="" nodeId="UserTask_0pmvmol" />
    <extA1:Button id="Button_0lzbct0" alias="transferTask" btnName="转办" cssName="" nodeId="UserTask_0pmvmol" />
    <extA1:Button id="Button_0glopeq" alias="backToNode" btnName="退回" cssName="" nodeId="UserTask_0pmvmol" />
    <extA1:Button id="Button_18tqak5" alias="invalid" btnName="作废" cssName="" nodeId="UserTask_0pmvmol" />
    <extA1:Button id="Button_0qck2uk" alias="approvalHistory" btnName="审批历史" cssName="" nodeId="UserTask_0pmvmol" />
    <extA1:Button id="Button_1i5dzll" alias="headmap" btnName="热力图" cssName="" nodeId="UserTask_0pmvmol" />
    <extA1:Button id="Button_1gnhwen" alias="addNode" btnName="添加临时任务" cssName="" nodeId="UserTask_0pmvmol" />
    <extA1:Button id="Button_1weiqez" alias="addSignNode" btnName="添加会签" cssName="" nodeId="UserTask_0pmvmol" />
    <extA1:Button id="Button_15ul6dq" alias="transactionUrge" btnName="特事特办" cssName="" nodeId="UserTask_0pmvmol" />
    <extA1:Button id="Button_1fra6oa" alias="unPass" btnName="拒绝" cssName="" nodeId="UserTask_0pmvmol" />
  </extA1:Buttons>
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
    <bpmn:documentation />
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
      <bpmn:outgoing>SequenceFlow_0x91yva</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics activiti:collection="PANGUASSIGNEES" activiti:elementVariable="PANGUELEMENTASSIGNEE" />
    </bpmn:userTask>
    <bpmn:sequenceFlow id="SequenceFlow_0cl9q2t" sourceRef="UserTask_0pmvmol" targetRef="UserTask_1i7h057" />
    <bpmn:exclusiveGateway id="ExclusiveGateway_0nizir1" name="排他网关1">
      <bpmn:incoming>SequenceFlow_0x91yva</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_10tzi4p</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_0s092w7</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="SequenceFlow_0x91yva" sourceRef="UserTask_1i7h057" targetRef="ExclusiveGateway_0nizir1" />
    <bpmn:userTask id="UserTask_0x0y0pe" name="用户任务3">
      <bpmn:incoming>SequenceFlow_10tzi4p</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1nut4dc</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="SequenceFlow_10tzi4p" sourceRef="ExclusiveGateway_0nizir1" targetRef="UserTask_0x0y0pe" />
    <bpmn:userTask id="UserTask_1rlj5dc" name="用户任务4">
      <bpmn:incoming>SequenceFlow_0s092w7</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_13q3tzq</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="SequenceFlow_0s092w7" sourceRef="ExclusiveGateway_0nizir1" targetRef="UserTask_1rlj5dc" />
    <bpmn:exclusiveGateway id="ExclusiveGateway_07ll7jd" name="排他网关2">
      <bpmn:incoming>SequenceFlow_1nut4dc</bpmn:incoming>
      <bpmn:incoming>SequenceFlow_13q3tzq</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_08t8o8r</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="SequenceFlow_1nut4dc" sourceRef="UserTask_0x0y0pe" targetRef="ExclusiveGateway_07ll7jd" />
    <bpmn:sequenceFlow id="SequenceFlow_13q3tzq" sourceRef="UserTask_1rlj5dc" targetRef="ExclusiveGateway_07ll7jd" />
    <bpmn:endEvent id="EndEvent_19c64ww" name="结束1">
      <bpmn:incoming>SequenceFlow_08t8o8r</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_08t8o8r" sourceRef="ExclusiveGateway_07ll7jd" targetRef="EndEvent_19c64ww" />
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
      <bpmndi:BPMNShape id="UserTask_1i7h057_di" bpmnElement="UserTask_1i7h057">
        <dc:Bounds x="430" y="137" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ExclusiveGateway_0nizir1_di" bpmnElement="ExclusiveGateway_0nizir1" isMarkerVisible="true">
        <dc:Bounds x="590" y="152" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="590" y="128" width="50" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="UserTask_0x0y0pe_di" bpmnElement="UserTask_0x0y0pe">
        <dc:Bounds x="700" y="137" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="UserTask_1rlj5dc_di" bpmnElement="UserTask_1rlj5dc">
        <dc:Bounds x="700" y="267" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ExclusiveGateway_07ll7jd_di" bpmnElement="ExclusiveGateway_07ll7jd" isMarkerVisible="true">
        <dc:Bounds x="860" y="152" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="860" y="128" width="50" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_19c64ww_di" bpmnElement="EndEvent_19c64ww">
        <dc:Bounds x="970" y="159" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="974" y="198" width="28" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0k8gx9h_di" bpmnElement="SequenceFlow_0k8gx9h">
        <di:waypoint x="215" y="177" />
        <di:waypoint x="270" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0cl9q2t_di" bpmnElement="SequenceFlow_0cl9q2t">
        <di:waypoint x="370" y="177" />
        <di:waypoint x="430" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0x91yva_di" bpmnElement="SequenceFlow_0x91yva">
        <di:waypoint x="530" y="177" />
        <di:waypoint x="590" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_10tzi4p_di" bpmnElement="SequenceFlow_10tzi4p">
        <di:waypoint x="640" y="177" />
        <di:waypoint x="700" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0s092w7_di" bpmnElement="SequenceFlow_0s092w7">
        <di:waypoint x="615" y="202" />
        <di:waypoint x="615" y="307" />
        <di:waypoint x="700" y="307" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1nut4dc_di" bpmnElement="SequenceFlow_1nut4dc">
        <di:waypoint x="800" y="177" />
        <di:waypoint x="860" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_13q3tzq_di" bpmnElement="SequenceFlow_13q3tzq">
        <di:waypoint x="800" y="307" />
        <di:waypoint x="885" y="307" />
        <di:waypoint x="885" y="202" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_08t8o8r_di" bpmnElement="SequenceFlow_08t8o8r">
        <di:waypoint x="910" y="177" />
        <di:waypoint x="970" y="177" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:Definitions>
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
