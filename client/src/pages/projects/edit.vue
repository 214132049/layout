<template>
  <div class="project-edit-container">
    <div class="row prepend-top-default">
      <div class="col-lg-3 profile-settings-sidebar">
        {{ id ? '更新项目' : '新建项目' }}
      </div>
      <a-form-model ref="form" :model="form" laba-width="80px" :rules="rules">
        <a-form-model-item label="项目图标">
          <div class="headIcon">
            <img :src="form.image|defaultProject">
          </div>
          <upload accept="image" :showBtn="true" :auto="true" @uploadSuccess="uploadEnd"></upload>
        </a-form-model-item>
        <a-form-model-item label="项目名称" prop="name">
          <a-input placeholder="项目名称" :maxlength="35" v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="描述" prop="desc">
          <a-input type="textarea" :maxlength="50" v-model="form.desc" />
        </a-form-model-item>
        <a-form-model-item label="项目成员" prop="groupId">
          <a-select v-model="form.groupId" filterable placeholder="请选择">
            <a-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
              {{ item.name }}
            </a-option>
          </a-select>
          <a-button type="text" @click="addMember">添加成员</a-button>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" :loading="loading" @click="onSubmit">提交</a-button>
        </a-form-model-item>
      </a-form-model>
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
    height: 150px;
    // border-radius: 50%;
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
  import Upload from 'src/components/Upload'
  import Server from 'src/extend/Server'

  export default {
    mixins: [BasePage],
    components: { Upload },
    name: 'projects_cnew',
    data () {
      return {
        // 一个典型列表数据格式
        loading: false,
        options: [],
        value: '',
        form: {
          visibilitylevel: 0,
          image: '',
          name: '',
          groupId: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true,message: '输入1-35位项目名', trigger: 'blur' },
            { min: 1, max: 35, message: '长度在 1 到 35 个字符', trigger: 'blur' }
          ],
          desc: [
            { required: true,message: '输入描述', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      id () {
        return this.$route.query.id
      }
    },
    mounted: function () {
      if (this.id) {
        this.getProjectInfo()
      }
    },
    methods: {
      addMember () {

      },
      uploadEnd: function (url) {
        this.form.image = url
      },
      getProjectInfo: function () {
        Server({
          url: '/api/project/info',
          method: 'get',
          data: { id: this.id }
        }).then((response) => {
          var data = response.data.data
          this.form = {
            image: data.image,
            name: data.projectName,
            groupId: data.groupId,
            desc: data.desc,
            ddwebhook: data.ddwebhook,
            visibilitylevel: data.visibilitylevel
          }
        })
      },
      getAllUsers: function () {
        Server({
          url: '/api/user/find',
          method: 'get',
          params: {
            type: 0,
            start: 0,
            count: 100
          }
        }).then((response) => {
          this.options = response.data.data
        })
      },
      onSubmit: function () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.id) {
              Server({
                url: 'project/project',
                method: 'put',
                data: { ...this.form, id: this.id }
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
              Server({
                url: 'project/project',
                method: 'post',
                data: this.form
              }).then((response) => {
                this.loading = false
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/dashboard/projects'
                })
              }).catch(() => {
                this.loading = false
              })
            }
          } else {
            this.$message('信息填写错误')
            return false
          }
        })
      }
    }
  }
</script>
