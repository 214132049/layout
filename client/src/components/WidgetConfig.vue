<template>
  <div v-if="show" style="overflow: auto;height: calc(100% - 50px);">
    <a-form labal-align="right" :label-col="{span: 6}" :wrapper-col="{span: 16}">
      <a-form-item label="字段标识">
        <a-input v-model="data.model" dis></a-input>
      </a-form-item>
      <a-form-item label="标题">
        <a-input v-model="data.name" dis></a-input>
      </a-form-item>
      <a-form-item
        v-for="(item, key) in data.options"
        :label="item.label"
        :key="key"
      >
        <a-select v-if="item.type === 'select'" key="select" v-model="item.value">
          <a-select-option
            v-for="option in item.selectOptions"
            :key="option.value"
            :value="option.value"
          >{{ option.label }}</a-select-option>
        </a-select>
        
        <a-input v-if="item.type === 'input'" key="input" v-model="item.value" />
        
        <a-input-number v-if="item.type === 'inputNumber'" key="input" v-model="item.value" :min="item.minValue" :max="item.maxValue" />
  
        <a-switch v-if="item.type === 'switch'" v-model="item.value" />
  
        <a-alert v-if="item.tip" :message="item.tip" banner />
        
        <Editor v-if="item.type === 'editor'" @change="options => item.value = options " mode="javascript" :template="jsonTemplate" showTest />
  
        <div v-if="['required', 'pattern', 'dataType'].includes(key)">
          <a-input v-model="item.message" placeholder="错误提示文案" />
        </div>
        
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import Editor from './editor'

export default {
  components: {
    Editor
  },
  props: ['data'],
  computed: {
    show () {
      return this.data && Object.keys(this.data).length > 0
    }
  },
  data () {
    return {
      jsonTemplate: `getOptions = async function () {
  return [
    { label: '选项一', key: '1', disabled: false },
    { label: '选项二', key: '2', disabled: false }
  ]
}`
    }
  }
}
</script>
