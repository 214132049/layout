<template>
  <div class="content-wrapper">
    <div class="alert-wrapper">
      <div class="flash-container flash-container-page">
      </div>
    </div>
    <div class="mfullpage">
      <div class="content" id="content-body">
        <div class="section">
          <div class="blank-state blank-state-welcome welcome">
            <h2 class="blank-state-welcome-title">
              欢迎加入 {{packageInfo.description}}
            </h2>
            <p class="blank-state-text">
              一个快速生成页面的编辑器
            </p>
          </div>
          <div class="cont">
            <div class="blank-state cont_blank">
              <div class="blank-state-icon">
                <i class="ifont icon-group"></i>
              </div>
              <h3 class="blank-state-title">
                创建团队，管理自己的项目
              </h3>
              <p class="blank-state-text">
                所有的项目都在每个团队中，便于管理自己的项目
              </p>
              <router-link class="btn btn-new" to="groups/new">创建团队
              </router-link>
            </div>
            <div class="blank-state cont_blank">
              <div class="blank-state-icon">
                <i class="ifont icon-project"></i>
              </div>
              <h3 class="blank-state-title">
                创建自己的项目
              </h3>
              <router-link class="btn btn-new" to="/projects/new">新建项目
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .mfullpage >>> .fp-tableCell {
    height 100%
    vertical-align: inherit;
  }
  .welcome {
    padding 100px 0
  }
  .cont {
    padding-top 100px
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
  .pd50 {
    padding-bottom: 50px;
  }

  .box-card {
    height: calc(47% - 25px);
    width: 49%;
    margin: 1% 0.5% 0;
    box-shadow:none;
    &:nth-child(2n) {
      float: right;
    }

    &:nth-child(2n+1) {
      float: left;
    }
  }

  .sum-title {
    font-size: 25px;
    font-weight: lighter;
    line-height: 1;
    margin-top: 37px;
    text-align: right;
    margin-bottom: 5px;
    color: #666;
  }

  .sum-num {
    font-size: 21px;
    color: #0091fd;
    text-align: right;
    white-space: nowrap;
  }

  .card-title {
    text-align: center;
  }

  .mchart {
    float: left;
    height: 100%;
    width: 100%;
  }

  .section {
    position: relative;
  }

  .arrow-down {
    position: absolute;
    bottom: 10%;
    left: 50%;
    cursor: pointer;
    margin-left: -25px;
    width: 50px;
    height: 50px;
    background-image: url('../assets/image/Arrow_Down.png');
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
    opacity: 0.5;
    animation: pageDown 1.4s ease-in-out infinite;
  }

  @keyframes pageDown {
    0% {
      transform: translateY(0%);
    }

    50% {
      transform: translateY(40%);
    }

    100% {
      transform: translateY(0);
    }
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  import { baiduTongjiAjax, numberSplit, combineTongjiData, splitTrendData } from '../extend/Util'
  const config = require('../config')

  var pages

  export default {
    mixins: [BasePage],
    name: 'home',
    data () {
      return {
        todayData: [],
        historyTrend: {},
        todayEntries: [],
        todayTrend: {},
        pageCount: '',
        chartHeight: 0
      }
    },
    async mounted () {
      // eslint-disable-next-line
      pages = new window.fullpage('#content-body', {
        autoScrolling: true,
        navigation: true,
        licenseKey: null,
        scrollHorizontally: true
      })
      Promise.all([this.makeHeight(), this.getTodayDataByES(), this.getHistoryTrendByES(), this.getTodayEntriesByES(), this.getTodayTrendByES(), this.getPageCount()])
    },
    methods: {
      async makeHeight () {
        await this.$nextTick()
        this.chartHeight = this.$refs['box-card'].$el.clientHeight - 40 + 'px'
      },
      async getTodayDataByES () {
        var result
        var query = {
          appId: 'tview'
        }
        result = await Server({
          url: 'statistics/getTodayOutline',
          method: 'post',
          data: query
        }).then(({ data }) => {
          return data.data || {}
        }).catch(() => {
        })
        var now = Date.now()
        var todayStart = now - (now + 8 * 3600000) % 86400000
        var yesterdayStart = todayStart - 86400000
        var viewtimes = {
          today: await this.getViewTime('', [todayStart, now]),
          yesterday: await this.getViewTime('', [yesterdayStart, todayStart]),
          yesterdayNow: 'n/a',
          avg: await this.getViewTime('', [new Date('2018/12/01').getTime()]),
        }
        result.map(n => {
          n.viewtime = viewtimes[n.key]
        })
        result.byES = 1
        this.todayData = result
      },
      async getPageCount () {
        var result = await Server({
          url: 'editor/pages/count',
          method: 'get',
        })
          .then(({ data }) => {
            return data && data.data && data.data.count
          })
        this.pageCount = numberSplit(result) || ''
      },
      async getNameByKeys (ids) {
        const names = await Server({
          url: 'editor/pages/getNameBykeys',
          method: 'post',
          data: {
            ids,
          }
        }).then(({ data }) => {
          return data && data.data && data.data.names
        })
        return names
      },
    },
    beforeDestroy () {
      pages.destroy('all')
    }
  }
</script>
