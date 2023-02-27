<template>
  <el-collapse-item name="element_node_transfer_ataff">
    <template #title>
      <collapse-title title="节点转办">
        <lucide-icon name="Activity"/>
      </collapse-title>
      <number-tag
        :value="nodeTransferAtaffList.length"
        margin-left="12px"/>
    </template>
    <div class="element_node_transfer_ataff">
      <edit-item
        label="转办人员"
        textAlign="center"
        :labelWidth="120">
        <el-input
          v-model="showNodeTransferAtaff"
          readonly
        >
          <el-button
            slot="append"
            type="primary"
            icon="el-icon-edit"
            @click="modelVisible = true"/>
        </el-input>
      </edit-item>
    </div>

    <el-dialog
      :visible.sync="modelVisible"
      title="选择节点转办人员"
      width="900px"
      append-to-body
      @opened="openNodeTransferAtaffModel"
      destroy-on-close>
      <user-selector
        :show-name.sync="showNodeTransferAtaff"
        :init="initTransferAtaff"
        :update-show-name="updateShowTransferAtaffName"
        selection-type="Radio"
        ref="userSelector"
        :isProcessAdmin="false"/>
      <template #footer>
        <el-button @click="modelVisible = false">取 消</el-button>
        <el-button
          @click="saveNodeTransferAtaffModel"
          type="primary">确 认</el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
import EventEmitter from '@utils/EventEmitter'
import {addExtensionProperty, getExtensionProperties, removeExtensionProperty} from '@packages/bo-utils/extensionPropertiesUtil'
import {getActive} from '@packages/bpmn-utils/BpmnDesignerUtils'
import UserSelector from '@packages/components/Panel/components/SubChild/UserSelector'
import EditItem from '@packages/components/common/EditItem'

export default {
    name: 'ElementNodeTransferAtaff',
    components: {UserSelector, EditItem},
    data (){
        return {
            showNodeTransferAtaff: '',
            newProperty: {
                name: 'nodeTransferAtaff',
                value: ''
            },
            extensionsRaw: [],
            nodeTransferAtaffList: [],
            modelVisible: false
        }
    },
    mounted () {
        this.initTransferAtaff()
        EventEmitter.on('element-update', this.initTransferAtaff)
    },
    methods: {
        removeProperty (propIndex) {
            removeExtensionProperty(getActive(), this.extensionsRaw[propIndex])
        },
        openNodeTransferAtaffModel () {
            this.$refs.userSelector.resetSelectRow()
        },
        saveNodeTransferAtaffModel () {
            this.modelVisible = false
            this.updateShowTransferAtaffName()
            this.extensionsRaw = getExtensionProperties(getActive())
            this.extensionsRaw
                .forEach((item, index)=>{
                    if (item.name == 'nodeTransferAtaff') {
                        this.removeProperty(index)
                    }
                })

            this.newProperty.value = JSON.stringify(this.$refs.userSelector.selectUserList)
            addExtensionProperty(getActive(), this.newProperty)
            this.initTransferAtaff()
        },
        initTransferAtaff () {
            this.nodeTransferAtaffList = []
            this.extensionsRaw = getExtensionProperties(getActive())
            if (this.extensionsRaw && this.extensionsRaw.length > 0) {
                let extensionsRaw =  this.extensionsRaw.filter((item) => item.name == 'nodeTransferAtaff')
                this.nodeTransferAtaffList = JSON.parse(extensionsRaw[0].value)
            }

            this.updateShowTransferAtaffName()
            return this.nodeTransferAtaffList
        },
        updateShowTransferAtaffName (){
            this.showNodeTransferAtaff = this.nodeTransferAtaffList.map((item)=>item.userName).join(',')
        }
    }
}
</script>

<style scoped>

</style>
