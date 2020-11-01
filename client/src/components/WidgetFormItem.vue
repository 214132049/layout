<template>
  <div class="widget-view" @click.stop="handleSelectWidget(index)">
    <a-form-model-item
      v-if="element && element.key"
      :required="element.options.required.value"
      :class="{active: selectWidget.key === element.key}"
      :label="element.name"
      :prop="element.model"
    >
      <template v-if="element.type === 'input'">
        <a-input
          v-model="formData[element.model]"
          v-if="element.options.type.value === 'text'"
          :placeholder="element.options.placeholder.value"
          :disabled="element.options.disabled.value"
        ></a-input>
        <a-textarea
          v-else
          v-model="formData[element.model]"
          :disabled="element.options.disabled.value"
          :placeholder="element.options.placeholder.value" :rows="4" />
      </template>

      <template v-if="element.type === 'inputNumber'">
        <a-input-number
          v-model="formData[element.model]"
          :min="element.options.min.value"
          :max="element.options.max.value"
          :step="element.options.step.value"
          :disabled="element.options.disabled.value"
        ></a-input-number>
      </template>

      <template v-if="element.type === 'radio'">
        <a-radio-group :disabled="element.options.disabled.value" v-model="formData[element.model]">
          <template v-if="element.options.style.value === 'default'">
            <a-radio
              :style="{display: element.options.inline.value ? 'inline-block' : 'block'}"
              :disabled="item.disabled"
              :value="item.value" v-for="item in element.options.options.value" :key="item.value"
            >
              {{item.label}}
            </a-radio>
          </template>
          <template v-else>
            <a-radio-button :disabled="item.disabled" :value="item.value" v-for="item in element.options.options.value" :key="item.value">{{item.label}}</a-radio-button>
          </template>
        </a-radio-group>
      </template>

      <template v-if="element.type === 'checkbox'">
        <a-checkbox-group
          v-model="formData[element.model]"
          :disabled="element.options.disabled.value"
        >
          <a-checkbox
            :value="item.value" v-for="item in element.options.options.value" :key="item.value"
          >
            {{item.label}}
          </a-checkbox>
        </a-checkbox-group>
      </template>
  
      <template v-if="element.type === 'select'">
        <a-select
          v-model="formData[element.model]"
          :disabled="element.options.disabled.value"
          :multiple="element.options.mode.value"
          :allow-clear="element.options.allowClear.value"
          :placeholder="element.options.placeholder.value"
        >
          <a-select-option v-for="item in element.options.options.value" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
        </a-select>
      </template>
      
      <template v-if="element.type === 'timePicker'">
        <a-time-picker
          v-model="formData[element.model]"
          :placeholder="element.options.placeholder.value"
          :disabled="element.options.disabled.value"
          :allow-clear="element.options.allowClear.value"
          :format="element.options.format.value"
        >
        </a-time-picker>
      </template>
      
      <template v-if="element.type === 'datePicker'">
        <a-date-picker
          v-if="element.options.type.value === 'date'"
          v-model="formData[element.model]"
          :placeholder="element.options.placeholder.value"
          :disabled="element.options.disabled.value"
          :allow-clear="element.options.allowClear.value"
          :show-time="element.options.showtime.value"
        />
        <a-month-picker
          v-if="element.options.type.value === 'month'"
          v-model="formData[element.model]"
          :placeholder="element.options.placeholder.value"
          :disabled="element.options.disabled.value"
          :allow-clear="element.options.allowClear.value"
        />
        <a-week-picker
          v-if="element.options.type.value === 'week'"
          v-model="formData[element.model]"
          :placeholder="element.options.placeholder.value"
          :disabled="element.options.disabled.value"
          :allow-clear="element.options.allowClear.value"
        />
      </template>
  
      <template v-if="element.type === 'dateRangePicker'">
        <a-range-picker
          v-model="formData[element.model]"
          :placeholder="[element.options.startPlaceholder.value, element.options.endPlaceholder.value]"
          :disabled="element.options.disabled.value"
          :allow-clear="element.options.allowClear.value"
          :show-time="element.options.showtime.value"
        />
      </template>
      
      <template v-if="element.type==='switch'">
        <a-switch
          v-model="formData[element.model]"
          :disabled="element.options.disabled.value"
          :checked-children="element.options.checkedChildren.value"
          :un-checked-children="element.options.checkedChildren.value"
        >
        </a-switch>
      </template>

      <template v-if="element.type==='slider'">
        <a-slider
          v-model="formData[element.model]"
          :min="element.options.min.value"
          :max="element.options.max.value"
          :disabled="element.options.disabled.value"
          :step="element.options.step.value"
          :range="element.options.range.value"
          :reverse="element.options.reverse.value"
        ></a-slider>
      </template>
    </a-form-model-item>
    <div class="widget-view-action" v-if="selectWidget.key == element.key">
      <a-icon type="copy" @click.stop="handleWidgetClone(index)" />
      <a-icon type="delete" @click.stop="handleWidgetDelete(index)" />
    </div>

    <div class="widget-view-drag" v-if="selectWidget.key == element.key">
      <a-icon type="drag" class="drag-widget" />
    </div>

    <div class="widget-view-model">
      {{ element.key }}
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
export default {
  props: ['element', 'select', 'index', 'data', 'formData'],
  data () {
    return {
      selectWidget: this.select
    }
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
      const source = JSON.parse(JSON.stringify(this.data.list[index]))
      
      this.data.list.splice(index, 0, {
        ...source,
        key: Date.now().toString(32),
        model: this.data.list[newIndex].type + '_' + key
      })

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
