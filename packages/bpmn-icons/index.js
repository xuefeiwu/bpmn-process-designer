const svg = require.context('./', false, /\.svg$/)
const requireAll = (requireContext) => requireContext.keys().map(requireContext)
requireAll(svg)

export default {
    Association: 'bpmn-icon-association',
    BusinessRuleTask: 'bpmn-icon-business-rule-task',
    CallActivity: 'bpmn-icon-call-activity',
    Collaboration: 'bpmn-icon-collaboration',
    ConditionalFlow: 'bpmn-icon-conditional-flow',
    SequenceFlow: 'bpmn-icon-connection',
    DataInput: 'bpmn-icon-data-input',
    DataInputAssociation: 'bpmn-icon-data-input-output-association',
    DataOutput: 'bpmn-icon-data-output',
    DataOutputAssociation: 'bpmn-icon-data-input-output-association',
    DataObjectReference: 'bpmn-icon-data-object',
    DataStoreReference: 'bpmn-icon-data-store',
    DefaultFlow: 'bpmn-icon-default-flow',
    CancelEndEvent: 'bpmn-icon-end-event-cancel',
    CompensateEndEvent: 'bpmn-icon-end-event-compensation',
    ErrorEndEvent: 'bpmn-icon-end-event-error',
    EscalationEndEvent: 'bpmn-icon-end-event-escalation',
    LinkEndEvent: 'bpmn-icon-end-event-link',
    MessageEndEvent: 'bpmn-icon-end-event-message',
    MultipleEndEvent: 'bpmn-icon-end-event-multiple',
    EndEvent: 'bpmn-icon-end-event-none',
    SignalEndEvent: 'bpmn-icon-end-event-signal',
    TerminateEndEvent: 'bpmn-icon-end-event-terminate',
    EventSubProcess: 'bpmn-icon-event-subprocess-expanded',
    ComplexGateway: 'bpmn-icon-gateway-complex',
    EventBasedGateway: 'bpmn-icon-gateway-eventbased',
    ExclusiveGateway: 'bpmn-icon-gateway-xor',
    Gateway: 'bpmn-icon-gateway-none',
    InclusiveGateway: 'bpmn-icon-gateway-or',
    ParallelGateway: 'bpmn-icon-gateway-parallel',
    Group: 'bpmn-icon-group',
    CancelIntermediateCatchEvent: 'bpmn-icon-intermediate-event-catch-cancel',
    CompensateIntermediateCatchEvent: 'bpmn-icon-intermediate-event-catch-compensation',
    ConditionalIntermediateCatchEvent: 'bpmn-icon-intermediate-event-catch-condition',
    ErrorIntermediateCatchEvent: 'bpmn-icon-intermediate-event-catch-error',
    EscalationIntermediateCatchEvent: 'bpmn-icon-intermediate-event-catch-escalation',
    LinkIntermediateCatchEvent: 'bpmn-icon-intermediate-event-catch-link',
    MessageIntermediateCatchEvent: 'bpmn-icon-intermediate-event-catch-message',
    MultipleIntermediateCatchEvent: 'bpmn-icon-intermediate-event-catch-multiple',
    ConditionalIntermediateCatchEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-condition',
    EscalationIntermediateCatchEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-escalation',
    MessageIntermediateCatchEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-message',
    MultipleIntermediateCatchEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-multiple',
    ParallelIntermediateCatchEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-parallel',
    SignalIntermediateCatchEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-signal',
    TimerIntermediateCatchEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-timer',
    ParallelMultipleIntermediateCatchEvent: 'bpmn-icon-intermediate-event-catch-parallel-multiple',
    SignalIntermediateCatchEvent: 'bpmn-icon-intermediate-event-catch-signal',
    TimerIntermediateCatchEvent: 'bpmn-icon-intermediate-event-catch-timer',
    IntermediateThrowEvent: 'bpmn-icon-intermediate-event-none',
    CompensateIntermediateThrowEvent: 'bpmn-icon-intermediate-event-throw-compensation',
    EscalationIntermediateThrowEvent: 'bpmn-icon-intermediate-event-throw-escalation',
    LinkIntermediateThrowEvent: 'bpmn-icon-intermediate-event-throw-link',
    MessageIntermediateThrowEvent: 'bpmn-icon-intermediate-event-throw-message',
    MultipleIntermediateThrowEvent: 'bpmn-icon-intermediate-event-throw-multiple',
    SignalIntermediateThrowEvent: 'bpmn-icon-intermediate-event-throw-signal',
    Lane: 'bpmn-icon-lane',
    ManualTask: 'bpmn-icon-manual-task',
    MessageFlow: 'bpmn-icon-message-flow',
    Participant: 'bpmn-icon-participant',
    Process: 'bpmn-icon-process',
    ReceiveTask: 'bpmn-icon-receive-task',
    ScriptTask: 'bpmn-icon-script-task',
    SendTask: 'bpmn-icon-send-task',
    ServiceTask: 'bpmn-icon-service-task',
    CompensateStartEvent: 'bpmn-icon-start-event-compensation',
    ConditionalStartEvent: 'bpmn-icon-start-event-condition',
    ErrorStartEvent: 'bpmn-icon-start-event-error',
    EscalationStartEvent: 'bpmn-icon-start-event-escalation',
    MessageStartEvent: 'bpmn-icon-start-event-message',
    MultipleStartEvent: 'bpmn-icon-start-event-multiple',
    ConditionalStartEventNonInterrupting: 'bpmn-icon-start-event-non-interrupting-condition',
    EscalationStartEventNonInterrupting: 'bpmn-icon-start-event-non-interrupting-escalation',
    MessageStartEventNonInterrupting: 'bpmn-icon-start-event-non-interrupting-message',
    MultipleStartEventNonInterrupting: 'bpmn-icon-start-event-non-interrupting-multiple',
    ParallelMultipleStartEventNonInterrupting: 'bpmn-icon-start-event-non-interrupting-parallel-multiple',
    SignalStartEventNonInterrupting: 'bpmn-icon-start-event-non-interrupting-signal',
    TimerStartEventNonInterrupting: 'bpmn-icon-start-event-non-interrupting-timer',
    CancelBoundaryEvent: 'bpmn-icon-intermediate-event-catch-cancel',
    CompensateBoundaryEvent: 'bpmn-icon-intermediate-event-catch-compensation',
    ConditionalBoundaryEvent: 'bpmn-icon-intermediate-event-catch-condition',
    ErrorBoundaryEvent: 'bpmn-icon-intermediate-event-catch-error',
    EscalationBoundaryEvent: 'bpmn-icon-intermediate-event-catch-escalation',
    LinkBoundaryEvent: 'bpmn-icon-intermediate-event-catch-link',
    MessageBoundaryEvent: 'bpmn-icon-intermediate-event-catch-message',
    MultipleBoundaryEvent: 'bpmn-icon-intermediate-event-catch-multiple',
    BoundaryEvent: 'bpmn-icon-intermediate-event-none',
    ConditionalBoundaryEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-condition',
    EscalationBoundaryEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-escalation',
    MessageBoundaryEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-message',
    MultipleBoundaryEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-multiple',
    ParallelBoundaryEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-parallel',
    SignalBoundaryEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-signal',
    TimerBoundaryEventNonInterrupting: 'bpmn-icon-intermediate-event-catch-non-interrupting-timer',
    ParallelMultipleBoundaryEvent: 'bpmn-icon-intermediate-event-catch-parallel-multiple',
    SignalBoundaryEvent: 'bpmn-icon-intermediate-event-catch-signal',
    TimerBoundaryEvent: 'bpmn-icon-intermediate-event-catch-timer',
    StartEvent: 'bpmn-icon-start-event-none',
    ParallelMultipleStartEvent: 'bpmn-icon-start-event-parallel-multiple',
    SignalStartEvent: 'bpmn-icon-start-event-signal',
    TimerStartEvent: 'bpmn-icon-start-event-timer',
    CollapsedSubProcess: 'bpmn-icon-subprocess-collapsed',
    CollapsedAdHocSubProcess: 'bpmn-icon-subprocess-collapsed',
    ExpandedSubProcess: 'bpmn-icon-subprocess-expanded',
    ExpandedAdHocSubProcess: 'bpmn-icon-subprocess-expanded',
    Task: 'bpmn-icon-task-none',
    TextAnnotation: 'bpmn-icon-text-annotation',
    Transaction: 'bpmn-icon-transaction',
    UserTask: 'bpmn-icon-user-task'
}
