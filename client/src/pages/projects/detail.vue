<template>
  <div v-if="loadend">
    <template v-if="project.id">
      <a-tabs v-model="activeName" @tab-click="tabHandleClick">
        <a-tab-pane tab="页面" key="doc">
          <c-doc :id="project.id" :userId="project.userId" />
        </a-tab-pane>
        <a-tab-pane tab="成员" key="member">
          <member :id="project.id" :member="project.member" :userId="project.userId" @refresh="loadProject"/>
        </a-tab-pane>
        <a-tab-pane v-if="isAdmin" tab="设置" key="setting">
          <c-new :id="project.id"></c-new>
          <a-button class="btn btn-remove" type="danger" @click="delectProject">删除项目</a-button>
        </a-tab-pane>
      </a-tabs>
    </template>
    <template v-else>
      <a-result status="403" title="403" sub-title="你没有此页面的访问权限。">
        <template #extra>
          <router-link to="/project/list">
            <a-button type="primary">返回</a-button>
          </router-link>
        </template>
      </a-result>
    </template>
  </div>
</template>

<style lang="stylus" scoped>

</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  import Member from './members.vue'
  import CNew from './edit.vue'
  import CDoc from './CDoc.vue'

  export default {
    mixins: [BasePage],
    components: { Member, CNew, CDoc },
    name: 'project',
    data: function () {
      return {
        loadend: false,
        project: {},
        id: this.$route.query.id,
        activeName: 'doc'
      }
    },
    mounted: function () {
      this.loadProject()
    },
    computed: {
      isAdmin () {
        return this.project.userId === this.userInfo.id
      }
    },
    methods: {
      loadProject () {
        Server({
          url: 'api/project/info',
          method: 'post',
          needLoading: true,
          data: {
            id: +this.$route.query.id
          }
        }).then((response) => {
          this.project = response.data.data
          this.loadend = true
        })
      },
      tabHandleClick (tab) {
        this.activeName = tab.name
      },
      delectProject: function () {
        this.$confirm({
          title: '提示',
          content: '确认删除,删除后所有数据将清除?',
          onOk: async () => {
            await Server({
              url: 'api/project/delete',
              method: 'post',
              data: {
                id: +this.$route.query.id
              }
            })
            this.$router.replace({ path: '/projects/list' })
          }
        })
      }
    }
  }
</script>
