<template>
  <div class="edit-item">
    <div
      class="edit-item_label"
      :style="labelStyle">
      {{ label }}
      <template v-if="showTooltip">
        <el-tooltip class="item" effect="dark" placement="top">
          <!--  问号的图标   -->
          <i class="el-icon-question" style="font-size: 14px; vertical-align: middle;"></i>
          <!--  提示的内容 -->
          <div v-html="tooltipContent" slot="content" style="white-space:pre-wrap"/>
        </el-tooltip>
      </template>：
    </div>
    <div class="edit-item_content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
    name: 'EditItem',
    props: {
        label: {
            type: String,
            default: ''
        },
        showTooltip: {
            type: Boolean,
            default: false
        },
        tooltipContent: {
            type: String,
            default: ''
        },
        textAlign: {
            type: String,
            default: 'right',
            validator: (val) => ['left', 'center', 'right'].indexOf(val) !== -1
        },
        labelWidth: {
            type: Number,
            default: 80
        }
    },
    computed: {
        labelStyle () {
            return {
                width: `${this.labelWidth}px`,
                textAlign: this.textAlign
            }
        }
    }
}
</script>

<style scoped lang="scss">
.edit-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  line-height: 34px;
  .edit-item_content {
    flex: 1;
  }

  & + .edit-item {
    margin-top: 12px;
  }
}
</style>
