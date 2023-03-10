<template>
  <el-collapse-item name="element_ext_a1_user_property">
    <template #title>
      <collapse-title title="节点配置">
        <lucide-icon name="Edit"/>
      </collapse-title>
      <!--<number-tag-->
      <!--  :value="userPropertyList.length"-->
      <!--  margin-left="12px"/>-->
    </template>
    <div class="element_ext_a1_user_property">
      <edit-item
        textAlign="center"
        :labelWidth="100"
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
      <edit-item
        label="驳回策略"
        textAlign="center"
        :labelWidth="100">
        <el-select
          v-model="userProperty.backUserMode"
          @change="changeBackModel"
          placeholder="请选择">
          <el-option
            v-for="item in backUserModeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </edit-item>
      <edit-item
        label="回退节点"
        v-if="showBackNode"
        textAlign="center"
        :labelWidth="100">
        <el-select
          v-model="selectUserTaskList"
          multiple
          @change="changeBackNode"
          placeholder="请选择">
          <el-option
            v-for="item in userTaskList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </edit-item>
      <edit-item
        label="处理人策略"
        textAlign="center"
        :labelWidth="100">
        <el-select
          v-model="userProperty.executor"
          @change="saveExtA1UserProperty"
          placeholder="请选择">
          <el-option
            v-for="item in executorTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </edit-item>
      <edit-item
        label="过期策略"
        textAlign="center"
        :labelWidth="100">
        <el-switch
          v-model="userProperty.openExpireFlag"
          @change="changeExpireFlag"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </edit-item>
      <template v-if="showExpire">
        <edit-item
          label="过期动作"
          textAlign="center"
          :labelWidth="100">
          <el-select
            v-model="userProperty.expireHandlerModel"
            @change="saveExtA1UserProperty"
            placeholder="请选择">
            <el-option
              v-for="item in expireHandlerModelList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </edit-item>
        <edit-item
          v-if="showNodeTransferAtaffItem"
          label="转办人员"
          textAlign="center"
          :labelWidth="100">
          <el-input
            v-model="showNodeTransferAtaff"
            readonly
          >
            <el-button
              slot="append"
              type="primary"
              icon="el-icon-edit"
              @click="transferAtaffModelVisible = true"/>
          </el-input>
        </edit-item>
        <edit-item
          label="审批期限"
          textAlign="center"
          :labelWidth="100">
          <el-switch
            v-model="userProperty.dateType"
            @change="saveExtA1UserProperty"
            inactive-text="日历日"
            inactive-value="caltime"
            active-text="工作日"
            active-value="worktime">
          </el-switch>
        </edit-item>
        <edit-item
          label="过期时间"
          textAlign="center"
          :labelWidth="100">
          <el-input
            style="width: 120px;"
            @blur="changeExpireSetting($event,'day')"
            v-model="userProperty.nodePropertiesDay">
            <template slot="append">天</template>
          </el-input>
          <el-input
            style="width: 110px;"
            @blur="changeExpireSetting($event,'hour')"
            v-model="userProperty.nodePropertiesHour">
            <template slot="append">时</template>
          </el-input>
          <el-input
            style="width: 110px;"
            @blur="changeExpireSetting($event,'minute')"
            v-model="userProperty.nodePropertiesMinute">
            <template slot="append">分</template>
          </el-input>
        </edit-item>
      </template>

    </div>
    <el-dialog
      :visible.sync="transferAtaffModelVisible"
      title="选择节点转办人员"
      width="900px"
      append-to-body
      @opened="openNodeTransferAtaffModel"
      destroy-on-close>
      <user-selector
        v-if="transferAtaffModelVisible"
        :show-name.sync="showNodeTransferAtaff"
        :init="initTransferAtaff"
        :update-show-name="updateShowTransferAtaffName"
        :multiple-choice="false"
        ref="userSelector"
        :isProcessAdmin="false"/>
      <template #footer>
        <el-button @click="transferAtaffModelVisible = false">取 消</el-button>
        <el-button
          @click="saveNodeTransferAtaffModel"
          type="primary">确 认</el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
