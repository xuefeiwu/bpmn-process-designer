<template>
  <el-collapse-item name="element-service-task">
    <template #title>
      <collapse-title title="服务配置">
        <lucide-icon name="Radio"/>
      </collapse-title>
    </template>
    <div class="element-service-task">
      <edit-item
        textAlign="center"
        :labelWidth="130"
        label="事件类型">
        <el-select
          v-model="eventType">
          <el-option
            v-for="{ label, value } in eventTypeOptions"
            :label="label"
            :value="value"
            :key="value"/>
        </el-select>
      </edit-item>
      <edit-item
        v-if="eventType === 'expression'"
        textAlign="center"
        :labelWidth="130"
        :showTooltip="true"
        :tooltip-content="expressionTooltip"
        label="条件表达式"
      >
        <code-editor-model
          title="条件表达式"
          code-language="Java"
          :code-string="expression"
          placeholder="${myServiceTask.hello()}"
          :readOnly="false"
          @handleSureClick="changeEventValue($event)"
        />
      </edit-item>
      <edit-item
        v-else-if="eventType === 'delegateExpression'"
        textAlign="center"
        :labelWidth="130"
        :showTooltip="true"
        :tooltip-content="delegateExpressionTooltip"
        label="代理条件表达式"
      >
        <code-editor-model
          title="代理条件表达式"
          code-language="Java"
          placeholder="${myServiceTask}"
          :code-string="delegateExpression"
          :readOnly="false"
          @handleSureClick="changeEventValue($event)"
        />
      </edit-item>
      <edit-item
        v-else
        textAlign="center"
        :labelWidth="130"
        :showTooltip="true"
        :tooltip-content="classTooltip"
        label="全限定类名">
        <code-editor-model
          title="条件表达式"
          code-language="Java"
          placeholder="org.flowable.service.MyServiceTask"
          :code-string="clazz"
          :readOnly="false"
          @handleSureClick="changeEventValue($event)"
        />
      </edit-item>

      <edit-item
        textAlign="center"
        :labelWidth="130"
        :showTooltip="true"
        :tooltip-content="skipExpressionTooltip"
        label="跳过表达式">
        <code-editor-model
          title="跳过表达式"
          code-language="Java"
          :code-string="skipExpression"
          :readOnly="false"
          @handleSureClick="saveEventScript($event)"
        />
      </edit-item>
    </div>
  </el-collapse-item>
</template>

<script>
import {listenerTypeOptions} from '@packages/preset-configuration/enumsOption'
import EventEmitter from '@utils/EventEmitter'
import EditItem from '@packages/components/common/EditItem'
import {getActive} from '@packages/bpmn-utils/BpmnDesignerUtils'
import {updateServiceTaskProperty} from '@packages/bo-utils/serviceTaskUtil'
import CodeEditorModel from '@packages/components/common/CodeEditorModel'

export default {
    name: 'ElementServiceTask',
    components: {EditItem, CodeEditorModel},
    data () {
        return {
            eventType: '',
            skipExpression: '',
            skipExpressionTooltip: '返回结果ture/false，例如：${execution.getVariable("skip")}',
            clazz: '',
            classTooltip: '' +
                'public class MyServiceTask implements JavaDelegate {\n' +
                '    @Override\n' +
                '    public void execute(DelegateExecution execution) {\n' +
                '    }\n' +
                '}\n',
            expression: '',
            expressionTooltip: '@Component\n' +
                'public class MyServiceTask2 {\n' +
                '    public void hello() {\n' +
                '    }\n' +
                '}\n',
            delegateExpression: '',
            delegateExpressionTooltip: '' +
                '@Component\n' +
                'public class MyServiceTask implements JavaDelegate {\n' +
                '    @Override\n' +
                '    public void execute(DelegateExecution execution) {\n' +
                '    }\n' +
                '}\n',
            eventTypeOptions: listenerTypeOptions
        }
    },

    mounted () {
        this.reloadServiceTask()
        EventEmitter.on('element-update', this.reloadServiceTask)
    },
    methods: {
        reloadServiceTask () {
            let ele = getActive().businessObject
            this.clazz = ele.class
            this.expression = ele.expression
            this.delegateExpression = ele.delegateExpression
            this.skipExpression = ele.skipExpression

            if (this.expression && this.expression != '') {
                this.eventType = 'expression'
            } else if (this.delegateExpression && this.delegateExpression != '') {
                this.eventType = 'delegateExpression'
            } else {
                this.eventType = 'class'
            }
        },
        changeEventValue (code) {
            if (this.eventType === 'class') {
                this.clazz = code
            } else if (this.eventType === 'expression') {
                this.expression = code
            } else if (this.eventType === 'delegateExpression') {
                this.delegateExpression = code
            }
            updateServiceTaskProperty(getActive(), {
                skipExpression: this.skipExpression,
                ...(this.eventType === 'class' ? {class: this.clazz} : {}),
                ...(this.eventType === 'expression' ? {expression: this.expression} : {}),
                ...(this.eventType === 'delegateExpression' ? {delegateExpression: this.delegateExpression} : {})
            })
            this.reloadServiceTask()
        },
        saveEventScript (code) {
            this.skipExpression = code
            updateServiceTaskProperty(getActive(), {
                skipExpression: this.skipExpression,
                ...(this.eventType === 'class' ? {class: this.clazz} : {}),
                ...(this.eventType === 'expression' ? {expression: this.expression} : {}),
                ...(this.eventType === 'delegateExpression' ? {delegateExpression: this.delegateExpression} : {})
            })
            this.reloadServiceTask()
        }
    }
}
</script>
