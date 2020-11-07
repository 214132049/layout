import getPostConfig from './getPostConfig'
import createFormItemCode from './createFormItemCode'

const allOptions = []

function craeteOptions (model, optionsFn) {
  const name = `${model}Options`
  console.log(name)
  allOptions.push({
    name,
    fn: optionsFn || null
  })
  return name
}

function createFormItem (list) {
  const _tempList = getPostConfig(list)
  return createFormItemCode(_tempList, craeteOptions)
}

function generateModels (list) {
  const models = {}
  list.forEach(item => {
    const key = item.model
    if (item.type === 'checkbox' || item.type === 'dateRangePicker') {
      models[key] = []
    } else {
      models[key] = ''
    }
  })
  return models
}

function generateRules (list) {
  const rules = {}
  list.forEach(item => {
    const key = item.model
    const value = []
    const {required, dataType, pattern} = item.options
    if (required && required.value) {
      value.push({ required: true, message: required.message })
    }
    if (dataType && dataType.value) {
      value.push({ type: dataType.value, message: dataType.message })
    }
    if (pattern && pattern.value) {
      value.push({ pattern: pattern.value, message: pattern.message })
    }
    rules[key] = value
  })
  return rules
}

export default function (data, name) {
  const template = `<a-form-model ref="generateForm" :model="models" :rules="rules" label-align="${data.config.labelAlign}" :label-col='${JSON.stringify(data.config.labelCol)}' :wrapper-col='${JSON.stringify(data.config.wrapperCol)}'>
    ${createFormItem(data.list)}
    <a-form-model-item :wrapper-col='${JSON.stringify({ ...data.config.wrapperCol, offset: data.config.labelCol.span })}'>
      <a-button @click="handleSubmit" type="primary">提交</a-button>
    </a-form-model-item>
  </a-form-model>`

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
      <title>${name}</title>
      <link href="https://cdn.bootcdn.net/ajax/libs/ant-design-vue/1.6.5/antd.min.css" rel="stylesheet">
    </head>
    <body>
      <div id="app">
        <page-demo />
      </div>
      <script src="https://cdn.bootcdn.net/ajax/libs/babel-polyfill/7.12.1/polyfill.min.js"></script>
      <script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.js"></script>
      <script src="https://cdn.bootcdn.net/ajax/libs/ant-design-vue/1.6.5/antd.min.js"></script>
      <script>
        Vue.component('page-demo', {
          template: \`${template}\`,
          data () {
            return {
              models: ${JSON.stringify(generateModels(data.list), null, 2)},
              rules: ${JSON.stringify(generateRules(data.list), null, 2)},
              ${
                allOptions.length ? allOptions.map(v => `${v.name}: []`).join('\n,') : ''
              }
            }
          },
          mounted () {
            ${
              allOptions.length ? allOptions.map(v => {
                return v.fn ? `this.get${v.name}()` : ''
              }).filter(v => v).join('\n') : ''
            }
          },
          methods: {
            ${
              allOptions.length ? allOptions.map(v => {
                return v.fn ? `async get${v.name} () {
                            var self = this
                            var fn = ${v.fn.replace(/(.+)(?=function)/, 'async ')}
                            this.${v.name} = await fn()
                          }` : ''
              }).filter(v => v).join('\n,') : ''
            }
            handleSubmit () {
              this.$refs.generateForm.validate(valid => {
                if (valid) {
                  console.log(this.models)
                }
              })
            }
          }
        });
        Vue.use(window.antd)
        var vm = new Vue({
          el: '#app'
        })
      </script>
    </body>
  </html>`
}
