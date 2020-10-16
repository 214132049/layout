<template>
  <div class="content-wrapper">
    <h2 class="blank-state blank-state-welcome welcome">
      欢迎使用 {{packageInfo.description}}
    </h2>
    <div class="cont">
      <div class="blank-state cont_blank">
        <div class="blank-state-icon">
          <i class="ifont icon-project"></i>
        </div>
        <h3 class="blank-state-title">
          请先创建自己的项目
        </h3>
        <router-link class="btn btn-new" to="/projects/new">新建项目
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .content-wrapper {
    text-align center
    .welcome {
      padding 60px 0
    }
    .cont {
      display flex
      .cont_blank {
        flex 1
        & >>> .blank-state-text {
          margin-bottom 0
        }
        .btn {
          margin-top 20px
        }
        .compImg {
          width 56px
          height 56px
        }
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  import { numberSplit } from '../extend/Util'

  export default {
    mixins: [BasePage],
    name: 'home',
    data () {
      return {
        pageCount: ''
      }
    },
    mounted () {
      this.getPageCount()
    },
    methods: {
      getPageCount () {
        Server({
          url: 'api/pages/count',
          method: 'get',
        }).then(({ data }) => {
          const result = data && data.data && data.data.count
          this.pageCount = numberSplit(result) || ''
        })
      }
    }
  }
</script>
