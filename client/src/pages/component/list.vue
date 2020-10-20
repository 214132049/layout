<template>
  <div>
    <router-link :to="{ path: '/component/edit', query: { projectId } }">
      <a-button type="primary" style="margin-bottom: 20px;">添加组件</a-button>
    </router-link>
    <template v-if="loadend">
      <a-list v-if="hasData" :grid="{ gutter: 60, column: 4 }" :data-source="comLists">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-card hoverable :title="item.name">
            <template slot="actions" class="ant-card-actions">
              <router-link :to="{path: '/component/edit', query: { id: item.id }}">
                <a-button type="link">编辑</a-button>
              </router-link>
              <a-button type="link" @click="deleteOne(item)">删除</a-button>
            </template>
            {{ item.desc }}
          </a-card>
        </a-list-item>
      </a-list>
      <a-empty style="margin-top: 100px;" description="暂无组件" v-else />
    </template>
  </div>
</template>

<style lang="stylus" scoped>
</style>

<script>
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  export default {
    mixins: [BasePage],
    name: 'ComponentList',
    props: {
      id: { // 项目id
        type: Number
      }
    },
    data () {
      return {
        comLists: [],
        loadend: false,
        projectId: this.$route.query.id
      }
    },
    computed: {
      hasData () {
        return this.comLists.length > 0
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      deleteOne: function (item) {
        this.$confirm({
          content: '是否删除？',
          onOk: () => {
            Server({
              url: 'api/component/delete',
              method: 'POST',
              needLoading: true,
              data: {
                id: +item.id
              }
            }).then(() => {
              this.$message.success('删除成功!')
              this.loadData()
            })
          }
        })
      },
      loadData () {
        Server({
          url: 'api/component/list',
          method: 'post',
          needLoading: true,
          data: {
            projectId: this.projectId
          }
        }).then(({ data }) => {
          this.comLists = data.list || []
          this.loadend = true
        })
      },
    }
  }
</script>
