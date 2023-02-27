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
            label="姓名"
            prop="fullName">
            <el-input
              v-model="filterCondition.fullName"
              placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item
            label="用户账号"
            prop="userNo">
            <el-input
              v-model="filterCondition.userNo"
              placeholder="请输入账号"></el-input>
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
      <el-col :span="21">
        <el-table
          ref="userListTable"
          border
          stripe
          highlight-current-row
          :data="userList"
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
            prop="fullName"
            label="姓名"
            align="center"
            show-overflow-tooltip
            width="120">
          </el-table-column>
          <el-table-column
            prop="userNo"
            label="账号"
            align="center"
            show-overflow-tooltip
            width="120">
          </el-table-column>
          <el-table-column
            prop="email"
            align="center"
            label="邮箱"
            show-overflow-tooltip
            width="216">
          </el-table-column>
          <el-table-column
            prop="photo"
            align="center"
            label="手机号"
            show-overflow-tooltip
            width="180">
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
      <el-col :span="3">
        <el-tag
          v-for="(item) in selectUserList"
          :key="item.id"
          closable
          :disable-transitions="false"
          @close="closeSelection(item)"
          style="margin-left: 10px;margin-top: 10px">
          {{ item.userName }}
        </el-tag>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
    name: 'UserSelector',
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
            userList: [
                {
                    'id': '1286142373594481852',
                    'fullName': '管理员',
                    'userNo': 'E000088',
                    'email': '',
                    'photo': '18038266404',
                    'account': '1001',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059465973761',
                    'fullName': '陈梓宏',
                    'userNo': 'E000197',
                    'email': 'chenzihong@51qqt.com',
                    'photo': '18814374945',
                    'account': 'chenzihong',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059482750979',
                    'fullName': '陈土强',
                    'userNo': 'E000005',
                    'email': 'chentuqiang@51qqt.com',
                    'photo': '13421827879',
                    'account': 'chentuqiang',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059503722498',
                    'fullName': '李权力',
                    'userNo': 'E000312',
                    'email': 'liquanli@51qqt.com',
                    'photo': '17702780314',
                    'account': 'liquanli',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059507916801',
                    'fullName': '陈文清',
                    'userNo': 'E000341',
                    'email': 'chenwenqing@51qqt.com',
                    'photo': '13732978674',
                    'account': 'chenwenqing',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059507916802',
                    'fullName': '王朝龙',
                    'userNo': 'E000361',
                    'email': 'wan*******************',
                    'photo': '13123249331',
                    'account': 'wangchaolong',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059575025665',
                    'fullName': '徐玉霞',
                    'userNo': 'E000535',
                    'email': 'xuyuxia@51qqt.com',
                    'photo': '15659833742',
                    'account': 'xuyuxia',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059612774402',
                    'fullName': '陈映东',
                    'userNo': 'E000567',
                    'email': 'chenyingdong@51qqt.com',
                    'photo': '17688475387',
                    'account': 'chenyingdong',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059629551618',
                    'fullName': '温怡君',
                    'userNo': 'E000600',
                    'email': 'wenyijun@51qqt.com',
                    'photo': '13650931750',
                    'account': 'wenyijun',
                    'tenantId': '307000'
                },
                {
                    'id': '1387731059721826307',
                    'fullName': '周健华2',
                    'userNo': 'E000820',
                    'email': 'zhoujianhua2@51qqt.com',
                    'photo': '13533909131',
                    'account': 'zhoujianhua2',
                    'tenantId': '307000'
                }
            ],
            selectUserList: [],
            filterCondition: {},
            currentPage: 1,
            pageSize: 10,
            pageSizeList: [10, 20, 30, 40]
        }
    },
    mounted () {
        this.selectUserList = this.init()
        this.updateShowName()
    },
    methods: {
        resetSelectRow () {
            if (!this.selectUserList || this.selectUserList.length == 0) {
                return
            }

            let selectionUserIdList = this.selectUserList.map((item)=>item.id)
            // 过滤出选中行
            this.$refs.userListTable.clearSelection()
            let selectionRow  = this.userList.filter((value)=> selectionUserIdList.indexOf(value.id) != -1)

            selectionRow.forEach((row)=>{
                // 表格选中
                this.$refs.userListTable.toggleRowSelection(row)
            })
        },
        selectOne (row) {
            if (this.selectionType == 'Checkbox') {
                return
            }
            this.$refs.userListTable.clearSelection()
            this.$refs.userListTable.toggleRowSelection(row, true)
            this.selectUserList = []
            this.selectUserList.push({
                id: row.id,
                userName: row.fullName
            })
        },
        changeSelection (rows) {
            let finalRow = rows
            if (this.selectionType == 'Radio' && rows.length > 1) {
                finalRow = rows.filter((it, index) => {
                    if (index == rows.length - 1) {
                        this.$refs.userListTable.toggleRowSelection(it, true)
                        return true
                    } else {
                        this.$refs.userListTable.toggleRowSelection(it, false)
                        return false
                    }
                })
            }

            this.selectUserList = finalRow.map((item)=>{
                return {
                    id: item.id,
                    userName: item.fullName
                }
            })
        },
        closeSelection (item) {
            this.selectUserList = this.selectUserList.filter((value)=>value.id != item.id)
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
