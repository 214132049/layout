<template>
  <div class="project-edit-container">
    <div class="row prepend-top-default">
      <div class="col-lg-3 profile-settings-sidebar">
        {{ id ? '更新页面' : '新建页面' }}
      </div>
      <div class="col-lg-9">
        <a-form ref="form" :model="form" laba-width="80px">
          <a-form-item label="图标">
            <UploadImage @ended="uploadEnd"/>
          </a-form-item>
          <a-form-item label="页面名称" prop="name" :rules="[
                        { required: true,message: '输入1-35位页面名', trigger: 'blur'},
                        { min: 1, max: 35, message: '长度在 1 到 35 个字符', trigger: 'blur' }
                        ]">
            <a-input placeholder="页面名称" :maxlength="35" v-model="form.name">
            </a-input>
          </a-form-item>
          <a-form-item label="页面key" prop="key" :rules="[
                        { required: true,message: '输入1-35位页面名', trigger: 'blur'}
                        ]">
            <a-input placeholder="页面名称" v-model="form.key">
            </a-input>
          </a-form-item>
          <a-form-item label="描述" prop="description" :rules="[{ required: false,message: '输入描述', trigger: 'blur'},
                                { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]">
            <a-input type="textarea" :maxlength="50" v-model="form.desc"></a-input>
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
          <a-form-item>
            <a-button type="primary" :loading="loading" @click="onSubmit">提交</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .group-img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    float: right;
    position: relative;
    bottom: 5px;
  }

  .desc {
    line-height: 15px;
    margin: 5px;
    padding: 5px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 3px;
  }

  .headIcon {
    width: 150px;
    height: 250px;
    overflow: hidden;
    margin: 20px;
    background: url('~src/assets/image/header/default.png');
    background-size: 100% 100%;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import UploadImage from 'src/components/UploadImage'
  import Server from 'src/extend/Server'
  import { mapState } from 'vuex'

  export default {
    mixins: [BasePage],
    components: { UploadImage },
    name: 'pages_cnew',
    props: {
      id: { // 页面id
        type: Number
      },
      info: {
        type: Object
      }
    },
    data () {
      return {
        // 一个典型列表数据格式
        loading: false,
        myProjects: [],
        form: {
          id: '',
          key: '',
          name: '',
          type: '0',
          image: '',
          desc: '',
          projectId: '',
          visibilitylevel: 0
        }
      }
    },
    computed: mapState({
      pageType: state => state.Metadata.pageType
    }),
    mounted: function () {
      if (this.id) {
        this.getProjectInfo()
      }
      this.getGrops()
    },
    methods: {
      uploadEnd: function (url) {
        this.form.image = url
      },
      getProjectInfo: function () {
        Server({
          url: 'api/pages/info',
          method: 'post',
          data: { id: this.id + '' }
        }).then((response) => {
          var data = response.data.data
          this.form = {
            id: data.id,
            key: data.key,
            image: data.image,
            type: data.type,
            desc: data.desc,
            name: data.name,
            projectId: data.projectId,
            visibilitylevel: data.visibilitylevel,
          }
        })
      },
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
        }).catch(() => {
        })
      },
      onSubmit: function () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true
            Server({
              url: 'api/pages/save',
              method: 'post',
              data: { ...this.form }
            }).then((response) => {
              this.loading = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
              })
            }).catch(() => {
              this.loading = false
              this.$notify({
                itle: '警告',
                message: '修改失败',
                type: 'warning'
              })
            })
          } else {
            this.$message('信息填写错误')
            return false
          }
        })
      }
    }
  }
</script>
