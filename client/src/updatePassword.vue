<template>
  <a-locale-provider :locale="locale">
    <div class="findPassword">
      <div class="main">
        <h4>重置密码</h4>
        <a-form-model ref="passwordForm" :model="form" :rules="passwordRule" :label-col="{span: 6}" :wrapper-col="{span: 18}" class="form">
          <a-form-model-item label="用户邮箱" prop="email">
            <a-input placeholder="请输入新密码" type="email" v-model="form.email" />
          </a-form-model-item>
          <a-form-model-item label="新密码" prop="password">
            <a-input placeholder="请输入新密码" type="password" v-model="form.password" />
          </a-form-model-item>
          <a-form-model-item label="确认密码" prop="password2">
            <a-input placeholder="确认密码" type="password" v-model="form.password2" />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 18, offset: 6 }">
            <a-button type="primary" @click="updatePassword">提交</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
  </a-locale-provider>
</template>

<style lang="stylus" scoped>
.findPassword
  width: 100%;
  height: 100%;
  background-color #fafafa;
  padding-top: 90px;
  .main
    width: 400px;
    margin: 0 auto;
    background-color #fff;
    border-radius 4px;
    padding: 40px 50px 48px;
    text-align center
    .form
      margin: 20px 0;
      text-align left
</style>

<script type="text/ecmascript-6">
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import Server from './extend/Server'
  var SHA256 = require('crypto-js/sha256')
  const config = require('src/config')

  export default {
    components: {},
    data () {
      var validatePass2 = (rule, value, callback) => {
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        locale: zhCN,
        form: {
          email: '',
          password: '',
          password2: ''
        },
        passwordRule: {
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          password: [
            { required: true, message: '输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '6-20位大小写字母和._-组成的名称', trigger: 'blur' }
          ],
          password2: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      }
    },
    mounted () {},
    methods: {
      updatePassword () {
        this.$refs.passwordForm.validate(async (valid) => {
          if (!valid) {
            return
          }
          Server({
            url: 'api/user/update',
            data: {
              email: this.form.email,
              password: SHA256(this.form.password) + ''
            },
            method: 'post'
          }).then((res) => {
            this.$success({
              content: '密码设置成功！',
            }).then(() => {
              window.location.replace(config.ADMIN_PATH + 'login.html')
            })
          })
        })
      }
    }
  }
</script>
