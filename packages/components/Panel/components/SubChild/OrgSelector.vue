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
            label="部门名称"
            prop="deptName">
            <el-input
              v-model="filterCondition.deptName"
              placeholder="请输入部门名称"></el-input>
          </el-form-item>
          <el-form-item
            label="部门编码"
            prop="deptCode">
            <el-input
              v-model="filterCondition.deptCode"
              placeholder="请输入部门编码"></el-input>
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
      <el-col :span="19">
        <el-table
          ref="orgListTable"
          border
          stripe
          highlight-current-row
          :height="445"
          :data="orgList"
          @selection-change="changeSelection"
          @select-all="handleSelectionChange"
          @select="handleSelectionChange"
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
            prop="deptName"
            label="部门名称"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="easyName"
            label="部门简称"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="deptCode"
            align="center"
            label="部门编码"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :total="pageTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="pageSizeList">
        </el-pagination>
      </el-col>
      <el-col :span="5">
        <template v-for="(item) in selectOrgList">
          <el-tag
            v-if="item.deptName && item.deptName != ''"
            :key="item.id"
            closable
            :disable-transitions="false"
            @close="closeSelection(item)"
            style="margin-left: 10px;margin-top: 10px">
            {{ item.deptName }}
          </el-tag>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {getOrgListPage} from '@packages/api/process'

export default {
    name: 'OrgSelector',
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
    // 计算属性
    computed: {
        // 根据当前的multipleSelection得到对应选中的id
        curSelectedRowIds () {
            let result = []
            if (this.multipleSelection && this.multipleSelection.length > 0) {
                result = this.multipleSelection.map((user) => user.id)
            }
            return result
        }
    },
    data (){
        return{
            orgList: [],
            // 用来保存当前的选中
            multipleSelection: [],
            selectOrgList: [],
            filterCondition: {},
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            pageSizeList: [10, 20, 30, 40]
        }
    },
    mounted () {
        this.selectOrgList = this.init()
        this.multipleSelection = this.selectOrgList ? this.selectOrgList : []
        this.reloadTable()
        this.updateShowName && this.updateShowName()
    },
    methods: {
        resetSelectRow () {
            if (!this.selectOrgList || this.selectOrgList.length == 0) {
                this.$refs.orgListTable.clearSelection()
                return
            }

            let selectionRow  = this.orgList.filter((value)=> this.curSelectedRowIds.indexOf(value.id) != -1)

            if (selectionRow.length == 0) {
                return
            }

            // 过滤出选中行
            this.$refs.orgListTable.clearSelection()
            selectionRow.forEach((row)=>{
                // 表格选中
                this.$refs.orgListTable.toggleRowSelection(row)
            })
        },
        /**
         * @param selection 选中的rows
         * @param changedRow 变化的row
         */
        handleSelectionChange (selection, changedRow) {
            if (this.selectionType == 'Radio') {
                this.multipleSelection = []
            }
            // 检查有没有新增的，有新增的就push
            if (selection && selection.length > 0) {
                selection.forEach((row) => {
                    if (this.curSelectedRowIds.indexOf(row.id) < 0) {
                        this.multipleSelection.push(row)
                    }
                })
            }
            // 如果当前的selection没有changedRow，表示changedRow被cancel了，
            // 如果this.multipleSelection有这一条，需要splice掉
            if (changedRow && selection.indexOf(changedRow) < 0) {
                if (this.curSelectedRowIds.indexOf(changedRow.id) > -1) {
                    for (let index = 0; index < this.multipleSelection.length; index++) {
                        if (changedRow.id === this.multipleSelection[index].id) {
                            this.multipleSelection.splice(index, 1)
                            break
                        }
                    }
                }
            }
            // 如果当前一条都没有选中，表示都没有选中，则需要把当前页面的rows都遍历一下，splice掉没选中的
            if (selection.length === 0) {
                this.orgList.forEach((row) => {
                    let index = this.curSelectedRowIds.indexOf(row.id)
                    if(index > -1) {
                        this.multipleSelection.splice(index, 1)
                    }
                })
            }
        },
        changeSelection (rows) {
            let finalRow = this.multipleSelection
            if (this.selectionType == 'Radio' && rows.length > 1) {
                finalRow = this.multipleSelection.filter((it, index) => {
                    if (index == rows.length - 1) {
                        this.$refs.orgListTable.toggleRowSelection(it, true)
                        return true
                    } else {
                        this.$refs.orgListTable.toggleRowSelection(it, false)
                        return false
                    }
                })
            }

            this.selectOrgList = finalRow.map((item)=>{
                return {
                    id: item.id,
                    deptName: item.deptName
                }
            })
        },
        closeSelection (item) {
            this.selectOrgList = this.selectOrgList.filter((value)=>value.id != item.id)
            this.multipleSelection = this.multipleSelection.filter((value)=>value.id != item.id)
            this.resetSelectRow()
        },
        openUserModel () {
            this.resetSelectRow()
        },
        searchForm (){
            this.currentPage = 1
            this.reloadTable(this.filterCondition.deptName, this.filterCondition.deptCode)
        },
        resetForm () {
            this.filterCondition = {}
            this.$refs.filterCondition.resetFields()
            this.currentPage = 1
            this.reloadTable()
        },
        handleSizeChange (val) {
            console.log(`每页 ${val} 条`)
            this.pageSize = val
            this.currentPage = 1
            this.reloadTable()
        },
        handleCurrentChange (val) {
            console.log(`当前页: ${val}`)
            this.currentPage = val
            this.currentPage = val
            this.reloadTable()
        },
        async reloadTable (deptName, deptCode) {
            await getOrgListPage({
                page: this.currentPage,
                length: this.pageSize,
                deptName: deptName,
                deptCode: deptCode
            }).then(result =>{
                if (result.code == 0) {
                    this.orgList = result.page.aaData
                    this.pageTotal = result.page.total
                } else {
                    this.$message.error(result.message)
                }
            }).finally(() => {
                this.resetSelectRow()
            })

        }
    }
}
</script>

<style scoped>

</style>
