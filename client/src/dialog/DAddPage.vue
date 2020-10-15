<template>
  <a-dialog :title="title" :visible.sync="Visible" @close="close">
    <div class="content">
      <a-form laba-width="80px" :model="form" :rules="rules" ref="ruleForm">
        <div class="base">
          <h4>基础信息</h4>
          <a-form-item label="所属项目">
            <a-select v-model="form.projectId" placeholder="请选择" class="projectSelect">
              <a-option v-for="item in myProjects" :key="item.id" :label="item.groupName+'/'+item.projectName" :value="item.id">
                <span style="float: left">{{ item.groupName+'/'+item.projectName }}</span>
              </a-option>
            </a-select>
          </a-form-item>
          <a-row type="flex" :gutter="0">
            <a-col :span="24">
              <a-form-item label="页面标题" prop="name">
                <a-input v-model="form.name"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="描述" prop="desc">
            <a-input type="textarea" placeholder="该页面的简要描述1-50个字" :minlength="1" :maxlength="50" v-model.trim="form.desc"></a-input>
          </a-form-item>
          <a-form-item label="页面类型">
            <a-select label="页面类型" v-model="form.type" placeholder="请选择">
              <a-option
                v-for="item in pageType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="设为模板">
            <a-radio-group v-model="form.visibilitylevel">
              <a-radio :label="0">否</a-radio>
              <a-radio :label="1">是</a-radio>
            </a-radio-group>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <a-button @click="close">取消</a-button>
      <a-button type="primary" @click="addPageInfo('ruleForm')">确定添加，编辑详情</a-button>
    </div>
  </a-dialog>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .content {
    .projectSelect {
      width: 100%;
    }

    .info {
      position: relative;

      .desc {
        padding: 10px;
      }

      .time {
        position: absolute;
        bottom: -15px;
        right: 0;
      }
    }

    .doc {
      max-height: 400px;
      overflow: auto;
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseDialog from 'src/extend/BaseDialog'
  import Server from 'src/extend/Server'
  import { mapState } from 'vuex'

  export default {
    mixins: [BaseDialog],
    name: 'DAddPage',
    data () {
      return {
        Visible: true,
        formLabelWidth: '150px',
        myProjects: [],
        form: {
          name: '',
          desc: '',
          type: '0',
          visibilitylevel: 0,
          projectId: 0
        },
        rules: {
          name: [{ required: true, message: '请输入页面标题', trigger: 'blur' }],
          desc: [{ required: false, message: '请输入描述内容', trigger: 'blur' }]
        }
      }
    },
    computed: mapState({
      pageType: state => state.Metadata.pageType
    }),
    watch: {},
    mounted () {
      this.getGrops()
      this.form.projectId = this.form.projectId - 0
    },
    methods: {
      getGrops: function () {
        Server({
          url: 'project/project',
          method: 'get',
          needLoading: true,
          params: {
            count: 100,
            start: 0
          }
        }).then((response) => {
          var data = response.data.data
          this.myProjects = data
          if (data.length == 0) {
            // 如果没有项目。提示前往添加项目
            this.$confirm('你还没有任何项目，添加页面前需要先添加项目：前往添加项目', '提示', {
              type: 'warning'
            }).then(() => {
              this.close()
              this.$router.push({ path: '/projects/new' })
            }).catch(() => {
              this.$message('已取消')
            })
          }
        }).catch(() => {
        })
      },
      addPageInfo (ruleForm) {
        const me = this
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            Server({
              url: 'api/pages/save',
              method: 'post',
              needLoading: true,
              trimNull: false,
              data: {
                ...me.form
              }
            }).then((res) => {
              me.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
              me.close()
              this.ema.fire('projects_cdoc.pageAddSuccess')
            })
          }
        })
      }
    }
  }
</script>
