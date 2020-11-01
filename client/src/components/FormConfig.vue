<template>
  <div class="form-config-container">
    <a-form labal-align="right" :label-col="{span: 6}" :wrapper-col="{span: 16}">
      <a-form-item label="标签对齐方式">
        <a-radio-group v-model="data.labelAlign">
          <a-radio-button value="left">左对齐</a-radio-button>
          <a-radio-button value="right">右对齐</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="表单标签宽度">
        <a-input-number v-model="data.labelCol.span" :min="0"></a-input-number>
      </a-form-item>
      <a-form-item label="表单内容宽度">
        <a-input-number v-model="data.wrapperCol.span" :min="0"></a-input-number>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  props: ['data']
}
</script>
