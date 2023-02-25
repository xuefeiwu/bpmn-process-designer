<template>
  <el-collapse-item name="element-ext-a1-global-request">
    <template #title>
      <collapse-title title="全局事件">
        <lucide-icon name="Crown"/>
      </collapse-title>
      <number-tag
        :value="globalRequestList.length"
        margin-left="12px"/>
    </template>
    <div class="element-ext-a1-global-request">
      <el-table
        border
        :data="globalRequestList"
        style="width: 100%"
        height="200px">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="50"/>
        <el-table-column
          label="请求地址"
          prop="url"
          width="120"
          align="center"
          show-overflow-tooltip/>
        <el-table-column
          label="执行方式"
          prop="invokeMode"
          width="80"
          align="center"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-tag
              style="margin-left: 10px"
              effect="dark"
              size="small">{{ row.invokeMode == 1 ? '异步' : '同步' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="触发时机"
          prop="callTime"
          width="180"
          header-align="center"
          align="left">
          <template slot-scope="{ row}">
            <template v-for="(item) in row.callTime.split(',')">
              <el-tag
                size="small"
                style="margin-left: 2px;">
                <span v-if="item == 'startEvent'">流程启动时</span>
                <span v-if="item == 'endEvent'">流程结束时</span>
                <span v-if="item == 'taskCreate'">任务创建时</span>
                <span v-if="item == 'taskComplete'">任务完成时</span>
              </el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="触发节点"
          prop="callNodes"
          header-align="center"
          width="180"
          align="left">
          <template slot-scope="{ row}">
            <template v-if="allUserTaskList && allUserTaskList.length > 0">
              <template v-for="(item) in row.callNodes.split(',')">
                <template v-for="(userTask) in allUserTaskList">
                  <el-tag
                    v-if="userTask.id == item"
                    size="small"
                    style="margin-left: 2px;">
                    {{ userTask.name }}
                  </el-tag>
                </template>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="描述"
          prop="desc"
          width="200"
          align="center"
          show-overflow-tooltip/>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="90">
          <template slot-scope="{ row, $index }">
            <el-button
              type="text"
              @click="openExtA1GlobalRequestModel($index,row)">编辑</el-button>
            <el-button
              type="text"
              @click="removeExtA1GlobalRequest(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button
        type="primary"
        class="inline-large-button"
        @click="openExtA1GlobalRequestModel(-1)"
        icon="el-icon-plus">添加全局事件</el-button>
    </div>

    <el-dialog
      :visible.sync="modelVisible"
      title="添加全局事件"
      width="800px"
      append-to-body
      destroy-on-close>
      <el-form
        ref="formRef"
        :model="globalRequest"
        :rules="formRules"
        class="need-filled"
        label-width="100px"
        aria-modal="true">
        <el-form-item
          label="请求地址:"
          prop="url">
          <el-input v-model="globalRequest.url"></el-input>
        </el-form-item>
        <el-form-item
          label="执行方式:"
          prop="invokeMode">
          <el-radio-group v-model="invokeMode">
            <el-radio-button :label="0">同步</el-radio-button>
            <el-radio-button :label="1">异步</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="接口请求头:"
          prop="header">
          <el-input
            v-model="globalRequest.header"
            type="textarea"
            :rows="5"/>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input
            v-model="globalRequest.desc"
            type="textarea"
            :rows="2"/>
        </el-form-item>
        <el-form-item
          label="触发时机:"
          prop="callTime">
          <el-checkbox-group
            @input="showUserTaskList"
            v-model="selectCallTimeList">
            <el-checkbox-button
              v-for="callTimeType in callTimeListType"
              :label="callTimeType.value"
              :key="callTimeType.value">{{ callTimeType.name }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="触发节点:"
          prop="callNodes">
          <el-checkbox-group
            v-if="showSelectUserTaskList"
            v-model="selectUserTaskList">
            <el-checkbox-button
              v-for="userTask in allUserTaskList"
              :label="userTask.id"
              :key="userTask.id">{{ userTask.name }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button @click="modelVisible = false">取 消</el-button>
        <el-button
          @click="saveExtA1GlobalRequest"
          type="primary">确 认</el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
import {getAllUserTask, getExtA1Globals, removeExtA1GlobalRequest, saveExtA1Globals} from '@packages/bo-utils/ExtA1Util'
import {getActive} from '@packages/bpmn-utils/BpmnDesignerUtils'

export default {
    name: 'ElementExtA1GlobalRequest',
    data () {
        let checkCallTime = (rule, value, callback) => {
            if (this.selectCallTimeList && this.selectCallTimeList.length > 0 ) {
                return callback()
            }
            return callback(new Error('触发时机不能为空'))
        }
        let checkCallNodes = (rule, value, callback) => {
            if (this.selectCallTimeList.indexOf('taskCreate') != -1 && this.selectCallTimeList.indexOf('taskCreate') != -1) {
                if (this.selectUserTaskList && this.selectUserTaskList.length > 0) {
                    return callback()
                }
                return callback(new Error('触发节点不能为空'))
            }
            return callback()
        }
        return {
            modelVisible: false,
            showSelectUserTaskList: false,
            globalRequestList: [],
            invokeMode: '0',
            globalRequest: {
                id: '',
                url: '',
                invokeMode: '',
                desc: '',
                header: '',
                callTime: '',
                callNodes: '',
                scope: '',
                nodeId: ''
            },
            selectCallTimeList: [],
            selectUserTaskList: [],
            allUserTaskList: [],
            callTimeListType: [
                {name: '流程启动时', value: 'startEvent'},
                {name: '流程结束时', value: 'endEvent'},
                {name: '任务创建时', value: 'taskCreate'},
                {name: '任务完成时', value: 'taskComplete'}
            ],
            formRules: {
                url: {required: true, trigger: ['blur', 'change'], message: '请求地址不能为空'},
                callTime: {required: true, trigger: ['blur', 'change'], validator: checkCallTime},
                callNodes: {required: true, trigger: ['blur', 'change'], validator: checkCallNodes}
            }
        }
    },
    mounted () {
        this.reloadExtA1GlobalRequest()
    },
    methods: {
        removeExtA1GlobalRequest (row) {
            removeExtA1GlobalRequest(row)
            this.reloadExtA1GlobalRequest()
        },
        async saveExtA1GlobalRequest () {
            await this.$refs.formRef.validate()
            // scope: 0-局部，1-全局
            this.globalRequest.scope = '1'
            // 请求执行方式
            this.globalRequest.invokeMode = this.invokeMode
            // 触发时机
            this.globalRequest.callTime = ''
            if (this.selectCallTimeList && this.selectCallTimeList.length > 0) {
                this.globalRequest.callTime = this.selectCallTimeList.join(',')
            }
            // 触发节点
            this.globalRequest.callNodes = ''
            if (this.selectUserTaskList && this.selectUserTaskList.length > 0) {
                this.globalRequest.callNodes = this.selectUserTaskList.join(',')
            }

            saveExtA1Globals(getActive(), this.globalRequest)
            this.reloadExtA1GlobalRequest()
        },
        async openExtA1GlobalRequestModel (index, extA1GlobalRequestData) {
            this.activeIndex = index
            this.globalRequest = {}
            extA1GlobalRequestData && (this.globalRequest = extA1GlobalRequestData)
            this.allUserTaskList = getAllUserTask()
            // 初始化请求执行方式
            this.invokeMode = this.globalRequest.invokeMode
            if(!this.invokeMode) {
                this.invokeMode = '0'
            }
            // 触发时机
            this.selectCallTimeList = []
            if (this.globalRequest.callTime) {
                this.selectCallTimeList = this.globalRequest.callTime.split(',')
            }
            // 触发节点
            this.selectUserTaskList = []
            if (this.globalRequest.callNodes) {
                this.selectUserTaskList = this.globalRequest.callNodes.split(',')
            }

            this.modelVisible = true
            this.showUserTaskList(this.selectCallTimeList)
            await this.$nextTick()
            this.$refs.formRef && this.$refs.formRef.clearValidate()
        },
        showUserTaskList (value) {
            this.showSelectUserTaskList = (value.indexOf('taskCreate') != -1  || value.indexOf('taskComplete') != -1)
                && this.allUserTaskList
                && this.allUserTaskList.length > 0
        },
        reloadExtA1GlobalRequest () {
            this.modelVisible = false
            this.showSelectUserTaskList = false
            this.globalRequestList = []
            const globalRequestList = getExtA1Globals((index, item)=>item.scope == '1')
            if (globalRequestList) {
                this.globalRequestList = globalRequestList.map((item)=>({
                    id: item.id,
                    callNodes: item.callNodes,
                    callTime: item.callTime,
                    desc: item.desc,
                    header: item.header,
                    invokeMode: item.invokeMode,
                    scope: item.scope,
                    url: item.url,
                    nodeId: item.nodeId
                }))
            }

            console.log(this.globalRequestList)
            this.allUserTaskList = getAllUserTask()
        }
    }
}
</script>
