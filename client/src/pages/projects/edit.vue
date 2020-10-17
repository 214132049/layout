<template>
  <div class="project-edit-container">
    <div class="row prepend-top-default">
      <div class="col-lg-3 profile-settings-sidebar">
        {{ id ? '更新项目' : '新建项目' }}
      </div>
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="{span: 3}" :wrapper-col="{span: 21}">
        <a-form-model-item label="项目图标">
          <UploadImage @ended="uploadEnd"/>
        </a-form-model-item>
        <a-form-model-item label="项目名称" prop="name">
          <a-input placeholder="项目名称" :maxlength="35" v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="描述" prop="desc">
          <a-input type="textarea" :maxlength="50" v-model="form.desc" />
        </a-form-model-item>
        <a-form-model-item label="项目成员" prop="member">
          <a-select mode="multiple" :value="form.member" placeholder="添加成员"  @change="addMember"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="item in options" :key="item.id">
              {{ item.email }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
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

  export default {
    mixins: [BasePage],
    components: { UploadImage },
    name: 'projects_cnew',
    data () {
      return {
        loading: false,
        options: [],
        form: {
          image: '',
          name: '',
          member: [],
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '输入1-35位项目名', trigger: 'blur' },
            { min: 1, max: 35, message: '长度在 1 到 35 个字符', trigger: 'blur' }
          ],
          desc: [
            { required: true, message: '输入描述', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          member: [
            { type: 'array', required: true, min: 1, message: '请添加成员', trigger: 'change' },
          ]
        }
      }
    },
    computed: {
      id () {
        return this.$route.query.id
      }
    },
    watch: {
      '$store.state.userInfo': {
        handler (val) {
          if (!val || !val.id) return
          this.form.member.splice(0, 0, val.id)
        },
        immediate: true
      }
    },
    mounted: function () {
      if (this.id) {
        this.getProjectInfo()
      }
      this.findUser()
    },
    methods: {
      addMember (value) {
        this.form.member = value
      },
      uploadEnd (url) {
        this.form.image = url
      },
      async getProjectInfo () {
        const { data: _data } = await Server({
          url: 'api/project/info',
          method: 'get',
          data: { id: this.id }
        })
        const data = _data.data
        this.form = {
          image: data.image,
          name: data.projectName,
          member: data.member,
          desc: data.desc
        }
      },
      async findUser () {
        const { data } = await Server({
          url: '/api/user/find',
          method: 'get'
        })
        this.options = data.list
      },
      onSubmit () {
        this.$refs.form.validate(async valid => {
          if (!valid) {
            return
          }
          this.loading = true
          try {
            await Server({
              url: 'api/project/save',
              method: 'post',
              data: { ...this.form, id: this.id }
            })
            this.$message.success('提交成功')
          } finally {
            this.loading = false
          }
        })
      },

    }
  }
</script>
