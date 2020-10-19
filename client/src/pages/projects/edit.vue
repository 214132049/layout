<template>
  <a-form-model ref="form" :model="form" :rules="rules" :label-col="{span: 3}" :wrapper-col="{span: 21}">
    <a-form-model-item label="项目图标">
      <UploadImage @ended="uploadEnd" :url="form.image | defaultProject" />
    </a-form-model-item>
    <a-form-model-item label="管理员">
      {{ userInfo.email }}
    </a-form-model-item>
    <a-form-model-item label="项目名称" prop="name">
      <a-input placeholder="项目名称" :maxlength="35" v-model="form.name" />
    </a-form-model-item>
    <a-form-model-item label="描述" prop="desc">
      <a-input type="textarea" :maxlength="50" v-model="form.desc" />
    </a-form-model-item>
    <a-form-model-item label="项目成员" v-if="!id">
      <a-select mode="multiple" :value="form.member" placeholder="添加成员"  @change="addMember"
      >
        <a-select-option v-for="item in options" :key="item.id">
          {{ item.email }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
      <a-button type="primary" :loading="loading" @click="onSubmit">提交</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<style lang="stylus" scoped>

</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import UploadImage from 'src/components/UploadImage'
  import Server from 'src/extend/Server'

  export default {
    mixins: [BasePage],
    components: { UploadImage },
    name: 'projectsEdit',
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
      } else {
        this.findUser()
      }
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
          method: 'post',
          data: { id: +this.id }
        })
        const data = _data.data
        this.form = {
          image: data.image,
          name: data.name,
          member: data.member,
          desc: data.desc
        }
      },
      async findUser () {
        const { data } = await Server({
          url: '/api/user/find',
          method: 'get'
        })
        this.options = data.list.filter(({ id }) => id !== this.userInfo.id)
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
              data: {
                ...this.form,
                member: [...new Set([this.userInfo.id, ...this.form.member])],
                id: +this.id
              }
            })
            this.$message.success('提交成功')
            this.$router.push('/projects/list')
          } finally {
            this.loading = false
          }
        })
      },

    }
  }
</script>
