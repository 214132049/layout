<template>
  <a-form-model-item :label="widget.name" :prop="widget.model">
    <template v-if="widget.type === 'input'" >
      <a-textarea
        v-if="widget.options.type === 'textarea'"
        v-model="dataModel"
        :placeholder="widget.options.placeholder"
        :disabled="widget.options.disabled"
      />
      <a-input
        v-else
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :placeholder="widget.options.placeholder"
      />
    </template>

    <template v-if="widget.type === 'inputNumber'">
      <a-input-number
        v-model.number="dataModel"
        :step="widget.options.step"
        :disabled="widget.options.disabled"
        :min="widget.options.min"
        :max="widget.options.max"
      />
    </template>

    <template v-if="widget.type === 'radio'">
      <a-radio-group v-model="dataModel" :disabled="widget.options.disabled">
        <template v-if="widget.options.style === 'default'">
          <a-radio
            :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
            :disabled="item.disabled"
            :value="item.value" v-for="item in widget.options.options" :key="item.value"
          >
            {{item.label}}
          </a-radio>
        </template>
        <template v-else>
          <a-radio-button :disabled="item.disabled" :value="item.value" v-for="item in widget.options.options" :key="item.value">{{item.label}}</a-radio-button>
        </template>
      </a-radio-group>
    </template>

    <template v-if="widget.type === 'checkbox'">
      <a-checkbox-group
        v-model="dataModel"
        :disabled="widget.options.disabled"
      >
        <a-checkbox
          :value="item.value" v-for="item in widget.options.options" :key="item.value"
        >
          {{item.label}}
        </a-checkbox>
      </a-checkbox-group>
    </template>

    <template v-if="widget.type === 'timePicker'">
      <a-time-picker
        v-model="dataModel"
        :placeholder="widget.options.placeholder"
        :disabled="widget.options.disabled"
        :allow-clear="widget.options.allowClear"
        :format="widget.options.format"
      >
      </a-time-picker>
    </template>

    <template v-if="widget.type==='datePicker'">
      <a-date-picker
        v-if="widget.options.type === 'date'"
        v-model="dataModel"
        :placeholder="widget.options.placeholder"
        :disabled="widget.options.disabled"
        :allow-clear="widget.options.allowClear"
        :show-time="widget.options.showtime"
      />
      <a-month-picker
        v-if="widget.options.type === 'month'"
        v-model="dataModel"
        :placeholder="widget.options.placeholder"
        :disabled="widget.options.disabled"
        :allow-clear="widget.options.allowClear"
      />
      <a-week-picker
        v-if="widget.options.type === 'week'"
        v-model="dataModel"
        :placeholder="widget.options.placeholder"
        :disabled="widget.options.disabled"
        :allow-clear="widget.options.allowClear"
      />
    </template>
  
    <template v-if="widget.type === 'dateRangePicker'">
      <a-range-picker
        v-model="dataModel"
        :placeholder="[widget.options.startPlaceholder, widget.options.endPlaceholder]"
        :disabled="widget.options.disabled"
        :allow-clear="widget.options.allowClear"
        :show-time="widget.options.showtime"
      />
    </template>

    <template v-if="widget.type === 'select'">
      <a-select
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :multiple="widget.options.mode"
        :allow-clear="widget.options.allowClear"
        :placeholder="widget.options.placeholder"
      >
        <a-select-option v-for="item in widget.options.options" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </template>

    <template v-if="widget.type==='switch'">
      <a-switch
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :checked-children="widget.options.checkedChildren"
        :un-checked-children="widget.options.unCheckedChildren"
      >
      </a-switch>
    </template>

    <template v-if="widget.type==='slider'">
      <a-slider
        v-model="dataModel"
        :min="widget.options.min"
        :max="widget.options.max"
        :disabled="widget.options.disabled"
        :step="widget.options.step"
        :range="widget.options.range"
        :reverse="widget.options.reverse"
      ></a-slider>
    </template>
  </a-form-model-item>
</template>

<script>
export default {
  props: ['widget', 'models', 'rules', 'remote'],
  data () {
    return {
      dataModel: this.models[this.widget.model]
    }
  },
  async created () {
    if (['radio', 'checkbox', 'select'].includes(this.widget.type)) {
      let getOptions;
      eval(this.widget.options.optionsFn)
      this.widget.options.options = await getOptions()
    }
  },
  methods: {
  },
  watch: {
    dataModel: {
      deep: true,
      handler (val) {
        this.models[this.widget.model] = val
        this.$emit('update:models', {
          ...this.models,
          [this.widget.model]: val
        })
        this.$emit('input-change', val, this.widget.model)
      }
    },
    models: {
      deep: true,
      handler (val) {
        this.dataModel = val[this.widget.model]
      }
    }
  }
}
</script>
