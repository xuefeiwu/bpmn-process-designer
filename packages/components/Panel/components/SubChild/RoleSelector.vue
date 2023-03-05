<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-form
          :inline="true"
          ref="filterCondition"
          :model="filterCondition"
          class="demo-form-inline">
          <el-form-item
            label="角色名称"
            prop="name">
            <el-input
              v-model="filterCondition.name"
              placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item
            label="角色编码"
            prop="code">
            <el-input
              v-model="filterCondition.code"
              placeholder="请输入角色编码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="searchForm">查询</el-button>
            <el-button
              type="primary"
              @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="20">
        <el-table
          ref="roleListTable"
          border
          stripe
          highlight-current-row
          :height="445"
          :data="roleList"
          @selection-change="changeSelection"
          @click="selectOne"
          style="width: 100%;">
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
            prop="name"
            label="角色名称"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="code"
            align="center"
            label="角色编码"
            show-overflow-tooltip>
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
      <el-col :span="4">
        <template v-for="(item) in selectRoleList">
          <el-tag
            v-if="item.name && item.name != ''"
            :key="item.id"
            closable
            :disable-transitions="false"
            @close="closeSelection(item)"
            style="margin-left: 10px;margin-top: 10px">
            {{ item.name }}
          </el-tag>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
    name: 'RoleSelector',
    props: {
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
    data (){
        return{
            roleList: [
                {
                    'id': '1372068204459687938',
                    'name': '总经理',
                    'code': 'management'
                },
                {
                    'id': '1380500782885216257',
                    'name': '企业管理员',
                    'code': 'companyAdmin'
                },
                {
                    'id': '1380759270812372993',
                    'name': '采购',
                    'code': 'purchase'
                },
                {
                    'id': '1381515036144533505',
                    'name': '供应商',
                    'code': 'sale'
                },
                {
                    'id': '1390548658717392897',
                    'name': '角色',
                    'code': 'character '
                },
                {
                    'id': '1397891199436566529',
                    'name': '客户试用',
                    'code': 'POC-1'
                },
                {
                    'id': '1402897050928930818',
                    'name': '售前顾问',
                    'code': 'presales'
                },
                {
                    'id': '1404333739274653697',
                    'name': '采购经理',
                    'code': 'purchaseManagement'
                },
                {
                    'id': '1405830526300819457',
                    'name': '产品权限',
                    'code': 'product'
                },
                {
                    'id': '1407306574066565122',
                    'name': '管理员',
                    'code': 'Administrator'
                }
            ],
            selectRoleList: [],
            filterCondition: {},
            currentPage: 1,
            pageSize: 10,
            pageSizeList: [10, 20, 30, 40]
        }
    },
    mounted () {
        this.selectRoleList = this.init()
        this.updateShowName && this.updateShowName()
    },
    methods: {
        resetSelectRow () {
            if (!this.selectRoleList || this.selectRoleList.length == 0) {
                this.$refs.roleListTable.clearSelection()
                return
            }

            let selectionUserIdList = this.selectRoleList.map((item)=>item.id)
            let selectionRow  = this.roleList.filter((value)=> selectionUserIdList.indexOf(value.id) != -1)
            // 过滤出选中行
            this.$refs.roleListTable.clearSelection()
            selectionRow.forEach((row)=>{
                // 表格选中
                this.$refs.roleListTable.toggleRowSelection(row)
            })
        },
        selectOne (row) {
            if (this.selectionType == 'Checkbox') {
                return
            }
            this.$refs.roleListTable.clearSelection()
            this.$refs.roleListTable.toggleRowSelection(row, true)
            this.selectroleList = []
            this.selectRoleList.push({
                id: row.id,
                name: row.name
            })
        },
        changeSelection (rows) {
            let finalRow = rows
            if (this.selectionType == 'Radio' && rows.length > 1) {
                finalRow = rows.filter((it, index) => {
                    if (index == rows.length - 1) {
                        this.$refs.roleListTable.toggleRowSelection(it, true)
                        return true
                    } else {
                        this.$refs.roleListTable.toggleRowSelection(it, false)
                        return false
                    }
                })
            }

            this.selectRoleList = finalRow.map((item)=>{
                return {
                    id: item.id,
                    name: item.name
                }
            })
        },
        closeSelection (item) {
            this.selectRoleList = this.selectRoleList.filter((value)=>value.id != item.id)
            this.resetSelectRow()
        },
        openUserModel () {
            this.resetSelectRow()
        },
        searchForm (){
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
        }
    }
}
</script>

<style scoped>

</style>
