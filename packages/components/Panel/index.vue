<template>
  <div
    class="bpmn-panel"
    ref="panel">
    <div class="panel-header">
      <bpmn-icon :name="bpmnIconName"/>
      <p>{{ bpmnElementName }}</p>
      <p>{{ customTranslate(currentElementType || "Process") }}</p>
    </div>
    <el-tabs v-model="tagActiveName" type="card">
      <el-tab-pane label="基本信息" name="global" >
        <el-collapse v-model="activeGlobalNames" :style="{height:clientHeight}">
          <component
            v-for="cp in this.renderGlobalComponents"
            :key="cp.name"
            :is="cp"/>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="节点信息" name="node">
        <el-collapse v-model="activeNodeNames" :style="{height:clientHeight}">
          <component
            v-for="cp in this.renderNodeComponents"
            :key="cp.name"
            :is="cp"/>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {debounce} from 'min-dash'
import Logger from '@utils/Logger'
import {catchError} from '@utils/printCatch'
import EventEmitter from '@utils/EventEmitter'
import BpmnIcon from '@packages/components/common/BpmnIcon'
import bpmnIcons from '@packages/bpmn-icons'
import getBpmnIconType from '@packages/bpmn-icons/getIconType'
import {customTranslate} from '@packages/additional-modules/Translate'
import {isCanbeConditional, isConditionalSource} from '@packages/bo-utils/conditionUtil'
import {isJobExecutable} from '@packages/bo-utils/jobExecutionUtil'
import {isExecutable} from '@packages/bo-utils/executionListenersUtil'
import {isAsynchronous} from '@packages/bo-utils/asynchronousContinuationsUtil'
import {isStartInitializable} from '@packages/bo-utils/initiatorUtil'
import {getModeler} from '@packages/bpmn-utils/BpmnDesignerUtils'
import ElementGenerations from '@packages/components/Panel/components/ElementGenerations'
import ElementConditional from '@packages/components/Panel/components/ElementConditional'
import ElementJobExecution from '@packages/components/Panel/components/ElementJobExecution'
import ElementExtensionProperties from '@packages/components/Panel/components/ElementExtensionProperties'
import ElementExecutionListeners from '@packages/components/Panel/components/ElementExecutionListeners'
import ElementAsyncContinuations from '@packages/components/Panel/components/ElementAsyncContinuations'
import ElementStartInitiator from '@packages/components/Panel/components/ElementStartInitiator'
import ElementGlobalProperties from '@packages/components/Panel/components/ElementExtA1GlobalProperties'
import ElementExtA1GlobalRequest from '@packages/components/Panel/components/ElementExtA1GlobalRequest'
import ElementExtA1NodeRequest from '@packages/components/Panel/components/ElementExtA1NodeRequest'
import {isServiceTask, isUserTask} from '@packages/bo-utils/extA1Util'
import ElementExtA1Attributes from '@packages/components/Panel/components/ElementExtA1Attributes'
import ElementExtA1UserProperty from '@packages/components/Panel/components/ElementExtA1UserProperty'
import ElementExtA1SignNodes from '@packages/components/Panel/components/ElementExtA1SignNodes'
import ElementExtA1Condition from '@packages/components/Panel/components/ElementExtA1Condition'
import ElementExtA1EventScript from '@packages/components/Panel/components/ElementExtA1EventScript'
import ElementExtA1Button from '@packages/components/Panel/components/ElementExtA1Button'
import ElementExtA1UserRule from '@packages/components/Panel/components/ElementExtA1UserRule'
import ElementServiceTask from '@packages/components/Panel/components/ElementServiceTask'

