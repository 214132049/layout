<template>
  <div class="widget-form-container">
    <div v-if="data.list.length === 0" class="form-empty">从左侧拖拽来添加字段</div>
    <a-form-model :label-align="data.config.labelAlign" :label-col="data.config.labelCol" :wrapper-col="data.config.wrapperCol" :model="formData">
      <draggable style="height: 100px;" v-model="data.list" v-bind="{group:'people', ghostClass: 'ghost', animation: 200, handle: '.drag-widget'}" draggable=".widget-view" @add="handleWidgetAdd">
        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(element, index) in data.list">
            <widget-form-item :key="element.key" :element="element" :select.sync="selectWidget" :index="index" :data="data" :form-data="formData"/>
          </template>
        </transition-group>
      </draggable>
    </a-form-model>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'

export default {
  components: {
    Draggable,
    WidgetFormItem
  },
  props: ['data', 'select'],
  data () {
    return {
      selectWidget: this.select,
      formData: {}
    }
  },
  methods: {
    handleSelectWidget (index) {
      this.selectWidget = this.data.list[index]
    },
    handleWidgetAdd (evt) {
      const newIndex = evt.newIndex
      //为拖拽到容器的元素添加唯一 key
      const key = Date.now().toString(32)
      const item = this.data.list[newIndex]
      const model = item.type + '_' + key
      this.$set(this.data.list, newIndex, {
        ...JSON.parse(JSON.stringify(item)),
        key,
        // 绑定键值
        model,
      })
      if (item.type === 'checkbox' || item.type === 'dateRangePicker') {
        this.formData[model] = []
      } else {
        this.formData[model] = ''
      }
      this.selectWidget = this.data.list[newIndex]
    }
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler (val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  }
}
</script>
