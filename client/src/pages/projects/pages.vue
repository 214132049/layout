<template>
  <div class="content">
    <router-link :to="{ path: '/pages/edit', query: { projectId } }">
      <a-button type="primary" style="margin-bottom: 20px;">添加页面</a-button>
    </router-link>
    <!--页面列表信息-->
    <div class="blank-state" v-if="!hasData">
      <a-empty style="margin-top: 100px;" description="暂无页面" />
    </div>
    <a-list v-else :grid="{ gutter: 60, column: 4 }" :data-source="pagesList">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card hoverable>
          <img slot="cover" alt="cover" :src="item.image | defaultProject"
          />
          <template slot="actions" class="ant-card-actions">
            <a-button type="link">编辑</a-button>
            <router-link :to="{path: '/pages/edit', query: { id: item.id }}">
              <a-button type="link">设置</a-button>
            </router-link>
            <a-button type="link" @click="deleteOne(item)">删除</a-button>
          </template>
          <a-card-meta :title="item.name" :description="item.desc" />
        </a-card>
      </a-list-item>
    </a-list>
  </div>
</template>

<style lang="stylus" scoped>
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  const config = require('src/config')

  export default {
    mixins: [BasePage],
    components: {},
    name: 'projectsPages',
    props: {
      id: { // 项目id
        type: Number
      }
    },
    data () {
      return {
        visible: false,
        projectKey: '',
        projectName: '',
        projectId: this.$route.query.id,
        categoryType: {
          1: '活动类'
        },
        pagesList: []
      }
    },
    mounted: function () {
      this.projectId = this.$route.query.id - 0
      this.projectKey = this.$route.query.key
      this.projectName = window.decodeURIComponent(this.$route.query.name || '')
      this.getPagesList()
    },
    computed: {
      hasData: function () {
        return this.pagesList.length > 0
      }
    },
    methods: {
      // 删除
      deleteOne: function (item) {
        this.$confirm({
          content: '是否删除？',
          onOk: () => {
            Server({
              url: 'api/pages/delete',
              method: 'POST',
              needLoading: true,
              data: {
                id: +item.id
              }
            }).then(() => {
              this.$message.success('删除成功!')
              this.getPagesList()
            })
          }
        })
      },
      // 详情页面挂载
      getPagesList () {
        Server({
          url: 'api/pages/list',
          method: 'post',
          needLoading: true,
          trimNull: false,
          data: {
            projectId: this.projectId
          }
        }).then((res) => {
          this.pagesList = res.data.list || []
        })
      }
    }
  }
</script>
