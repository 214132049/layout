<template>
  <a-locale-provider :locale="locale">
    <div class="custom-page-class">
      <div class="main">
        <div class="switch-nav" @click="handleClick">
          {{activeName === 'login' ? '注册 →' : '登录 →'}}
        </div>
        <div class="form-box">
          <a-form-model ref="loginForm" :model="loginForm" :rules="registerrule" v-if="activeName === 'login'">
            <a-form-model-item label="" prop="email">
              <a-input placeholder="邮箱" type="text" auto-complete="on" id="username" name="username"
                        v-model="loginForm.email">
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="" prop="password">
              <a-input placeholder="密 码" type="password" auto-complete="on" v-model="loginForm.password">
              </a-input>
            </a-form-model-item>
            <div class="submit-box">
              <a-button class="submit-box__btn" type="primary" :loading="loading" @click="loginSubmit">登 陆</a-button>
              <a-button type="link" @click="forgetPassword">忘记密码？</a-button>
            </div>
          </a-form-model>
          <a-form-model ref="registerForm" :model="registerForm" :rules="registerrule" v-else key="registerForm">
            <a-form-model-item label="" prop="email">
              <a-input placeholder="邮箱" @blur="emailBlur" v-model="registerForm.email">
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="" prop="name">
              <a-input placeholder="用 户 名" v-model="registerForm.name">
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="" prop="password">
              <a-input placeholder="密 码" type="password" v-model="registerForm.password">
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="" prop="password2">
              <a-input placeholder="确认密码" type="password" v-model="registerForm.password2">
              </a-input>
            </a-form-model-item>
            <div class="submit-box">
              <a-button class="submit-box__btn" type="primary" :loading="loading" @click="registerSubmit">注 册</a-button>
            </div>
          </a-form-model>
        </div>
      </div>
    </div>
  </a-locale-provider>
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
    border-radius 4px;
    padding: 40px 50px 48px;
    text-align center
    .switch-nav {
      color #409EFF
      cursor pointer
      text-align left
      font-size 14px;
      margin-bottom 10px;
    }
    .form-box {
      margin: 20px 0;
      text-align left
      .submit-box {
        &__btn {
          width 100%
        }
      }
    }
  }
}
</style>
<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import Server from './extend/Server'
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
        locale: zhCN,
        registerrule: {
          name: [
            { required: true, message: '输入用户名', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
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
        loginForm: {
          email: '',
          password: ''
        },
        registerForm: {
          email: '',
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
        this.$error({
          title: '注意',
          content: title,
          onOk () {
            typeof fn == 'function' && fn()
          },
        })
      })
    },
    methods: {
      forgetPassword () {
        window.location.href = '/updatePassword'
      },
      handleClick: function () {
        this.activeName = this.activeName === 'login' ? 'register' : 'login'
        this.resetForm()
      },
      loginSuccess: function (response) {
        window.localStorage.setItem('token', response.data.token)
        window.location.replace('/')
      },
      loginSubmit () {
        this.$refs.loginForm.validate(async (valid) => {
          if (!valid) {
            return
          }
          this.loading = true
          try {
            const response = await Server({
              url: 'api/user/login',
              data: {
                email: this.loginForm.email,
                password: SHA256(this.loginForm.password) + ''
              },
              needLoading: true,
              method: 'post'
            })
            this.loginSuccess(response)
          } finally {
            this.loading = false
          }
        })
      },
      emailBlur: function () {
        const name = this.registerForm.email.split('@')
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
              url: 'api/user/register',
              data: {
                email: this.registerForm.email,
                name: this.registerForm.name,
                password: SHA256(this.registerForm.password) + ''
              },
              method: 'post'
            }).then((response) => {
              this.loginSuccess(response)
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
