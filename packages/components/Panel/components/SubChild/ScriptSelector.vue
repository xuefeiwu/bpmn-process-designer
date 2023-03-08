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
          @select-all="handleSelectionChange"
          @select="handleSelectionChange"
          @current-change="handleOneChange"
          style="width: 100%;">
          <el-table-column
            :type="multipleChoice ? 'selection' : 'index'"
            width="55">
            <template slot-scope="{row}" v-if="multipleChoice == false">
              <el-radio
                :label="row.id"
                v-model="radio"
                @change.native="handleSelectionChange(row)">&nbsp;</el-radio>
            </template>
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
                <div v-html="row.scriptText" slot="content" style="white-space:pre-wrap"></div>
                <div class="oneLine"> {{ row.scriptText }}</div>
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
        <div style="height: 445px;overflow:auto">
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
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {getScriptListPage} from '@packages/api/process'

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
        multipleChoice: {
            type: Boolean,
            default: true
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
    data () {
        return {
            radio: '',
            scriptList: [],
            selectScriptList: [],
            // 用来保存当前的选中
            multipleSelection: [],
            filterCondition: {},
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            pageSizeList: [10, 20, 30, 40]
        }
    },
    mounted () {
        this.selectScriptList = this.init()
        this.multipleSelection = this.selectScriptList ? this.selectScriptList : []
        this.radio = ''
        this.reloadTable()
        this.updateShowName && this.updateShowName()
    },
    methods: {
        resetSelectRow () {
            if (!this.selectScriptList || this.selectScriptList.length == 0) {
                this.$refs.userListTable.clearSelection()
                this.radio = ''
                return
            }

            let selectionRow  = this.scriptList.filter((value)=> this.curSelectedRowIds.indexOf(value.id) != -1)
            if (selectionRow.length == 0) {
                this.radio = ''
                return
            }
            if (this.multipleChoice) {
                // 过滤出选中行
                this.$refs.scriptListTable.clearSelection()
                selectionRow.forEach((row) => {
                    // 表格选中
                    this.$refs.scriptListTable.toggleRowSelection(row)
                })
            } else {
                this.radio = selectionRow[0].id
            }
        },
        handleOneChange (row) {
            if (this.multipleChoice) {
                return
            }
            this.radio = row.id
            this.multipleSelection = [row]
            this.changeSelection(this.multipleSelection)
        },
        /**
         * @param selection 选中的rows
         * @param changedRow 变化的row
         */
        handleSelectionChange (selection, changedRow) {
            if (!this.multipleChoice) {
                this.multipleSelection = [selection]
                this.changeSelection(this.multipleSelection)
                return
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
                this.scriptList.forEach((row) => {
                    let index = this.curSelectedRowIds.indexOf(row.id)
                    if(index > -1) {
                        this.multipleSelection.splice(index, 1)
                    }
                })
            }

            this.changeSelection(this.multipleSelection)
        },
        changeSelection (rows) {
            this.selectScriptList = rows.map((row) => {
                return {
                    id: row.id,
                    scriptName: row.scriptName,
                    scriptDescribe: row.scriptDescribe
                }
            })
        },
        closeSelection (item) {
            this.selectScriptList = this.selectScriptList.filter((value) => value.id != item.id)
            this.multipleSelection = this.multipleSelection.filter((value)=>value.id != item.id)
            this.resetSelectRow()
        },
        openUserModel () {
            this.resetSelectRow()
        },
        searchForm () {
            console.log(this.filterCondition)
            this.currentPage = 1
            this.reloadTable(this.filterCondition.scriptName, this.filterCondition.scriptCode)
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
        async reloadTable (scriptName, scriptCode) {
            await getScriptListPage({
                page: this.currentPage,
                length: this.pageSize,
                scriptName: scriptName,
                scriptCode: scriptCode
            }).then(result =>{
                if (result.code == 0) {
                    this.scriptList = result.page.aaData
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
.oneLine {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
