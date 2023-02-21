import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'
import { assign } from 'min-dash'
import { createAction } from '../utils'

class RewritePaletteProvider extends PaletteProvider {
    constructor (palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate) {
        super(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate, 2000)
        this._create = create
        this._elementFactory = elementFactory
        this._lassoTool = lassoTool
        this._handTool = handTool
        this._globalConnect = globalConnect
        this._translate = translate
    }
    getPaletteEntries () {
        const actions = {},
            create = this._create,
            elementFactory = this._elementFactory,
            lassoTool = this._lassoTool,
            handTool = this._handTool,
            globalConnect = this._globalConnect,
            translate = this._translate

        function createSqlTask (event) {
            const sqlTask = elementFactory.createShape({ type: 'miyue:SqlTask' })

            create.start(event, sqlTask)
        }

        function createSubprocess (event) {
            const subProcess = elementFactory.createShape({
                type: 'bpmn:SubProcess',
                x: 0,
                y: 0,
                isExpanded: true
            })

            const startEvent = elementFactory.createShape({
                type: 'bpmn:StartEvent',
                x: 40,
                y: 82,
                parent: subProcess
            })

            create.start(event, [subProcess, startEvent], {
                hints: {
                    autoSelect: [startEvent]
                }
            })
        }

        assign(actions, {
            'hand-tool': {
                group: 'tools',
                className: 'bpmn-icon-hand-tool',
                title: translate('Activate the hand tool'),
                action: {
                    click: function (event) {
                        handTool.activateHand(event)
                    }
                }
            },
            'lasso-tool': {
                group: 'tools',
                className: 'bpmn-icon-lasso-tool',
                title: translate('Activate the lasso tool'),
                action: {
                    click: function (event) {
                        lassoTool.activateSelection(event)
                    }
                }
            },
            'global-connect-tool': {
                group: 'tools',
                className: 'bpmn-icon-connection-multi',
                title: translate('Activate the global connect tool'),
                action: {
                    click: function (event) {
                        globalConnect.toggle(event)
                    }
                }
            },
            'tool-separator': {
                group: 'tools',
                separator: true
            },
            'create.start-event': createAction(
                elementFactory,
                create,
                'bpmn:StartEvent',
                'events',
                'bpmn-icon-start-event-none',
                translate('Create StartEvent')
            ),
            'create.end-event': createAction(
                elementFactory,
                create,
                'bpmn:EndEvent',
                'events',
                'bpmn-icon-end-event-none',
                translate('Create EndEvent')
            ),
            'events-separator': {
                group: 'events',
                separator: true
            },
            'create.exclusive-gateway': createAction(
                elementFactory,
                create,
                'bpmn:ExclusiveGateway',
                'gateway',
                'bpmn-icon-gateway-xor',
                translate('Create Exclusive Gateway')
            ),
            'create.parallel-gateway': createAction(
                elementFactory,
                create,
                'bpmn:ParallelGateway',
                'gateway',
                'bpmn-icon-gateway-parallel',
                translate('Create Parallel Gateway')
            ),
            'create.inclusive-gateway': createAction(
                elementFactory,
                create,
                'bpmn:InclusiveGateway',
                'gateway',
                'bpmn-icon-gateway-or',
                translate('Create Inclusive Gateway')
            ),
            // 'create.event-base-gateway': createAction(
            //     elementFactory,
            //     create,
            //     'bpmn:EventBasedGateway',
            //     'gateway',
            //     'bpmn-icon-gateway-eventbased',
            //     '事件网关'
            // ),
            'gateway-separator': {
                group: 'gateway',
                separator: true
            },
            'create.user-task': createAction(
                elementFactory,
                create,
                'bpmn:UserTask',
                'activity',
                'bpmn-icon-user-task',
                translate('Create User Task')
            ),
            'create.script-task': createAction(
                elementFactory,
                create,
                'bpmn:ScriptTask',
                'activity',
                'bpmn-icon-script-task',
                translate('Create Script Task')
            ),
            'create.service-task': createAction(
                elementFactory,
                create,
                'bpmn:ServiceTask',
                'activity',
                'bpmn-icon-service-task',
                translate('Create Service Task')
            ),
            // 'create.sql-task': {
            //     group: 'activity',
            //     className: 'miyue-sql-task',
            //     title: '数据库任务',
            //     action: {
            //         click: createSqlTask,
            //         dragstart: createSqlTask
            //     }
            // },
            'process-separator': {
                group: 'process',
                separator: true
            },
            'create.subprocess-expanded': {
                group: 'process',
                className: 'bpmn-icon-subprocess-expanded',
                title: translate('Create Sub Process'),
                action: {
                    dragstart: createSubprocess,
                    click: createSubprocess
                }
            },
            'collaboration-separator': {
                group: 'collaboration',
                separator: true
            },
            'create.expanded-pool': createAction(
                elementFactory,
                create,
                'bpmn:Participant',
                'collaboration',
                'bpmn-icon-participant',
                translate('Create Pool/Participant')
            )
        })

        return actions
    }
}

RewritePaletteProvider.$inject = [
    'palette',
    'create',
    'elementFactory',
    'spaceTool',
    'lassoTool',
    'handTool',
    'globalConnect',
    'translate'
]

export default RewritePaletteProvider
