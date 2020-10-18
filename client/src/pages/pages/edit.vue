<template>
  <div v-if="!this.id || loadend">
    <a-form-model v-if="!this.id || form.name"
      ref="form" :model="form" :rules="rules" :label-col="{span: 3}"
      :wrapper-col="{span: 21}">
      <a-form-model-item label="页面图标">
        <UploadImage @ended="uploadEnd" :url="form.image | defaultProject" />
      </a-form-model-item>
      <a-form-model-item label="页面名称" prop="name">
        <a-input placeholder="页面名称" :maxlength="35" v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item label="描述" prop="desc">
        <a-input type="textarea" :maxlength="50" v-model="form.desc"></a-input>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
        <a-button type="primary" :loading="loading" @click="onSubmit">提交</a-button>
      </a-form-model-item>
    </a-form-model>
    <template v-if="noPower">
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
  import UploadImage from 'src/components/UploadImage'
  import Server from 'src/extend/Server'

  export default {
    mixins: [BasePage],
    components: { UploadImage },
    name: 'pagesEdit',
    data () {
      return {
        loading: false,
        noPower: false,
        loadend: false,
        id: +this.$route.query.id,
        form: {
          id: +this.$route.query.id,
          name: '',
          image: '',
          desc: '',
          projectId: ''
        },
        rules: {
          name: [
            { required: true, message: '输入1-35位页面名', trigger: 'blur' },
            { min: 1, max: 35, message: '长度在 1 到 35 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    mounted: function () {
      if (this.form.id) {
        this.getPageInfo()
      }
      this.form.projectId = +this.$route.query.projectId
    },
    methods: {
      uploadEnd: function (url) {
        this.form.image = url
      },
      getPageInfo: function () {
        Server({
          url: 'api/pages/detail',
          method: 'post',
          data: {
            id: this.form.id
          }
        }).then(({ data }) => {
          const _data = data.data
          this.form = {
            id: _data.id,
            image: _data.image,
            desc: _data.desc,
            name: _data.name,
            projectId: _data.projectId
          }
        }).catch(({ data }) => {
          if (data.code === -403) {
            this.noPower = true
          }
        }).finally(() => {
          this.loadend = true
        })
      },
      onSubmit: function () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true
            Server({
              url: 'api/pages/save',
              method: 'post',
              data: {
                ...this.form
              }
            }).then(() => {
              this.loading = false
              this.$message.success('提交成功')
              this.$router.back()
            })
          }
        })
      }
    }
  }
</script>
