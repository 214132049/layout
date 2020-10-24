<template>
  <div class="widget-view" @click.stop="handleSelectWidget(index)">
    <a-form-item
      v-if="element && element.key"
      :class="{active: selectWidget.key == element.key, 'is_req': element.options.required}"
      :label="element.name"
    >
      <template v-if="element.type == 'input'">
        <a-input
          v-model="element.options.defaultValue"
          :style="{width: element.options.width}"
          :placeholder="element.options.placeholder"
          :disabled="element.options.disabled"
        ></a-input>
      </template>

      <template v-if="element.type == 'textarea'">
        <a-input type="textarea" :rows="5"
                 v-model="element.options.defaultValue"
                 :style="{width: element.options.width}"
                 :disabled="element.options.disabled"
                 :placeholder="element.options.placeholder"
        ></a-input>
      </template>

      <template v-if="element.type == 'number'">
        <a-input-number
          v-model="element.options.defaultValue"
          :disabled="element.options.disabled"
          :controls-position="element.options.controlsPosition"
          :style="{width: element.options.width}"
        ></a-input-number>
      </template>

      <template v-if="element.type == 'radio'">
        <a-radio-group v-model="element.options.defaultValue"
                       :style="{width: element.options.width}"
                       :disabled="element.options.disabled"
        >
          <a-radio
            :style="{display: element.options.inline ? 'inline-block' : 'block'}"
            :label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index"

          >
            {{element.options.showLabel ? item.label : item.value}}
          </a-radio>
        </a-radio-group>
      </template>

      <template v-if="element.type == 'checkbox'">
        <a-checkbox-group v-model="element.options.defaultValue"
                          :style="{width: element.options.width}"
                          :disabled="element.options.disabled"
        >
          <a-checkbox
            :style="{display: element.options.inline ? 'inline-block' : 'block'}"
            :label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index"
          >
            {{element.options.showLabel ? item.label : item.value}}
          </a-checkbox>
        </a-checkbox-group>
      </template>

      <template v-if="element.type == 'time'">
        <a-time-picker
          v-model="element.options.defaultValue"
          :is-range="element.options.isRange"
          :placeholder="element.options.placeholder"
          :start-placeholder="element.options.startPlaceholder"
          :end-placeholder="element.options.endPlaceholder"
          :readonly="element.options.readonly"
          :disabled="element.options.disabled"
          :editable="element.options.editable"
          :clearable="element.options.clearable"
          :arrowControl="element.options.arrowControl"
          :style="{width: element.options.width}"
        >
        </a-time-picker>
      </template>

      <template v-if="element.type == 'date'">
        <a-date-picker
          v-model="element.options.defaultValue"
          :type="element.options.type"
          :is-range="element.options.isRange"
          :placeholder="element.options.placeholder"
          :start-placeholder="element.options.startPlaceholder"
          :end-placeholder="element.options.endPlaceholder"
          :readonly="element.options.readonly"
          :disabled="element.options.disabled"
          :editable="element.options.editable"
          :clearable="element.options.clearable"
          :style="{width: element.options.width}"
        >
        </a-date-picker>
      </template>

      <template v-if="element.type == 'rate'">
        <a-rate v-model="element.options.defaultValue"
                :max="element.options.max"
                :disabled="element.options.disabled"
                :allow-half="element.options.allowHalf"
        ></a-rate>
      </template>

      <template v-if="element.type == 'color'">
        <a-color-picker
          v-model="element.options.defaultValue"
          :disabled="element.options.disabled"
          :show-alpha="element.options.showAlpha"
        ></a-color-picker>
      </template>

      <template v-if="element.type == 'select'">
        <a-select
          v-model="element.options.defaultValue"
          :disabled="element.options.disabled"
          :multiple="element.options.multiple"
          :clearable="element.options.clearable"
          :placeholder="element.options.placeholder"
          :style="{width: element.options.width}"
        >
          <a-option v-for="item in element.options.options" :key="item.value" :value="item.value" :label="element.options.showLabel?item.label:item.value"></a-option>
        </a-select>
      </template>

      <template v-if="element.type=='switch'">
        <a-switch
          v-model="element.options.defaultValue"
          :disabled="element.options.disabled"
        >
        </a-switch>
      </template>

      <template v-if="element.type=='slider'">
        <a-slider
          v-model="element.options.defaultValue"
          :min="element.options.min"
          :max="element.options.max"
          :disabled="element.options.disabled"
          :step="element.options.step"
          :show-input="element.options.showInput"
          :range="element.options.range"
          :style="{width: element.options.width}"
        ></a-slider>
      </template>

      <template v-if="element.type == 'cascader'">
        <a-cascader
          v-model="element.options.defaultValue"
          :disabled="element.options.disabled"
          :clearable="element.options.clearable"
          :placeholder="element.options.placeholder"
          :style="{width: element.options.width}"
          :options="element.options.remoteOptions"
        >

        </a-cascader>
      </template>

      <template v-if="element.type == 'editor'">
        <vue-editor
          v-model="element.options.defaultValue"
          :style="{width: element.options.width}"
        >
        </vue-editor>
      </template>

      <template v-if="element.type=='blank'">
        <div style="height: 50px;color: #999;background: #eee;line-height:50px;text-align:center;">自定义区域</div>
      </template>

      <template v-if="element.type == 'text'">
        <span>{{element.options.defaultValue}}</span>
      </template>
    </a-form-item>
    <div class="widget-view-action" v-if="selectWidget.key == element.key">
      <a-icon type="copy" @click.stop="handleWidgetClone(index)" />
      <a-icon type="delete" @click.stop="handleWidgetDelete(index)" />
    </div>

    <div class="widget-view-drag" v-if="selectWidget.key == element.key">
      <a-icon type="drag" class="drag-widget" />
    </div>

    <div class="widget-view-model">
      {{ element.model }}
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
export default {
  props: ['element', 'select', 'index', 'data'],
  data () {
    return {
      selectWidget: this.select
    }
  },
  mounted () {

  },
  methods: {
    handleSelectWidget (index) {
      this.selectWidget = this.data.list[index]
    },
    handleWidgetDelete (index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index - 1]
        }
      } else {
        this.selectWidget = this.data.list[index + 1]
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1)
      })
    },
    handleWidgetClone (index) {
      let cloneData = {
        ...this.data.list[index],
        options: {...this.data.list[index].options},
        key: Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      }

      if (this.data.list[index].type === 'radio' || this.data.list[index].type === 'checkbox' || this.data.list[index].type === 'select') {

        cloneData = {
          ...cloneData,
          options: {
            ...cloneData.options,
            options: cloneData.options.options.map(item => ({...item}))
          }
        }
      }

      this.data.list.splice(index, 0, cloneData)

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]
      })
    },
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