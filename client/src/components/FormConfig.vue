<template>
  <div class="form-config-container">
    <a-form laba-position="top">
      <a-form-item label="标签对齐方式">
        <a-radio-group v-model="data.labelPosition">
          <a-radio-button label="left">左对齐</a-radio-button>
          <a-radio-button label="right">右对齐</a-radio-button>
          <a-radio-button label="top">顶部对齐</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="表单标签宽度">
        <a-input-number v-model="data.labelWidth" :min="0" :max="200" :step="10"></a-input-number>
      </a-form-item>

      <a-form-item label="组件尺寸">
        <a-radio-group v-model="data.size">
          <a-radio-button label="medium">medium</a-radio-button>
          <a-radio-button label="small">small</a-radio-button>
          <a-radio-button label="mini">mini</a-radio-button>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  props: ['data']
}
</script>
