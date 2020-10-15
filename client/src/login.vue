<template>
  <div class="custom-page-class">
    <div class="main">
      <div class="switch-nav" @click="handleClick">
        {{activeName == 'login' ? '注册 →' : '登录 →'}}
      </div>
      <div class="form-box">
        <a-form ref="loginForm" :model="loginForm" :rules="registerrule" v-if="activeName === 'login'">
          <a-form-item label="" prop="account">
            <a-input placeholder="邮箱" type="text" auto-complete="on" id="username" name="username"
                      v-model="loginForm.account">
            </a-input>
          </a-form-item>
          <a-form-item label="" prop="password">
            <a-input placeholder="密 码" type="password" auto-complete="on" v-model="loginForm.password">
            </a-input>
          </a-form-item>
          <div class="submit-box">
            <a-button class="submit-box__btn" type="primary" :loading="loading" @click="loginSubmit">登 陆</a-button>
            <div style="float:right; cursor: pointer;" @click="forgetPassword">忘记密码？</div>
          </div>
        </a-form>
        <a-form ref="registerForm" :model="registerForm" :rules="registerrule" v-else>
          <a-form-item label="" prop="email">
            <a-input placeholder="邮箱" @blur="emailBlur" v-model="registerForm.email">
            </a-input>
          </a-form-item>
          <a-form-item label="" prop="name">
            <a-input placeholder="用 户 名" v-model="registerForm.name">
            </a-input>
          </a-form-item>
          <a-form-item label="" prop="password">
            <a-input placeholder="密 码" type="password" v-model="registerForm.password">
            </a-input>
          </a-form-item>
          <a-form-item label="" prop="password2">
            <a-input placeholder="确认密码" type="password" v-model="registerForm.password2">
            </a-input>
          </a-form-item>
          <div class="submit-box">
            <a-button class="submit-box__btn" type="primary" :loading="loading" @click="registerSubmit">注 册</a-button>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.custom-page-class {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
  width: 100%;
  height: 100%;
  background-color #fafafa;
  padding-top: 90px;
  .main {
    width: 400px;
    margin: 0 auto;
    background-color #fff;
    border: 1px solid #e9e9e9;
    border-radius 4px;
    padding: 40px 50px 48px;
    text-align center
    .switch-nav {
      color #409EFF
      cursor pointer
      text-align left
      font-size 18px;
      margin-bottom 10px;
    }
    .form-box {
      margin: 20px 0;
      text-align left
      .kaptchaImg {
        width: 80px;
        margin-left 5px
        background: #eee;
        cursor pointer
      }
      .submit-box {
        &__btn {
          width 100%
        }
        .forget {
          padding 10px 0
          text-align right
          color #409EFF
          cursor pointer
        }
      }
    }
  }
}
</style>
<script>
  import Server from './extend/Server'
  import config from './config'
  var SHA256 = require('crypto-js/sha256')

  export default {
    computed: {},
    data () {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        loading: false,
        registerrule: {
          kaptcha: [
            { required: true, message: '输入4位验证码', trigger: 'blur' },
            { min: 4, max: 4, message: '输入4位验证码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '输入用户名', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '6-20位大小写字母和._-组成的名称', trigger: 'blur' }
          ],
          password2: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ]
        },
        kaptchaImg: '',
        loginForm: {
          account: '',
          password: '',
          kaptcha: '',
          remember: true
        },
        registerForm: {
          email: '',
          kaptcha: '',
          name: '',
          password: '',
          password2: ''
        },
        activeName: 'login',
      }
    },
    mounted () {
      window.EMA.bind('logout', () => {
        this.logout()
      })
      window.EMA.bind('loading.show', () => {
        this.showLoading = true
      })
      window.EMA.bind('loading.hide', () => {
        this.showLoading = false
      })
      window.EMA.bind('alert.show', (title, fn) => {
        this.$alert(title, '注意', {
          callback: action => {
            if (typeof fn == 'function') {
              fn()
            }
          }
        })
      })
      const user = window.localStorage.getItem('loginuser') || '{}'
      let userInfo = {}
      try {
        userInfo = JSON.parse(user)
      } catch (e) {
        userInfo = {}
      }
      this.loginForm.account = userInfo.account
      this.loginForm.password = userInfo.password
    },
    methods: {
      forgetPassword () {
        if (!this.loginForm.account) {
          this.$alert('请输入账号')
          return
        }
        this.$confirm('确认忘记密码！请前往邮箱通过点击链接重置密码！', '忘记密码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.location.href = 'updatePassword.html'
        }).catch(() => {})
      },
      handleClick: function () {
        this.activeName = this.activeName === 'login' ? 'register' : 'login'
        this.resetForm()
      },
      loginSuccess: function (data) {
        window.location.replace('index.html')
      },
      loginSubmit () {
        this.$refs.loginForm.validate(async (valid) => {
          if (!valid) {
            return
          }
          this.loading = true
          try {
            await Server({
              url: 'users/login',
              data: {
                account: this.loginForm.account,
                kaptcha: this.loginForm.kaptcha,
                password: SHA256(this.loginForm.password) + ''
              },
              needLoading: true,
              method: 'post'
            })
            window.localStorage.setItem('loginuser', JSON.stringify({
              account: this.loginForm.account,
              password: this.loginForm.password
            }))
            this.loginSuccess()
          } finally {
            this.loading = false
          }
        })
      },
      emailBlur: function () {
        var name = this.registerForm.email.split('@')
        this.registerForm.name = name[0]
      },
      /**
       * 注册内容提交
       */
      registerSubmit: function () {
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            this.loading = true
            Server({
              url: 'api/users/register',
              data: {
                email: this.registerForm.email,
                kaptcha: this.registerForm.kaptcha,
                name: this.registerForm.name,
                password: SHA256(this.registerForm.password) + ''
              },
              method: 'post'
            }).then((response) => {
              this.loginSuccess()
            }).catch((e) => {
              this.loading = false
              console.log('err', e)
            })
          } else {
            return false
          }
        })
      },
      resetForm () {
        const form = this.activeName === 'login' ? 'registerForm' : 'loginForm'
        this.$refs[form].resetFields()
      }
    }
  }
</script>
