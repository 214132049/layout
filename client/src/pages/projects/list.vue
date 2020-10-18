<template>
  <div>
    <router-link to="/projects/edit">
      <a-button type="primary" style="margin-bottom: 20px;">添加项目</a-button>
    </router-link>
    <template v-if="loadend">
      <a-list v-if="hasData" :grid="{ gutter: 60, column: 4 }" :data-source="myProjects">
        <a-list-item slot="renderItem" slot-scope="item">
          <router-link :to="{path:'/projects/detail', query:{id:item.id}}">
            <a-card hoverable>
              <img slot="cover" alt="cover" style="height: 220px;" :src="item.image | defaultProject"/>
              <a-card-meta :title="item.name" :description="item.desc" />
            </a-card>
          </router-link>
        </a-list-item>
      </a-list>
      <a-empty style="margin-top: 100px;" description="暂无项目" v-else />
    </template>
  </div>
</template>

<style lang="stylus" scoped>
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'

  export default {
    mixins: [BasePage],
    components: {},
    name: 'projects',
    data () {
      return {
        loadend: false,
        myProjects: {},
      }
    },
    mounted: function () {
      this.loadMyProject()
    },
    computed: {
      hasData: function () {
        return Object.keys(this.myProjects).length > 0
      }
    },
    methods: {
      loadMyProject: function () {
        Server({
          url: '/api/project/list',
          method: 'post',
          needLoading: true,
          data: {}
        }).then((response) => {
          this.myProjects = response.data.list || []
          this.loadend = true
        })
      }
    }
  }
</script>
