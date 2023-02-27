<template>
  <el-collapse-item
    name="global-info">
    <template #title>
      <collapse-title title="属性配置">
        <lucide-icon name="FolderEdit"/>
      </collapse-title>
    </template>

    <edit-item
      label="跳过第一个任务"
      textAlign="center"
      :labelWidth="120">
      <el-switch
        v-model="properties.parameterUserAssign"
        active-value="prop_skipFirstNode"
        @change="updateSkipFirstNode"
      >
      </el-switch>
    </edit-item>
    <edit-item
      label="任务跳过策略"
      textAlign="center"
      :labelWidth="120">
      <el-select
        v-model="propSkipRulesValue"
        multiple
        placeholder="请选择"
        @change="updateSkipRules"
      >
        <el-option
          v-for="item in propSkipRulesOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </edit-item>
    <edit-item
      label="流程标题"
      textAlign="center"
      :labelWidth="120">
      <el-input
        v-model="properties.subjectRule"
        @change="updateSubjectRule"
      />
    </edit-item>
    <edit-item
      label="流程管理员"
      textAlign="center"
      :labelWidth="120">
      <el-input
        v-model="showProcessAdminName"
        disabled
      >
        <el-button
          slot="append"
          type="primary"
          icon="el-icon-edit"
          @click="modelVisible = true"/>
      </el-input>
    </edit-item>

    <el-dialog
      :visible.sync="modelVisible"
      title="选择流程管理员"
      width="900px"
      append-to-body
      @opened="openProcessAdminModel"
      destroy-on-close>
      <el-row :gutter="20">
        <el-col :span="21">
          <el-table
            ref="adminUserListTable"
            border
            :data="adminUserList"
            @selection-change="changeSelection"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="fullName"
              label="姓名"
              align="center"
              show-overflow-tooltip
              width="180">
            </el-table-column>
            <el-table-column
              prop="userNo"
              label="账号"
              align="center"
              show-overflow-tooltip
              width="180">
            </el-table-column>
            <el-table-column
              prop="email"
              align="center"
              label="邮箱"
              show-overflow-tooltip
              width="180">
            </el-table-column>
            <el-table-column
              prop="photo"
              align="center"
              label="手机号"
              show-overflow-tooltip
              width="180">
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :total="5"
            :page-sizes="[10, 20, 30, 40]"
            layout="prev, pager, next">
          </el-pagination>
        </el-col>
        <el-col :span="3">
          <el-tag
            v-for="(item) in processAdminList"
            :key="item.userId"
            closable
            @close="closeSelection(item)"
            style="margin-left: 10px;margin-top: 10px">
            {{ item.userName }}
          </el-tag>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="modelVisible = false">取 消</el-button>
        <el-button
          @click="saveProcessAdminModel"
          type="primary">确 认</el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
import EditItem from '@packages/components/common/EditItem'
import {getExtA1Properties, saveExtA1Properties} from '@packages/bo-utils/ExtA1Util'
import {getProcessAdmin} from '@packages/bpmn-utils/BpmnDesignerUtils'

