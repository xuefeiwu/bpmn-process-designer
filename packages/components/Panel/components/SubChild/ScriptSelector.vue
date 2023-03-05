<template>
  <div>
    <el-row style="height: 20%">
      <el-col :span="24">
        <el-form
          :inline="true"
          ref="filterCondition"
          :model="filterCondition"
          class="demo-form-inline">
          <el-form-item
            label="脚本名称"
            prop="scriptName">
            <el-input
              v-model="filterCondition.scriptName"
              placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item
            label="脚本编码"
            prop="scriptCode">
            <el-input
              v-model="filterCondition.scriptCode"
              placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="searchForm">查询
            </el-button>
            <el-button
              type="primary"
              @click="resetForm">重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="19">
        <el-table
          ref="scriptListTable"
          border
          stripe
          highlight-current-row
          :height="445"
          :data="scriptList"
          @selection-change="changeSelection"
          @click="selectOne"
          style="width: 100%;">
          <el-table-column
            type="selection"
            width="40">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="scriptName"
            label="脚本名称"
            align="center"
            show-overflow-tooltip
            width="150">
          </el-table-column>
          <el-table-column
            prop="scriptCode"
            label="脚本编码"
            align="center"
            show-overflow-tooltip
            width="150">
          </el-table-column>
          <el-table-column
            prop="tenantId"
            align="center"
            label="租户"
            show-overflow-tooltip
            width="90">
          </el-table-column>
          <el-table-column
            prop="scriptText"
            align="center"
            label="脚本内容"
            width="300">
            <template slot-scope="{row}">
              <el-tooltip class="item" effect="dark" placement="top">
                <div v-html="ToBreak(row.scriptText)" slot="content" style="white-space:pre-wrap"></div>
                <div class="oneLine">
                  {{ row.scriptText }}
                </div>
              </el-tooltip>
            </template>

          </el-table-column>
          <el-table-column
            prop="scriptDescribe"
            align="center"
            label="脚本描述"
            show-overflow-tooltip
            width="300">
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :total="500"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="pageSizeList">
        </el-pagination>
      </el-col>
      <el-col :span="5">
        <template v-for="(item) in selectScriptList">
          <el-tag
            v-if="item.scriptName && item.scriptName != ''"
            :key="item.id"
            closable
            :disable-transitions="false"
            @close="closeSelection(item)"
            style="margin-left: 10px;margin-top: 10px">
            {{ item.scriptName }}
          </el-tag>
        </template>

      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
    name: 'ScriptSelector',
    props: {
        isProcessAdmin: {
            type: Boolean,
            default: false
        },
        init: {
            type: Function,
            default: null
        },
        updateShowName: {
            type: Function,
            default: null
        },
        selectionType: {
            type: String,
            default: 'Checkbox'
        }
    },
    data () {
        return {
            scriptList: [
                {
                    'id': '1552595548031279106',
                    'scriptName': '【角色】企业管理员用户',
                    'scriptCode': 'companyAdminAndOrg',
                    'scriptText': 'import com.els.common.util.SpringContextUtils\nimport com.els.modules.account.api.dto.ElsSubAccountDTO\nimport com.els.modules.workflow.rpc.service.WorkflowInvokeAccountRpcService\n\nimport java.util.stream.Collectors\n\n// 1. 获取用户信息\nString currentUserId = (String)innerUser.get("currentUser");\nWorkflowInvokeAccountRpcService workflowInvokeAccountRpcService = SpringContextUtils.getBean(WorkflowInvokeAccountRpcService.class)\nElsSubAccountDTO auditUser = workflowInvokeAccountRpcService.queryUserByUserId(currentUserId);\n\n// 2. 获取指定角色的编码的用户信息\nString roleCode = "companyAdmin";\ndef accountList = workflowInvokeAccountRpcService.getListByRoleCodes(roleCode);\nif (!accountList.isEmpty()) {\n    def userIds = accountList.stream()\n            .filter(accountDTO -> accountDTO.getOrgCode().equals(auditUser.getOrgCode()))\n            .map(ElsSubAccountDTO::getId)\n            .collect(Collectors.toList());\n    return userIds;\n}\nreturn Collections.emptyList();\n',
                    'scriptDescribe': '针对同一个角色，存在不同组织下用户都属于这个角色，若上一节点是A组织下的用户，则下一节点角色策略会取A组织下的该角色用户',
                    'tenantId': '307000'
                },
                {
                    'id': '1553992682986225666',
                    'scriptName': '【角色】企业管理员用户',
                    'scriptCode': 'companyAdminAndOrg',
                    'scriptText': 'import com.els.common.util.SpringContextUtils\nimport com.els.modules.account.api.dto.ElsSubAccountDTO\nimport com.els.modules.workflow.rpc.service.WorkflowInvokeAccountRpcService\n\nimport java.util.stream.Collectors\n\n// 1. 获取用户信息\nString currentUserId = (String)innerUser.get("currentUser");\nWorkflowInvokeAccountRpcService workflowInvokeAccountRpcService = SpringContextUtils.getBean(WorkflowInvokeAccountRpcService.class)\nElsSubAccountDTO auditUser = workflowInvokeAccountRpcService.queryUserByUserId(currentUserId);\n\n// 2. 获取指定角色的编码的用户信息\nString roleCode = "companyAdmin";\ndef accountList = workflowInvokeAccountRpcService.getListByRoleCodes(roleCode);\nif (!accountList.isEmpty()) {\n    def userIds = accountList.stream()\n            .filter(accountDTO -> accountDTO.getOrgCode().equals(auditUser.getOrgCode()))\n            .map(ElsSubAccountDTO::getId)\n            .collect(Collectors.toList());\n    return userIds;\n}\nreturn Collections.emptyList();\n',
                    'scriptDescribe': '针对同一个角色，存在不同组织下用户都属于这个角色，若上一节点是A组织下的用户，则下一节点角色策略会取A组织下的该角色用户',
                    'tenantId': '100000'
                }
            ],
            selectScriptList: [],
            filterCondition: {},
            currentPage: 1,
            pageSize: 10,
            pageSizeList: [10, 20, 30, 40]
        }
    },
    mounted () {
        this.selectScriptList = this.init()
        this.updateShowName && this.updateShowName()
    },
    methods: {
        resetSelectRow () {
            if (!this.selectScriptList || this.selectScriptList.length == 0) {
                this.$refs.scriptListTable.clearSelection()
                return
            }

            let selectionUserIdList = this.selectScriptList.map((item) => item.id)
            let selectionRow = this.scriptList.filter((value) => selectionUserIdList.indexOf(value.id) != -1)
            // 过滤出选中行
            this.$refs.scriptListTable.clearSelection()
            selectionRow.forEach((row) => {
                // 表格选中
                this.$refs.scriptListTable.toggleRowSelection(row)
            })
        },
        selectOne (row) {
            if (this.selectionType == 'Checkbox') {
                return
            }
            this.$refs.scriptListTable.clearSelection()
            this.$refs.scriptListTable.toggleRowSelection(row, true)
            this.selectScriptList = []
            this.selectScriptList.push({
                id: row.id,
                scriptName: row.scriptName,
                scriptDescribe: row.scriptDescribe
            })
        },
        changeSelection (rows) {
            let finalRow = rows
            if (this.selectionType == 'Radio' && rows.length > 1) {
                finalRow = rows.filter((it, index) => {
                    if (index == rows.length - 1) {
                        this.$refs.scriptListTable.toggleRowSelection(it, true)
                        return true
                    } else {
                        this.$refs.scriptListTable.toggleRowSelection(it, false)
                        return false
                    }
                })
            }

            this.selectScriptList = finalRow.map((row) => {
                return {
                    id: row.id,
                    scriptName: row.scriptName,
                    scriptDescribe: row.scriptDescribe
                }
            })
        },
        closeSelection (item) {
            this.selectScriptList = this.selectScriptList.filter((value) => value.id != item.id)
            this.resetSelectRow()
        },
        openUserModel () {
            this.resetSelectRow()
        },
        searchForm () {
            console.log(this.filterCondition)
        },
        resetForm () {
            this.filterCondition = {}
            this.$refs.filterCondition.resetFields()
        },
        handleSizeChange (val) {
            console.log(`每页 ${val} 条`)
            this.pageSize = val
        },
        handleCurrentChange (val) {
            console.log(`当前页: ${val}`)
            this.currentPage = val
        },
        ToBreak (val) {
            return val
        }
    }
}
</script>

<style scoped>
.oneLine {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