export default {
    name: 'BpmnPanel',
    components: {
        BpmnIcon,
        ElementGenerations,
        ElementExtA1Button,
        ElementExtA1GlobalRequest,
        ElementExtA1Attributes,
        ElementExtA1UserRule,
        ElementExtA1Condition,
        ElementConditional,
        ElementJobExecution,
        ElementExtensionProperties,
        ElementExecutionListeners,
        ElementExtA1UserProperty,
        ElementExtA1EventScript,
        ElementExtA1SignNodes,
        ElementAsyncContinuations,
        ElementExtA1NodeRequest,
        ElementServiceTask,
        ElementStartInitiator
    },
    computed: {
        // 滚动区高度
        // (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)
        clientHeight: function () {
            return (document.body.clientWidth) + 'px'
        }
    },
    data () {
        return {
            bpmnElementName: 'Process',
            bpmnIconName: 'Process',
            currentElementType: undefined,
            currentElementId: undefined,
            customTranslate,
            renderGlobalComponents: [],
            renderNodeComponents: [],
            tagActiveName: 'global',
            activeGlobalNames: 'base-info',
            activeNodeNames: ''
        }
    },
    created () {
        EventEmitter.on('modeler-init', (modeler) => {
            // 导入完成后默认选中 process 节点
            modeler.on('import.done', () => {
                this.setCurrentElement(null)
            })
            // 监听选择事件，修改当前激活的元素以及表单
            modeler.on('selection.changed', ({newSelection}) => {
                this.setCurrentElement(newSelection[0] || null)
            })
            modeler.on('element.changed', ({element}) => {
                // 保证 修改 "默认流转路径" 等类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
                if (element && element.id === this.currentElementId) {
                    this.setCurrentElement(element)
                }
            })
        })
    },
    mounted () {
        !this.currentElementId && this.setCurrentElement()
    },
    methods: {
        //
        setCurrentElement: debounce(function (element) {
            let activatedElement = element,
                activatedElementTypeName = ''
            if (!activatedElement) {
                const modeler = getModeler()
                if (!modeler) {
                    return
                }

                activatedElement =
                    modeler.get('elementRegistry')?.find((el) => el.type === 'bpmn:Process') ||
                    modeler.get('elementRegistry')?.find((el) => el.type === 'bpmn:Collaboration')

                if (!activatedElement) {
                    return catchError('No Element found!')
                }
            }
            activatedElementTypeName = getBpmnIconType(activatedElement)

            this.$store.commit('setElement', {element: activatedElement, id: activatedElement.id})
            this.currentElementId = activatedElement.id
            this.currentElementType = activatedElement.type.split(':')[1]

            this.bpmnIconName = bpmnIcons[activatedElementTypeName]
            this.bpmnElementName = activatedElementTypeName

            this.setCurrentComponents(activatedElement)
            EventEmitter.emit('element-update', activatedElement)

            Logger.prettyPrimary('Selected element changed', `ID: ${activatedElement.id} , type: ${activatedElement.type}`)
            Logger.prettyInfo('Selected element businessObject', activatedElement.businessObject)
        }, 100),
        //
        setCurrentComponents (element) {
            this.renderGlobalComponents.splice(0, this.renderGlobalComponents.length) // 清空
            this.renderNodeComponents.splice(0, this.renderNodeComponents.length) // 清空
            // 重设
            this.renderGlobalComponents.push(ElementGenerations)

            // 添加自定义配置
            this.renderGlobalComponents.push(ElementGlobalProperties)
            this.renderGlobalComponents.push(ElementExtA1GlobalRequest)
            this.renderGlobalComponents.push(ElementExtA1Button)
            isExecutable(element) && this.renderGlobalComponents.push(ElementExecutionListeners)

            if (isUserTask(element) || isServiceTask(element)) {
                this.renderNodeComponents.push(ElementExtA1UserRule)
            }

            isUserTask(element) && this.renderNodeComponents.push(ElementExtA1UserProperty)
            isUserTask(element) && this.renderNodeComponents.push(ElementExtA1SignNodes)
            isUserTask(element) && this.renderNodeComponents.push(ElementExtA1EventScript)
            isServiceTask(element) && this.renderNodeComponents.push(ElementServiceTask)
            if (isUserTask(element) || isConditionalSource(element)) {
                this.renderNodeComponents.push(ElementExtA1Condition)
            }

            isUserTask(element) && this.renderNodeComponents.push(ElementExtA1NodeRequest)
            isUserTask(element) && this.renderNodeComponents.push(ElementExtA1Attributes)

            // isCanbeConditional(element) && this.renderComponents.push(ElementConditional)
            // isJobExecutable(element) && this.renderComponents.push(ElementJobExecution)
            // this.renderComponents.push(ElementExtensionProperties)
            // isExecutable(element) && this.renderGlobalComponents.push(ElementExecutionListeners)
            // isAsynchronous(element) && this.renderComponents.push(ElementAsyncContinuations)
            // isStartInitializable(element) && this.renderComponents.push(ElementStartInitiator)

        }
    }
}
</script>
