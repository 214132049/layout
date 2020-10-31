<template>
  <div class="widget-form-container">
    <div v-if="data.list.length === 0" class="form-empty">从左侧拖拽来添加字段</div>
    <a-form :label-align="data.config.labelAlign" :label-col="data.config.labelCol" :wrapper-col="data.config.wrapperCol" >
      <draggable style="height: 100px;" v-model="data.list" v-bind="{group:'people', ghostClass: 'ghost', animation: 200, handle: '.drag-widget'}" draggable=".widget-view" @add="handleWidgetAdd">
        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(element, index) in data.list">
            <widget-form-item :key="element.key" :element="element" :select.sync="selectWidget" :index="index" :data="data" />
          </template>
        </transition-group>
      </draggable>
    </a-form>
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
      selectWidget: this.select
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
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        options: {
          ...this.data.list[newIndex].options,
          remoteFunc: 'func_' + key
        },
        key,
        // 绑定键值
        model: this.data.list[newIndex].type + '_' + key,
        rules: []
      })

      if (this.data.list[newIndex].type === 'radio' || this.data.list[newIndex].type === 'checkbox' || this.data.list[newIndex].type === 'select') {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          options: {
            ...this.data.list[newIndex].options,
            options: this.data.list[newIndex].options.options.map(item => ({
              ...item
            }))
          }
        })
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
