<template>
  <el-collapse-item name="element_ext_a1_sign_nodes">
    <template #title>
      <collapse-title title="会签配置">
        <lucide-icon name="ServerCrash"/>
      </collapse-title>
      <!--<number-tag-->
      <!--  :value="userPropertyList.length"-->
      <!--  margin-left="12px"/>-->
    </template>
    <div class="element_ext_a1_sign_nodes">
      <edit-item
        label="执行方式"
        textAlign="center"
        :labelWidth="90">
        <el-select
          v-model="sequential"
          clearable
          @change="changeParallel"
          placeholder="请选择">
          <el-option label="并行" value="false"/>
          <el-option label="串行" value="true"/>
        </el-select>
      </edit-item>
      <edit-item
        label="类型"
        textAlign="center"
        v-if="sequential && sequential !=''"
        :labelWidth="90">
        <el-select
          v-model="signNode.signType"
          @change="changeSignType"
          placeholder="请选择">
          <el-option
            v-for="item in signTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </edit-item>
      <edit-item
        v-if="showSignScale"
        label="比例（%）"
        textAlign="center"
        :labelWidth="90">
        <el-input
          @blur="changeSignScale"
          placeholder="请输入0~100比例值（%）"
          v-model="signNode.signScale"/>
      </edit-item>
    </div>
  </el-collapse-item>
</template>

<script>
import {updateMultiInstanceLoopCharacteristics} from '@packages/bo-utils/userTaskUtil'
import {getActive} from '@packages/bpmn-utils/BpmnDesignerUtils'
import {getExtA1SignNodes, removeExtA1SignNodes, saveExtA1SignNodes} from '@packages/bo-utils/extA1Util'
import EventEmitter from '@utils/EventEmitter'

export default {
    name: 'ElementExtA1SignNodes',
    data () {
        return {
            sequential: '',
            showSignScale: false,
            signTypeList: [
                {label: '比例通过制', value: 'scale'},
                {label: '一票否决', value: 'oneVeto'},
                {label: '一票通过', value: 'oneVetoPass'}
            ],
            signNode: {
                id: '',
                nodeId: '',
                signType: '',
                signScale: '',
                all: 'false',
                pass: 'pre',
                unPass: 'next'
            }
        }
    },
    watch: {
        'signNode.signType' (newVal, oldVal){
            if (this.signNode.signType == 'scale') {
                this.showSignScale = true
            } else {
                this.showSignScale = false
            }
        }
    },
    mounted () {
        this.reloadSignNodes()
        EventEmitter.on('element-update', this.reloadSignNodes)
    },
    methods: {
        reloadSignNodes (){
            this.sequential = ''
            let loopCharacteristics = getActive().businessObject.loopCharacteristics
            if (loopCharacteristics) {
                this.sequential = loopCharacteristics.isSequential && loopCharacteristics.isSequential == true ? 'true' : 'false'
            }
            this.signNode.id = ''
            this.signNode.signType = ''
            this.signNode.signScale = ''
            this.signNode.nodeId = getActive().id
            let signNodeList = getExtA1SignNodes((index, item)=> getActive().id == item.nodeId)
            if (signNodeList && signNodeList.length > 0) {
                let signNode = signNodeList[0]
                this.signNode.id = signNode.id
                this.signNode.signType = signNode.signType
                this.signNode.signScale = signNode.signScale
            }
        },
        changeParallel (value) {
            if (this.sequential == 'true') {
                this.signTypeList = [{label: '比例通过制', value: 'scale'}]
                this.signNode.signType = 'scale'
            } else {
                this.signTypeList = [
                    {label: '比例通过制', value: 'scale'},
                    {label: '一票否决', value: 'oneVeto'},
                    {label: '一票通过', value: 'oneVetoPass'}
                ]
                this.signNode.signType = ''
            }

            updateMultiInstanceLoopCharacteristics(getActive(), this.sequential)
            if (this.sequential == '') {
                removeExtA1SignNodes(this.signNode)
            }
            this.reloadSignNodes()
        },
        changeSignType (value) {
            if (value == 'scale') {
                this.showSignScale = true
            } else {
                this.showSignScale = false
            }

            saveExtA1SignNodes(getActive(), this.signNode)
            this.reloadSignNodes()
        },
        changeSignScale (event) {
            let value = event.target.value
            if (!value || value == '') {
                return
            }

            if (!/^[0-9]*$/.test(value)) {
                event.target.value = ''
                this.$message.error('比例只能输入大于0的数字！')
                return
            }

            if (value < 0 || value >= 100) {
                this.$message.error('比例只能输入大于0~100的数字！')
                event.target.value = ''
                return
            }

            saveExtA1SignNodes(getActive(), this.signNode)
            this.reloadSignNodes()
        }
    }
}
</script>

<style scoped>

</style>
