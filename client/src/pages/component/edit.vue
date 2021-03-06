<template>
  <div v-if="!this.id || loadend">
    <a-form-model ref="form" v-if="!this.id || form.name" :model="form" :label-col="{span: 3}" :wrapper-col="{span: 21}">
      <a-form-model-item label="名称" prop="name">
        <a-input placeholder="名称" :maxlength="35" v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item label="上传组件">
        <a-upload accept=".zip" action="" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
          <a-button><a-icon type="upload" />开始上传</a-button>
        </a-upload>
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
  import Server from 'src/extend/Server'
  import JSZip from 'jszip'

  export default {
    mixins: [BasePage],
    data () {
      const id = this.$route.query.id
      return {
        loading: false,
        noPower: false,
        loadend: false,
        id: id ? +id : '',
        form: {
          id: id ? +id : '',
          name: '',
          npmVersion: '',
          npmName: '',
        },
        fileList: []
      }
    },
    mounted: function () {
      if (this.id) {
        this.getDetail()
      }
      this.form.projectId = +this.$route.query.projectId
    },
    methods: {
      getDetail: function () {
        Server({
          url: 'api/component/detail',
          method: 'post',
          data: {
            id: this.id
          }
        }).then(({ data }) => {
          this.form = data.data
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
            const form = { ...this.form }
            const formData = new FormData()
            for (const prop in form) {
              formData.append(prop, form[prop])
            }
            formData.append('file', this.fileList[0])
            Server({
              url: 'api/component/save',
              method: 'post',
              headers: {
                'content-type': 'Multipart/form-data'
              },
              data: formData
            }).then(() => {
              this.loading = false
              this.$message.success('提交成功')
              this.$router.back()
            }).catch(() => {
              this.loading = false
            })
          }
        })
      },
      handleRemove () {
        this.fileList = []
      },
      async beforeUpload (file) {
        const isZip = new RegExp('.zip').test(file.name)
        if (!isZip) {
          this.$message.error('只能上传zip包')
        }
        await this.upZip(file)
        this.fileList = [file]
        return false
      },
      async upZip (data) {
        const zip = new JSZip()
        const zipInfo = await zip.loadAsync(data)
        const pkg = zipInfo.files['package.json']
        if (pkg) {
          const content = await pkg.async('string')
          if (!content) return false
          const { name, version } = JSON.parse(content)
          this.form.npmName = name
          this.form.npmVersion = version
        } else {
          this.$message.error('缺少package.json文件')
          return false
        }
        return true
      },
    }
  }
</script>
