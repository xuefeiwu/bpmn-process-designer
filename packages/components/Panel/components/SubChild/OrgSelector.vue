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
    data (){
        return{
            orgList: [
                {
                    'id': '1438046022571786241',
                    'deptName': '广州聚才南沙工厂',
                    'easyName': '广州聚才南沙工厂',
                    'deptCode': '3003',
                    'parent': null,
                    'path': null,
                    'demId': null,
                    'parentId': '1438046022580174883',
                    'children': null,
                    'expand': true,
                    'title': null,
                    'level': '2'
                },
                {
                    'id': '1438046022571786243',
                    'deptName': '深圳聚才龙岗工厂',
                    'easyName': '深圳聚才龙岗工厂',
                    'deptCode': '3001',
                    'parent': null,
                    'path': null,
                    'demId': null,
                    'parentId': '1438046022580174884',
                    'children': null,
                    'expand': true,
                    'title': null,
                    'level': '2'
                },
                {
                    'id': '1438046022571786244',
                    'deptName': '北京综合采购组',
                    'easyName': '北京综合采购组',
                    'deptCode': '5011',
                    'parent': null,
                    'path': null,
                    'demId': null,
                    'parentId': '1438046022575980548',
                    'children': null,
                    'expand': true,
                    'title': null,
                    'level': '3'
                },
                {
                    'id': '1438046022571786245',
                    'deptName': '广州综合采购组',
                    'easyName': '广州综合采购组',
                    'deptCode': '5010',
                    'parent': null,
                    'path': null,
                    'demId': null,
                    'parentId': '1438046022575980548',
                    'children': null,
                    'expand': true,
                    'title': null,
                    'level': '3'
                },
                {
                    'id': '1438046022571786246',
                    'deptName': '广州服务采购组',
                    'easyName': '广州服务采购组',
                    'deptCode': '5008',
                    'parent': null,
                    'path': null,
                    'demId': null,
                    'parentId': '1438046022575980550',
                    'children': null,
                    'expand': true,
                    'title': null,
                    'level': '3'
                },
                {
                    'id': '1438046022571786247',
                    'deptName': '广州广宣采购组',
                    'easyName': '广州广宣采购组',
                    'deptCode': '5009',
                    'parent': null,
                    'path': null,
                    'demId': null,
                    'parentId': '1438046022575980549',
                    'children': null,
                    'expand': true,
                    'title': null,
                    'level': '3'
                },
                {
                    'id': '1438046022571786248',
                    'deptName': '广州固资采购组',
                    'easyName': '广州固资采购组',
                    'deptCode': '5007',
                    'parent': null,
                    'path': null,
                    'demId': null,
                    'parentId': '1438046022575980551',
                    'children': null,
                    'expand': true,
                    'title': null,
                    'level': '3'
                },
                {
                    'id': '1438046022571786249',
                    'deptName': '广州物料采购组',
                    'easyName': '广州物料采购组',
                    'deptCode': '5006',
                    'parent': null,
                    'path': null,
                    'demId': null,
                    'parentId': '1438046022575980552',
                    'children': null,
                    'expand': true,
                    'title': null,
                    'level': '3'
                },
                {
                    'id': '1438046022571786250',
                    'deptName': '深圳综合采购组',
                    'easyName': '深圳综合采购组',
                    'deptCode': '5005',
                    'parent': null,
                    'path': null,
                    'demId': null,
                    'parentId': '1438046022575980548',
                    'children': null,
                    'expand': true,
                    'title': null,
                    'level': '3'
                },
                {
                    'id': '1438046022571786251',
                    'deptName': '深圳广宣采购组',
                    'easyName': '深圳广宣采购组',
                    'deptCode': '5004',
                    'parent': null,
                    'path': null,
                    'demId': null,
                    'parentId': '1438046022575980549',
                    'children': null,
                    'expand': true,
                    'title': null,
                    'level': '3'
                }
            ],
            selectOrgList: [],
            filterCondition: {},
            currentPage: 1,
            pageSize: 10,
            pageSizeList: [10, 20, 30, 40]
        }
    },
    mounted () {
        this.selectOrgList = this.init()
        this.updateShowName && this.updateShowName()
    },
    methods: {
        resetSelectRow () {
            if (!this.selectOrgList || this.selectOrgList.length == 0) {
                this.$refs.orgListTable.clearSelection()
                return
            }

            let selectionUserIdList = this.selectOrgList.map((item)=>item.id)
            let selectionRow  = this.orgList.filter((value)=> selectionUserIdList.indexOf(value.id) != -1)
            // 过滤出选中行
            this.$refs.orgListTable.clearSelection()
            selectionRow.forEach((row)=>{
                // 表格选中
                this.$refs.orgListTable.toggleRowSelection(row)
            })
        },
        selectOne (row) {
            if (this.selectionType == 'Checkbox') {
                return
            }
            this.$refs.orgListTable.clearSelection()
            this.$refs.orgListTable.toggleRowSelection(row, true)
            this.selectOrgList = []
            this.selectOrgList.push({
                id: row.id,
                deptName: row.deptName
            })
        },
        changeSelection (rows) {
            let finalRow = rows
            if (this.selectionType == 'Radio' && rows.length > 1) {
                finalRow = rows.filter((it, index) => {
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
