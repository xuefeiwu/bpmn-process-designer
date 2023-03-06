<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="20">
        <el-table
          ref="buttonListTable"
          border
          stripe
          highlight-current-row
          :data="allButtonList"
          @selection-change="changeSelection"
          @click="selectOne"
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
            prop="btnName"
            label="按钮名称"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="alias"
            label="按钮标识符"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="cssName"
            label="样式名称"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="4">
        <el-tag
          v-for="(item) in selectButtonList"
          :key="item.id"
          closable
          :disable-transitions="false"
          @close="closeSelection(item)"
          style="margin-left: 10px;margin-top: 10px">
          {{ item.btnName }}
        </el-tag>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {getButtonList} from '@packages/api/process'

export default {
    name: 'ButtonSelector',
    props: {
        buttonList: {
            type: Array,
            default: () => []
        },
        nodeId: {
            type: String,
            default: ''
        },
        selectionType: {
            type: String,
            default: 'Checkbox'
        }
    },
    data () {
        return {
            selectButtonList: [],
            allButtonList: []
        }
    },
    mounted () {
        if (this.buttonList && this.buttonList.length > 0) {
            this.selectButtonList = JSON.parse(JSON.stringify(this.buttonList))
        }
        this.reloadTable()
        this.resetSelectRow()
    },
    methods: {
        resetSelectRow () {
            if (!this.selectButtonList || this.selectButtonList.length == 0) {
                this.$refs.buttonListTable.clearSelection()
                return
            }
            let selectButtonIdList = this.selectButtonList.map((item) => item.alias)
            let selectionRow = this.allButtonList.filter((value) => selectButtonIdList.indexOf(value.alias) != -1)
            this.$refs.buttonListTable.clearSelection()
            selectionRow.forEach((row) => {
                // 表格选中
                this.$refs.buttonListTable.toggleRowSelection(row)
            })
        },
        selectOne (row) {
            if (this.selectionType == 'Checkbox') {
                return
            }
            this.$refs.buttonListTable.clearSelection()
            this.$refs.buttonListTable.toggleRowSelection(row, true)
            this.selectButtonList = []
            this.selectButtonList.push({
                alias: row.alias,
                cssName: row.cssName,
                nodeId: this.nodeId,
                btnName: row.btnName
            })
        },
        changeSelection (rows) {
            let finalRow = rows
            if (this.selectionType == 'Radio' && rows.length > 1) {
                finalRow = rows.filter((it, index) => {
                    if (index == rows.length - 1) {
                        this.$refs.buttonListTable.toggleRowSelection(it, true)
                        return true
                    } else {
                        this.$refs.buttonListTable.toggleRowSelection(it, false)
                        return false
                    }
                })
            }

            this.selectButtonList = finalRow.map((item) => {
                return {
                    alias: item.alias,
                    cssName: item.cssName,
                    nodeId: this.nodeId,
                    btnName: item.btnName
                }
            })
        },
        closeSelection (item) {
            this.selectButtonList = this.selectButtonList.filter((value) => value.alias != item.alias)
            this.resetSelectRow()
        },
        openUserModel () {
            this.resetSelectRow()
        },
        async reloadTable () {
            await getButtonList().then(result => {
                if (result.code == 0) {
                    this.allButtonList = JSON.parse(result.data)['UserTask']
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
