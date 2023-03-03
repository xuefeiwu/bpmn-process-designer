<template>
  <el-collapse-item name="element_ext_a1_button">
    <template #title>
      <collapse-title title="节点按钮">
        <lucide-icon name="FolderEdit"/>
      </collapse-title>
      <number-tag
        :value="userTaskButtonList.length"
        margin-left="12px"/>
    </template>

    <div class="element_ext_a1_button">
      <el-table
        border
        :data="userTaskButtonList"
        style="width: 100%"
        height="200px">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="50"/>
        <el-table-column
          label="目标节点"
          prop="nodeId"
          align="center"
          width="120"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            <span >{{ row.name }}（{{ row.id }}）</span>
          </template></el-table-column>
        <el-table-column
          label="节点按钮"
          prop="btnName"
          header-align="center"
          width="500"
          align="left">
          <template slot-scope="{row}">
            <template v-for="(button) in row.buttonList">
              <el-tag closable style="margin-left: 2px;" @close="removeButton(button)">{{ button.btnName }}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="50">
          <template slot-scope="{ row}">
            <el-button
              type="text"
              @click="openExtA1ButtonModel(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :visible.sync="showButtonSelector"
      :title="showButtonSelectorTitle"
      width="900px"
      append-to-body
      destroy-on-close>
      <button-selector
        ref="buttonSelector"
        v-if="showButtonSelector"
        :node-id="activeId"
        :button-list="selectButtonList"
      />
      <template #footer>
        <el-button @click="showButtonSelector = false">取 消</el-button>
        <el-button type="primary" @click="saveExtA1ButtonModel">确 认</el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
import EventEmitter from '@utils/EventEmitter'
import {setConditionExpressionValue} from '@packages/bo-utils/conditionUtil'
import {getElementById} from '@packages/bo-utils/extA1ElementUtils'
import {getAllUserTask, getExtA1Buttons, removeExtA1ButtonByNode, removeExtA1Buttons, saveExtA1Buttons} from '@packages/bo-utils/extA1Util'
import ButtonSelector from '@packages/components/Panel/components/SubChild/ButtonSelector'

export default {
    name: 'ElementExtA1Button',
    components: {ButtonSelector},
    data () {
        return {
            userTaskButtonList: [],
            selectButtonList: [],
            showButtonSelector: false,
            showButtonSelectorTitle: '',
            activeId: ''
        }
    },
    mounted () {
        this.reloadExtA1Button()
        EventEmitter.on('element-update', this.reloadExtA1Button)
    },
    methods: {
        reloadExtA1Button () {
            this.activeId = ''
            this.userTaskButtonList = new Array()
            let userTaskList = getAllUserTask()
            userTaskList.forEach((userTask)=>{
                let buttonList = getExtA1Buttons((index, item) => item.nodeId == userTask.id)
                let userTaskButton = {
                    id: userTask.id,
                    name: userTask.name
                }
                if (buttonList && buttonList.length > 0) {
                    buttonList = buttonList.map((button) => {
                        return {
                            id: button.id,
                            alias: button.alias,
                            btnName: button.btnName,
                            cssName: button.cssName,
                            nodeId: button.nodeId
                        }
                    })

                    userTaskButton.buttonList = buttonList
                }

                this.userTaskButtonList.push(userTaskButton)
            })
        },
        removeButton (row) {
            removeExtA1Buttons(row)
            this.reloadExtA1Button()
        },
        openExtA1ButtonModel (row) {
            this.selectButtonList = row.buttonList
            this.activeId = row.id
            this.showButtonSelectorTitle = `${row.name}（${row.id}）节点按钮设置`
            this.showButtonSelector = true
        },
        saveExtA1ButtonModel () {
            this.showButtonSelector = false
            let selectButton = this.$refs.buttonSelector.selectButtonList
            let activeElement = getElementById(this.activeId)
            removeExtA1ButtonByNode(activeElement)

            if (selectButton && selectButton.length > 0) {
                selectButton.forEach((item)=>{
                    saveExtA1Buttons(activeElement, item)
                })
            }


            this.reloadExtA1Button()
        }
    }
}
</script>

<style scoped>

</style>
