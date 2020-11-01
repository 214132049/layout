<template>
  <a-form-model ref="generateForm" :model="models" :rules="rules" :label-align="data.config.labelAlign" :label-col="data.config.labelCol" :wrapper-col="data.config.wrapperCol">
    <template v-for="item in _tempList">
      <genetate-form-item
        :key="item.key"
        :models.sync="models"
        :widget="item"
        @input-change="onInputChange">
      </genetate-form-item>
    </template>
    <a-form-model-item :wrapper-col="{
        ...data.config.wrapperCol,
        offset: data.config.labelCol.span
      }">
      <a-button @click="getData" type="primary">提交</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import GenetateFormItem from './GenerateFormItem'
import getPostConfig from './getPostConfig'

export default {
  name: 'fm-generate-form',
  components: {
    GenetateFormItem
  },
  props: ['data'],
  data () {
    return {
      models: {},
      rules: {},
      _tempList: []
    }
  },
  methods: {
    generateModels (list) {
      list.forEach(item => {
        const key = item.model
        if (item.type === 'checkbox' || item.type === 'dateRangePicker') {
          this.models[key] = []
        } else {
          this.models[key] = ''
        }
      })
    },
    generateRules (list) {
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
        this.rules[key] = value
      })
    },
    getPostConfig (list) {
      this._tempList = getPostConfig(list)
    },
    getData () {
      this.$refs.generateForm.validate(valid => {
        if (valid) {
          console.log(this.models)
        }
      })
    },
    reset () {
      this.$refs.generateForm.resetFields()
    },
    onInputChange (value, field) {
      this.$emit('on-change', field, value, this.models)
    },
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler (val) {
        this.generateModels(val.list)
        this.generateRules(val.list)
        this.getPostConfig(val.list)
      }
    }
  }
}
</script>

<style lang="stylus">
// @import '../styles/cover.scss';
</style>
