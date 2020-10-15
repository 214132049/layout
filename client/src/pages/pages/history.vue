<template>
  <div>
    <a-table :data="tableData" style="width: 100%" border>
      <a-table-column prop="createTime" label="时间" width="180">
      </a-table-column>
      <a-table-column prop="userName" label="姓名" width="180">
      </a-table-column>
      <a-table-column label="操作">
        <template slot-scope="scope">
          <a-button type="warning" size="mini" @click="handleUse(scope.$index, scope.row)" icon='a-icon-success'>恢复使用</a-button>
          <a-button type="warning" size="mini" @click="historyToDraft(scope.$index, scope.row)" icon='a-icon-refresh'>恢复到草稿</a-button>
          <!-- <a-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</a-button> -->
          <a-button @click="handleDelete(scope.$index, scope.row)" size="mini" type="danger" icon="a-icon-delete">删除</a-button>
          <a-button size="mini" type="success" @click="handlePreview(scope.$index, scope.row)" icon='a-icon-view'>预览</a-button>
        </template>
      </a-table-column>
    </a-table>
    <a-dialog title="警告" :visible.sync="dialogVisible" width="30%">
      <span>删除后不可恢复，您确定要删除吗</span>
      <span slot="footer" class="dialog-footer">
        <a-button @click="dialogVisible = false">取 消</a-button>
        <a-button type="primary" @click="gotoDelete">确 定</a-button>
      </span>
    </a-dialog>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
</style>
<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  const config = require('../../config')

  export default {
    mixins: [BasePage],
    components: {},
    name: 'history',
    props: {
      id: { // 项目id
        type: String
      },
      type: { // 页面类型
        type: [Number, String]
      },
      projectId: {
        type: [Number, String]
      },
      pageKey: {
        type: String
      }
    },
    data () {
      return {
        tableData: [],
        dialogVisible: false,
        deleteItem: {}
      }
    },
    created () {
      this.getHistory()
    },
    mounted: function () {
    },
    computed: {

    },
    methods: {
      async handleUse (index, row) {
        let yes = await this.$confirm('确定要直接恢复到此版本并发布吗，此操作会立即同步用户端，请谨慎操作！')
        if (!yes) return
        Server({
          url: 'editor/pages/history-publish',
          method: 'post',
          needLoading: true,
          data: {
            pageKey: this.pageKey,
            id: row.pageId,
            projectId: this.projectId,
            type: +this.type,
            content: row.content
          }
        }).then((response) => {
          this.$message({type: 'success', message: '版本发布成功'})
        })
      },
      async historyToDraft (index, row) {
        let yes = await this.$confirm('确定要将此版本恢复为草稿么，此操作会覆盖当前尚未发布的草稿，请谨慎操作！')
        if (!yes) return
        Server({
          url: 'editor/pages/history-to-draft',
          method: 'post',
          needLoading: true,
          data: {
            type: +this.type,
            projectId: this.projectId,
            pageKey: this.pageKey,
            id: row.pageId,
            content: row.content
          }
        }).then((response) => {
          this.$message({type: 'success', message: '版本替换成功'})
        })
      },
      handleDelete (index, row) {
        this.dialogVisible = true
        this.deleteItem = {...row, index}
      },
      handlePreview (index, row) {
        var url = this.checkPreviewUrl(row.id)
        window.open(url)
      },
      gotoDelete () {
        this.dialogVisible = false
        Server({
          url: `editor/pages/history-delete?id=${this.deleteItem.id}`,
          method: 'get',
          needLoading: true,
        }).then(response => {
          var data = response.data.data
          if (data) {
            this.$message({message: '删除成功', type: 'success'})
            this.tableData.splice(this.deleteItem.index, 1)
          }
        })
      },
      getHistory () {
        Server({
          url: `editor/pages/history?pageId=${this.id}`,
          method: 'get',
          needLoading: true,
        }).then((response) => {
          var data = response.data.data
          if (data) {
            data.forEach(element => {
              element.createTime = (new Date(element.createTime)).Format('yyyy-MM-dd hh:mm')
            })
            this.tableData = data
          }
        })
      },
      checkPreviewUrl (id) {
        return `${config.VIEW_PATH}components?historyid=${id}`
      }
    }
  }
</script>
