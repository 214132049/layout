<template>
  <a-tabs default-active-key="1">
    <a-tab-pane key="1" tab="基本信息">
      <a-form-model ref="baseForm" :model="form" :rules="rules" laba-width="80px">
        <a-form-model-item label="头 像">
          <UploadImage @ended="uploadEnd" :url="form.photo | defaultHeader" />
        </a-form-model-item>
        <a-form-model-item label="邮 箱" prop="email">
          <a-input placeholder="邮箱" :disabled="!!form.email" v-model="form.email">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="姓 名" prop="name">
          <a-input placeholder="姓名" v-model="form.name">
          </a-input>
        </a-form-model-item>
<!--        <a-form-model-item label="token" prop="security" :rules="[-->
<!--          { message: '输入1-35位token', trigger: 'blur'},-->
<!--          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }-->
<!--          ]">-->
<!--          <a-input placeholder="token" :maxlength="64" v-model="form.security" disabled>-->
<!--            <a-button slot="append" @click="makeSecurity">随机生成</a-button>-->
<!--          </a-input>-->
<!--          <div class="desc">-->
<!--            <div>创建组件等场景需使用token</div>-->
<!--          </div>-->
<!--        </a-form-model-item>-->
        <a-form-model-item>
          <a-button type="primary" @click="baseSubmit">修改</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-tab-pane>
    <a-tab-pane key="2" tab="密码修改">
      <a-form-model ref="passwordForm" :model="passform" :rules="rules" laba-width="100px">
        <a-form-model-item label="新密码" prop="targetPassword">
          <a-input type="password" placeholder="新密码" v-model="passform.targetPassword">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="确认密码" prop="targetPassword2">
          <a-input type="password" placeholder="确认密码" v-model="passform.targetPassword2">
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="passSubmit">确认修改</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-tab-pane>
  </a-tabs>
</template>

<style lang="stylus" scoped>
  .desc{
    color: #E6A23C
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import UploadImage from 'src/components/UploadImage'
  import Server from 'src/extend/Server'

  const SHA256 = require('crypto-js/sha256')
  const MD5 = require('crypto-js/md5')

  export default {
    mixins: [BasePage],
    components: { UploadImage },
    name: 'profile',
    data () {
      const targetPassword2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.passform.targetPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }

      return {
        loading: false,
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          targetPassword: [
            { required: true, message: '输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '6-20位大小写字母和._-组成的名称', trigger: 'blur' }
          ],
          targetPassword2: [
            { required: true, message: '再次输入密码', trigger: 'blur' },
            { validator: targetPassword2, trigger: 'blur' }
          ]
        },
        passform: {
          targetPassword: '',
          targetPassword2: ''
        },
        form: {
          email: '',
          photo: '',
          name: '',
          // security: ''
        }
      }
    },
    watch: {
      userInfo: {
        handler () {
          this.form.name = this.userInfo.name
          this.form.email = this.userInfo.email
          this.form.photo = this.userInfo.photo
        },
        immediate: true
      }
    },
    mounted: function () {
      if (this.userInfo.security) {
        this.form.security = this.userInfo.security
      }
    },
    methods: {
      makeSecurity () {
        const len = 64
        const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
        const maxPos = $chars.length
        let pwd = ''
        for (var i = 0; i < len; i++) {
          pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
        }
        this.form.security = pwd
      },
      uploadEnd: function (url) {
        this.form.photo = url
      },
      baseSubmit: function () {
        this.$refs.baseForm.validate((valid) => {
          if (valid) {
            Server({
              url: 'api/user/update',
              data: this.form,
              method: 'post'
            }).then((response) => {
              this.$message.success('修改成功')
              this.$store.dispatch('initUserInfo', this.form)
            }).catch((e) => {
              this.$message.error('修改失败')
            })
          } else {
            return false
          }
        })
      },
      passSubmit: function () {
        this.$refs.passwordForm.validate((valid) => {
          if (valid) {
            Server({
              url: 'api/user/update',
              data: {
                password: SHA256(this.passform.targetPassword) + ''
              },
              method: 'post'
            }).then((response) => {
              this.$message.success('修改成功')
              this.$refs.passwordForm.resetFields()
              this.ema.fire('logout')
            }).catch((e) => {
              this.$message.error('修改失败')
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
