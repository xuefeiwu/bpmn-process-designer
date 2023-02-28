<template>
  <el-collapse-item name="element_ext_a1_attributes">
    <template #title>
      <collapse-title title="自定义属性">
        <lucide-icon name="Brush"/>
      </collapse-title>
      <number-tag
        :value="a1AttributeList.length"
        margin-left="12px"/>
    </template>
    <div class="element_ext_a1_attributes">
      <el-table
        border
        :data="a1AttributeList"
        style="width: 100%"
        height="200px">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="50"/>
        <el-table-column
          label="属性名称"
          prop="name"
          align="center"
          show-overflow-tooltip/>
        <el-table-column
          label="属性值"
          prop="val"
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
              @click="openExtA1AttributeModel($index,row)">编辑</el-button>
            <el-button
              type="text"
              @click="removeExtA1AttributeModel(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button
        type="primary"
        class="inline-large-button"
        @click="openExtA1AttributeModel(-1)"
        icon="el-icon-plus">添加自定义属性</el-button>
    </div>

    <el-dialog
      :visible.sync="modelVisible"
      title="添加自定义属性"
      width="800px"
      append-to-body
      destroy-on-close>
      <el-form
        ref="formRef"
        :model="a1Attribute"
        :rules="formRules"
        class="need-filled"
        label-width="100px"
        aria-modal="true">
        <el-form-item
          label="属性名称:"
          prop="name">
          <el-input v-model="a1Attribute.name"></el-input>
        </el-form-item>
        <el-form-item
          label="属性值:"
          prop="val">
          <el-input v-model="a1Attribute.val"></el-input>
        </el-form-item>
        <!--<el-form-item-->
        <!--  label="属性标识:"-->
        <!--  prop="flag">-->
        <!--  <el-input v-model="a1Attribute.flag"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <template #footer>
        <el-button @click="reloadExtA1Attribute">取 消</el-button>
        <el-button
          @click="saveExtA1Attribute"
          type="primary">确 认</el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
import {getAllUserTask, getExtA1Attributes, getExtA1Globals, removeExtA1Attribute, removeExtA1GlobalRequest, saveExtA1Globals, saveExtAttributes} from '@packages/bo-utils/ExtA1Util'
import {getActive} from '@packages/bpmn-utils/BpmnDesignerUtils'

export default {
    name: 'ElementExtA1Attributes',
    data () {
        return {
            modelVisible: false,
            a1AttributeList: [],
            a1Attribute: {
                id: '',
                name: '',
                nodeId: '',
                val: '',
                flag: ''
            },
            formRules: {
                name: { required: true, message: '属性名称不能为空', trigger: ['blur', 'change'] },
                val: { required: true, message: '属性值不能为空', trigger: ['blur', 'change'] }
                // flag: { required: true, message: '属性标识不能为空', trigger: ['blur', 'change'] }
            }
        }
    },
    mounted () {
        this.reloadExtA1Attribute()
    },
    methods: {
        removeExtA1AttributeModel (row) {
            removeExtA1Attribute(row)
            this.reloadExtA1Attribute()
        },
        async saveExtA1Attribute () {
            await this.$refs.formRef.validate()
            this.a1Attribute.nodeId = getActive().id
            saveExtAttributes(getActive(), this.a1Attribute)
            this.reloadExtA1Attribute()
        },
        async openExtA1AttributeModel (index, extA1Attribute) {
            this.activeIndex = index
            this.a1Attribute = {}
            extA1Attribute && (this.a1Attribute = JSON.parse(JSON.stringify(extA1Attribute)))

            this.modelVisible = true
            await this.$nextTick()
            this.$refs.formRef && this.$refs.formRef.clearValidate()
        },
        reloadExtA1Attribute () {
            this.modelVisible = false
            this.a1AttributeList = []
            const a1AttributeList = getExtA1Attributes((index, item)=> item.nodeId == getActive().id)
            if (a1AttributeList) {
                this.a1AttributeList = a1AttributeList.map((item)=>({
                    id: item.id,
                    name: item.name,
                    nodeId: item.nodeId,
                    val: item.val,
                    flag: item.flag
                }))
            }
        }
    }
}
</script>