export default {
    name: 'ElementGlobalProperties',
    components: {EditItem},
    data () {
        return {
            modelVisible: false,
            showProcessAdminName: '',
            adminUserList: [
                {
                    'id': '1286142373594481852',
                    'fullName': '管理员',
                    'userNo': 'E000088',
                    'email': '',
                    'photo': '18038266404',
                    'account': '1001',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059465973761',
                    'fullName': '陈梓宏',
                    'userNo': 'E000197',
                    'email': 'chenzihong@51qqt.com',
                    'photo': '18814374945',
                    'account': 'chenzihong',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059482750979',
                    'fullName': '陈土强',
                    'userNo': 'E000005',
                    'email': 'chentuqiang@51qqt.com',
                    'photo': '13421827879',
                    'account': 'chentuqiang',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059503722498',
                    'fullName': '李权力',
                    'userNo': 'E000312',
                    'email': 'liquanli@51qqt.com',
                    'photo': '17702780314',
                    'account': 'liquanli',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059507916801',
                    'fullName': '陈文清',
                    'userNo': 'E000341',
                    'email': 'chenwenqing@51qqt.com',
                    'photo': '13732978674',
                    'account': 'chenwenqing',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059507916802',
                    'fullName': '王朝龙',
                    'userNo': 'E000361',
                    'email': 'wan*******************',
                    'photo': '13123249331',
                    'account': 'wangchaolong',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059575025665',
                    'fullName': '徐玉霞',
                    'userNo': 'E000535',
                    'email': 'xuyuxia@51qqt.com',
                    'photo': '15659833742',
                    'account': 'xuyuxia',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059612774402',
                    'fullName': '陈映东',
                    'userNo': 'E000567',
                    'email': 'chenyingdong@51qqt.com',
                    'photo': '17688475387',
                    'account': 'chenyingdong',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059629551618',
                    'fullName': '温怡君',
                    'userNo': 'E000600',
                    'email': 'wenyijun@51qqt.com',
                    'photo': '13650931750',
                    'account': 'wenyijun',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059721826307',
                    'fullName': '周健华2',
                    'userNo': 'E000820',
                    'email': 'zhoujianhua2@51qqt.com',
                    'photo': '13533909131',
                    'account': 'zhoujianhua2',
                    'tenantId': '307000'
                }
            ],
            propSkipRulesValue: '',
            propSkipRulesOptions: [
                {label: '相同执行人跳过', value: 'sameUser'},
                {label: '处理人为空跳过', value: 'emptyUser'}
            ],
            processAdminList: [],
            properties: {
                parameterUserAssign: '',
                subjectRule: '',
                description: '',
                propNotifyType: '',
                propSkipRules: '',
                propDateType: '',
                dateTypeDay: '',
                dateTypeHour: '',
                dateTypeMinute: '',
                startMethod: ''
            }
        }
    },
    created () {
        this.init()
    },
    mounted () {
        let processAdmin = getProcessAdmin()
        console.log(processAdmin)
        if (processAdmin) {
            this.processAdminList = JSON.parse(processAdmin)
            this.showProcessAdminName = this.processAdminList.map((item)=>item.userName).join(',')
        }
    },
    methods: {
        init () {
            let xmlProperties = getExtA1Properties()
            if (!xmlProperties) {
                return
            }
            let {
                parameterUserAssign,
                subjectRule,
                propSkipRules
            } = xmlProperties

            this.properties.parameterUserAssign = parameterUserAssign
            this.properties.subjectRule = subjectRule
            if (propSkipRules && propSkipRules!='') {
                this.propSkipRulesValue = propSkipRules.split(',')
            }

        },
        updateSkipFirstNode (value) {
            if (value != 'prop_skipFirstNode') {
                value = ''
            }
            this.properties.parameterUserAssign = value
            saveExtA1Properties(this.properties)
        },
        updateSkipRules (value) {
            let skipRules  = ''
            if (value) {
                skipRules = value.join(',')
            }
            this.properties.propSkipRules = skipRules
            saveExtA1Properties(this.properties)
        },
        updateSubjectRule (value) {
            let subjectRule  = '${title}'
            if (value && value!='') {
                subjectRule = value
            }
            this.properties.subjectRule = subjectRule
            saveExtA1Properties(this.properties)
        },
        changeSelection (rows) {
            this.processAdminList = rows.map((item)=>{
                return {
                    userId: item.id,
                    userName: item.fullName
                }
            })
        },
        resetSelectRow () {
            let selectionUserIdList = this.processAdminList.map((item)=>item.userId)

            // 过滤出选中行
            this.$refs.adminUserListTable.clearSelection()
            let selectionRow  = this.adminUserList.filter((value)=> selectionUserIdList.indexOf(value.id) != -1)

            selectionRow.forEach((row)=>{
                // 表格选中
                this.$refs.adminUserListTable.toggleRowSelection(row)
            })
        },
        closeSelection (item) {
            this.processAdminList = this.processAdminList.filter((value)=>value.userId != item.userId)
            this.resetSelectRow()
        },
        openProcessAdminModel () {
            this.resetSelectRow()
        },
        saveProcessAdminModel () {
            this.showProcessAdminName = this.processAdminList.map((item)=>item.userName).join(',')

            this.$store.commit('setProcessModel', {
                processAdmin: JSON.stringify(this.processAdminList)
            })

            this.modelVisible = false
        }
    }
}
</script>

<style scoped>
</style>
