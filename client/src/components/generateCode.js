import getPostConfig from './getPostConfig'
import createFormItemCode from './createFormItemCode'

const allOptions = []

function craeteOptions (model, optionsFn) {
  const name = `${model}Options`
  allOptions.push({
    name,
    fn: optionsFn
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

export default function (data) {
  return `
<template>
  <a-form-model ref="generateForm" :model="models" :rules="rules" :label-align="${data.config.labelAlign}" :label-col="${JSON.stringify(data.config.labelCol)}" :wrapper-col="${JSON.stringify(data.config.wrapperCol)}">
    ${createFormItem(data.list)}
    <a-form-model-item :wrapper-col="${JSON.stringify({
      ...data.config.wrapperCol,
      offset: data.config.labelCol.span
    })}">
      <a-button @click="handleSubmit" type="primary">提交</a-button>
    </a-form-model-item>
  </a-form-model>>
</template>
<script>
  export default {
    data () {
      return {
        models: ${JSON.stringify(generateModels(data.list), null, 2)},
        rules: ${JSON.stringify(generateRules(data.list), null, 2)},
        ${
          allOptions.length && allOptions.map(v => `${v.name}: []`).join('\n,')
        }
      }
    },
    methods: {
    	${
        allOptions.length && allOptions.map(v => {
          return `async get${v.name} () {
            var self = this
            var fn = ${v.fn.replace(/(.+)(?=function)/, 'async ')}
            this.${v.name} = await fn()
          }`
        }).join('\n,')
      }
      handleSubmit () {
        this.$refs.generateForm.getData().then(data => {
          // data check success
          // data - form data
        }).catch(e => {
          // data check failed
        })
      }
    }
  }
</script>`
}
