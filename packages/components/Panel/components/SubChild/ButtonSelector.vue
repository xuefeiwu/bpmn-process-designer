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
          row-key="alias"
          @select-all="handleSelectionChange"
          @select="handleSelectionChange"
          @current-change="handleOneChange"
          style="width: 100%">
          <el-table-column
            :type="multipleChoice ? 'selection' : 'index'"
            width="55">
            <template scope="scope" v-if="multipleChoice == false">
              <el-radio
                :label="scope.row.alias"
                v-model="radio"
                @change.native="handleSelectionChange(scope.row)">&nbsp;</el-radio>
            </template>
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
                result = this.multipleSelection.map((item) => item.alias)
            }
            return result
        }
    },
    data () {
        return {
            radio: '',
            // 用来保存当前的选中
            multipleSelection: [],
            selectButtonList: [],
            allButtonList: []
        }
    },
    mounted () {
        if (this.buttonList && this.buttonList.length > 0) {
            this.selectButtonList = JSON.parse(JSON.stringify(this.buttonList))
            this.multipleSelection = this.selectButtonList ? this.selectButtonList : []
        }
        this.radio = ''
        this.reloadTable()
        this.resetSelectRow()
    },
    methods: {
        resetSelectRow () {
            if (!this.selectButtonList || this.selectButtonList.length == 0) {
                this.$refs.buttonListTable.clearSelection()
                this.radio = ''
                return
            }

            let selectionRow  = this.allButtonList.filter((value)=> this.curSelectedRowIds.indexOf(value.alias) != -1)
            if (selectionRow.length == 0) {
                this.radio = ''
                return
            }

            if (this.multipleChoice) {
                // 过滤出选中行
                this.$refs.buttonListTable.clearSelection()
                selectionRow.forEach((row) => {
                    // 表格选中
                    this.$refs.buttonListTable.toggleRowSelection(row)
                })
            } else {
                this.radio = selectionRow[0].alias
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
                    if (this.curSelectedRowIds.indexOf(row.alias) < 0) {
                        this.multipleSelection.push(row)
                    }
                })
            }
            // 如果当前的selection没有changedRow，表示changedRow被cancel了，
            // 如果this.multipleSelection有这一条，需要splice掉
            if (changedRow && selection.indexOf(changedRow) < 0) {
                if (this.curSelectedRowIds.indexOf(changedRow.alias) > -1) {
                    for (let index = 0; index < this.multipleSelection.length; index++) {
                        if (changedRow.alias === this.multipleSelection[index].alias) {
                            this.multipleSelection.splice(index, 1)
                            break
                        }
                    }
                }
            }
            // 如果当前一条都没有选中，表示都没有选中，则需要把当前页面的rows都遍历一下，splice掉没选中的
            if (selection.length === 0) {
                this.allButtonList.forEach((row) => {
                    let index = this.curSelectedRowIds.indexOf(row.alias)
                    if(index > -1) {
                        this.multipleSelection.splice(index, 1)
                    }
                })
            }

            this.changeSelection(this.multipleSelection)
        },
        changeSelection (rows) {
            // 刷选中当前页中选中的值
            this.selectButtonList = rows.map((item) => {
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
            this.multipleSelection = this.multipleSelection.filter((value)=>value.alias != item.alias)
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
