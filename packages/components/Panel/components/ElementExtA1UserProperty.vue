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
        label="驳回策略"
        textAlign="center"
        :labelWidth="90">
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
        :labelWidth="90">
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
        :labelWidth="90">
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
        :labelWidth="90">
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
          :labelWidth="90">
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
          label="审批期限"
          textAlign="center"
          :labelWidth="90">
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
          :labelWidth="90">
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
  </el-collapse-item>
</template>

<script>
import {getAllUserTask, getExtA1UserProperties, saveExtA1UserProperties} from '@packages/bo-utils/extA1Util'
import {getActive} from '@packages/bpmn-utils/BpmnDesignerUtils'
import EventEmitter from '@utils/EventEmitter'

export default {
    name: 'ElementExtA1UserProperty',
    data (){
        return {
            selectUserTaskList: [],
            userTaskList: [],
            showBackNode: false,
            showExpire: false,
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

                if (this.userProperty.backUserMode == 'normal' && this.userProperty.backNode == '') {
                    this.$message.warning('当前驳回指定节点，未选择驳回的节点！')
                }
            }
        },
        saveExtA1UserProperty () {
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
        changeExpireSetting (event, type) {
            let value = event.target.value
            if (!value || value == '') {
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
        }
    }
}
</script>

<style scoped>
</style>
