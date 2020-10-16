<template>
  <div class="content-wrapper">
    <router-link to="/projects/edit">
      <a-button type="primary">添加项目</a-button>
    </router-link>
    <ul class="projects-list content-list" v-if="hasMyData">
      <router-link
        class="card"
        v-for="item in myProjects"
        :key="item.id"
        :to="{path:'/projects/detail', query:{id:item.id}}"
        tag="li">
        <div class="img">
          <img :src="item.image|defaultProject" class="image">
        </div>
        <div class="cardContent">
          <div class="title">
            {{item.projectName}}
          </div>
          <div class="time">{{item.createTime | datetime}}</div>
        </div>
      </router-link>
    </ul>
    <a-empty style="margin-top: 100px;" description="暂无项目" v-else />
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .content-wrapper
    .icon-empty
      font-size: 30px;
  .card {
    float: left;
    margin: 10px;
    width: 200px;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    transition: transform 0.4s ease
    &:hover {
      cursor: pointer;
      box-shadow: 0 0 10px 0 rgba(0,0,0,.16);
      transform: translate3d(0,-2px,0);
    }
    .cardContent {
      .title {
        padding: 10px 10px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #333;
        letter-spacing: 0;
        line-height: 18px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        padding: 0 10px 8px 10px;
        font-family: PingFangSC-Light;
        font-size: 14px;
        color: #898c93;
        letter-spacing: 0;
        line-height: 14px;
      }
      .desc {
        padding: 5px 10px;
      }
    }

    .img {
      width 200px
      height 200px
      .image {
        width 200px
        height 200px
        z-index: 0;
        top: 0;
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
  }
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
        myProjects: {},
      }
    },
    mounted: function () {
      this.loadMyProject()
    },
    computed: {
      hasMyData: function () {
        return Object.keys(this.myProjects).length > 0
      }
    },
    methods: {
      loadMyProject: function () {
        Server({
          url: '/api/project/list',
          method: 'post',
          needLoading: true,
          data: {
            count: 100,
            start: 0
          }
        }).then((response) => {
          this.myProjects = response.data.data || []
        })
      }
    }
  }
</script>
