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
          v-model="eventType"
        >
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
        <el-input
          v-model="expression"
          placeholder="${myServiceTask.hello()}"
          @change="changeEventValue"
          @keydown.enter.prevent/>
      </edit-item>
      <edit-item
        v-else-if="eventType === 'delegateExpression'"
        textAlign="center"
        :labelWidth="130"
        :showTooltip="true"
        :tooltip-content="delegateExpressionTooltip"
        label="代理条件表达式"
      >
        <el-input
          v-model="delegateExpression"
          placeholder="${myServiceTask}"
          @change="changeEventValue"
          @keydown.enter.prevent/>
      </edit-item>
      <edit-item
        v-else
        textAlign="center"
        :labelWidth="130"
        :showTooltip="true"
        :tooltip-content="classTooltip"
        label="全限定类名">
        <el-input
          v-model="clazz"
          placeholder="org.flowable.service.MyServiceTask"
          @change="changeEventValue"
          @keydown.enter.prevent/>
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

export default {
    name: 'ElementServiceTask',
    components: {EditItem},
    data () {
        return {
            eventType: '',
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

            if (this.expression && this.expression != '') {
                this.eventType = 'expression'
            } else if (this.delegateExpression && this.delegateExpression != '') {
                this.eventType = 'delegateExpression'
            } else {
                this.eventType = 'class'
            }
        },
        changeEventValue () {
            updateServiceTaskProperty(getActive(), {
                ...(this.eventType === 'class' ? {class: this.clazz} : {}),
                ...(this.eventType === 'expression' ? {expression: this.expression} : {}),
                ...(this.eventType === 'delegateExpression' ? {delegateExpression: this.delegateExpression} : {})
            })
        }

    }
}
</script>