import {getAllUserTask, getExtA1UserProperties, saveExtA1UserProperties} from '@packages/bo-utils/extA1Util'
import {getActive} from '@packages/bpmn-utils/BpmnDesignerUtils'
import EventEmitter from '@utils/EventEmitter'
import {addExtensionProperty, getExtensionProperties, removeExtensionProperty} from '@packages/bo-utils/extensionPropertiesUtil'
import UserSelector from '@packages/components/Panel/components/SubChild/UserSelector'
import CodeEditorModel from '@packages/components/common/CodeEditorModel'
import {updateSkipExpression} from '@packages/bo-utils/userTaskUtil'

export default {
    name: 'ElementExtA1UserProperty',
    components: {UserSelector, CodeEditorModel},
    data (){
        return {
            skipExpression: '',
            skipExpressionTooltip: '返回结果ture/false，例如：${execution.getVariable("skip")}',
            selectUserTaskList: [],
            userTaskList: [],
            showBackNode: false,
            showExpire: false,
            showNodeTransferAtaffItem: false,
            showNodeTransferAtaff: '',
            newProperty: {
                name: 'nodeTransferAtaff',
                value: ''
            },
            extensionsRaw: [],
            nodeTransferAtaffList: [],
            transferAtaffModelVisible: false,
            expireHandlerModelList: [
                {label: '消息提醒', value: 'taskExpirePulishMessage'},
                {label: '审批通过', value: 'taskExpireAutoComplete'},
                {label: '回退上一个节点', value: 'taskExpireAutoReject'},
                {label: '自动转办', value: 'taskExpireAutoTransfer'}
            ],
            executorTypeList: [
                {label: '执行人为空跳过', value: 'skipExecutorEmpty'},
                {label: '为空时人工处理', value: 'manualProcessing'},
                {label: '与上一个节点处理人一样时跳过', value: 'skipPreSameUser'}
            ],
            backUserModeList: [
                {label: '历史处理节点', value: 'history', leaf: true},
                {label: '实际执行路径且跳过网关', value: 'path', leaf: true},
                {label: '任意节点', value: 'random', leaf: true},
                {label: '指定节点', value: 'normal', leaf: false}
            ],
            userProperty: {
                id: '',
                nodeId: '',
                backNode: '',
                backUserMode: '',
                dateType: 'caltime',
                nodePropertiesDay: '',
                nodePropertiesHour: '',
                nodePropertiesMinute: '',
                jumpType: '',
                notifyType: '',
                postHandler: '',
                prevHand: '',
                window: '1',
                executor: '',
                choose: '',
                parallelFlag: '',
                openExpireFlag: '0',
                expireHandlerModel: ''
            }
        }
    },
    mounted () {
        this.reloadExtA1UserProperty()
        EventEmitter.on('element-update', this.reloadExtA1UserProperty)
    },
    methods: {
        reloadExtA1UserProperty (){
            let userTaskList = getAllUserTask()
            if (userTaskList && userTaskList.length > 0) {
                this.userTaskList = userTaskList.filter((item)=> getActive().id != item.id)
            }

            let userPropertyList = getExtA1UserProperties((index, item)=>getActive().id == item.nodeId)
            if (userPropertyList && userPropertyList.length > 0) {
                let {id, nodeId, backNode, backUserMode, dateType, nodePropertiesDay, nodePropertiesHour, nodePropertiesMinute, executor, choose, openExpireFlag, expireHandlerModel} = userPropertyList[0]
                this.userProperty.id = id
                this.userProperty.nodeId = nodeId
                this.userProperty.backNode = backNode
                this.userProperty.backUserMode = backUserMode
                this.userProperty.dateType = dateType
                this.userProperty.nodePropertiesDay = nodePropertiesDay
                this.userProperty.nodePropertiesHour = nodePropertiesHour
                this.userProperty.nodePropertiesMinute = nodePropertiesMinute
                this.userProperty.executor = executor
                this.userProperty.choose = choose
                this.userProperty.openExpireFlag = openExpireFlag
                this.userProperty.expireHandlerModel = expireHandlerModel

                this.showBackNode = this.userProperty.backUserMode == 'normal'
                this.showExpire = this.userProperty.openExpireFlag == '1'
                if (this.userProperty.backNode) {
                    this.selectUserTaskList = this.userProperty.backNode.split(',')
                }
            }

            this.initTransferAtaff()
        },
        saveExtA1UserProperty (value) {
            this.userProperty.nodeId = getActive().id
            saveExtA1UserProperties(getActive(), this.userProperty)
            this.reloadExtA1UserProperty()
        },
        changeBackModel (row) {
            this.showBackNode = row == 'normal'
            this.saveExtA1UserProperty()
        },
        changeBackNode (row) {
            this.userProperty.backNode = this.selectUserTaskList.join(',')
            this.saveExtA1UserProperty()
        },
        changeExpireFlag (value) {
            this.showExpire = value == '1'
            this.saveExtA1UserProperty()
        },
        removeProperty (propIndex) {
            removeExtensionProperty(getActive(), this.extensionsRaw[propIndex])
        },
        openNodeTransferAtaffModel () {
            this.$refs.userSelector.resetSelectRow()
        },
        saveNodeTransferAtaffModel () {
            this.transferAtaffModelVisible = false
            this.updateShowTransferAtaffName()
            this.extensionsRaw = getExtensionProperties(getActive())
            this.extensionsRaw
                .forEach((item, index)=>{
                    if (item.name == 'nodeTransferAtaff') {
                        this.removeProperty(index)
                    }
                })

            this.newProperty.value = JSON.stringify(this.$refs.userSelector.selectUserList)
            addExtensionProperty(getActive(), this.newProperty)
            this.initTransferAtaff()
        },
        initTransferAtaff () {
            this.showNodeTransferAtaffItem = this.userProperty.expireHandlerModel == 'taskExpireAutoTransfer'
            this.nodeTransferAtaffList = []
            this.extensionsRaw = getExtensionProperties(getActive())
            if (this.extensionsRaw && this.extensionsRaw.length > 0) {
                let extensionsRaw =  this.extensionsRaw.filter((item) => item.name == 'nodeTransferAtaff')
                this.nodeTransferAtaffList = JSON.parse(extensionsRaw[0].value)
            }

            this.updateShowTransferAtaffName()
            return this.nodeTransferAtaffList
        },
        updateShowTransferAtaffName (){
            this.showNodeTransferAtaff = this.nodeTransferAtaffList.map((item)=>item.userName).join(',')
        },
        changeExpireSetting (event, type) {
            let value = event.target.value
            if (!value || value == '') {
                this.saveExtA1UserProperty()
                return
            }

            if (!/^[0-9]*$/.test(value)) {
                event.target.value = ''
                this.$message.error('只能输入大于0的数字！')
                return
            }

            if (type == 'day') {
                if (value < 0 || value >= 1000) {
                    this.$message.error('天数只能输入大于0~1000的数字！')
                    event.target.value = ''
                    return
                }
            }
            if (type == 'hour') {
                if(value < 0 || value >= 24) {
                    this.$message.error('小时数只能输入大于0~23的数字！')
                    event.target.value = ''
                    return
                }
            }
            if (type == 'minute') {
                if(value < 0 || value >= 60) {
                    this.$message.error('分钟数只能输入大于0~59的数字！')
                    event.target.value = ''
                    return
                }
            }

            this.saveExtA1UserProperty()
        },
        saveEventScript (code) {
            this.skipExpression = code
            updateSkipExpression(getActive(), this.skipExpression)
            this.saveExtA1UserProperty()
        }
    }
}
</script>

<style scoped>
</style>
