<template>
  <a-form-item :label="widget.name" :prop="widget.model">
    <template v-if="widget.type == 'input'" >
      <a-input
        v-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'"
        type="number"
        v-model.number="dataModel"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
        :disabled="widget.options.disabled"
      ></a-input>
      <a-input
        v-else
        :type="widget.options.dataType"
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
      ></a-input>
    </template>

    <template v-if="widget.type == 'textarea'">
      <a-input type="textarea" :rows="5"
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
      ></a-input>
    </template>

    <template v-if="widget.type == 'number'">
      <a-input-number
        v-model="dataModel"
        :style="{width: widget.options.width}"
        :step="widget.options.step"
        controls-position="right"
        :disabled="widget.options.disabled"
        :min="widget.options.min"
        :max="widget.options.max"
      ></a-input-number>
    </template>

    <template v-if="widget.type == 'radio'">
      <a-radio-group v-model="dataModel"
        :style="{width: widget.options.width}"
        :disabled="widget.options.disabled"
      >
        <a-radio
          :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
          :label="item.value" v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="index"
        >
          <template v-if="widget.options.remote">{{item.label}}</template>
          <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
        </a-radio>
      </a-radio-group>
    </template>

    <template v-if="widget.type == 'checkbox'">
      <a-checkbox-group v-model="dataModel"
        :style="{width: widget.options.width}"
        :disabled="widget.options.disabled"
      >
        <a-checkbox

          :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
          :label="item.value" v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="index"
        >
          <template v-if="widget.options.remote">{{item.label}}</template>
          <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
        </a-checkbox>
      </a-checkbox-group>
    </template>

    <template v-if="widget.type == 'time'">
      <a-time-picker
        v-model="dataModel"
        :is-range="widget.options.isRange"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :arrowControl="widget.options.arrowControl"
        :value-format="widget.options.format"
        :style="{width: widget.options.width}"
      >
      </a-time-picker>
    </template>

    <template v-if="widget.type=='date'">
      <a-date-picker
        v-model="dataModel"
        :type="widget.options.type"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"
        :format="widget.options.format"
        :style="{width: widget.options.width}"
      >
      </a-date-picker>
    </template>

    <template v-if="widget.type =='rate'">
      <a-rate v-model="dataModel"
        :max="widget.options.max"
        :disabled="widget.options.disabled"
        :allow-half="widget.options.allowHalf"
      ></a-rate>
    </template>

    <template v-if="widget.type == 'color'">
      <a-color-picker
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :show-alpha="widget.options.showAlpha"
      ></a-color-picker>
    </template>

    <template v-if="widget.type == 'select'">
      <a-select
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :multiple="widget.options.multiple"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
        :filterable="widget.options.filterable"
      >
        <a-option v-for="item in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value"></a-option>
      </a-select>
    </template>

    <template v-if="widget.type=='switch'">
      <a-switch
        v-model="dataModel"
        :disabled="widget.options.disabled"
      >
      </a-switch>
    </template>

    <template v-if="widget.type=='slider'">
      <a-slider
        v-model="dataModel"
        :min="widget.options.min"
        :max="widget.options.max"
        :disabled="widget.options.disabled"
        :step="widget.options.step"
        :show-input="widget.options.showInput"
        :range="widget.options.range"
        :style="{width: widget.options.width}"
      ></a-slider>
    </template>

    <template v-if="widget.type == 'editor'">
      <vue-editor
        v-model="dataModel"
        :style="{width: widget.options.width}"
      >
      </vue-editor>
    </template>

    <template v-if="widget.type == 'cascader'">
      <a-cascader
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
        :options="widget.options.remoteOptions"
      >

      </a-cascader>
    </template>

    <template v-if="widget.type == 'text'">
      <span>{{dataModel}}</span>
    </template>
  </a-form-item>
</template>

<script>
export default {
  props: ['widget', 'models', 'rules', 'remote'],
  data () {
    return {
      dataModel: this.models[this.widget.model]
    }
  },
  created () {
    if (this.widget.options.remote && this.remote[this.widget.options.remoteFunc]) {
      this.remote[this.widget.options.remoteFunc]((data) => {
        this.widget.options.remoteOptions = data.map(item => {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            children: item[this.widget.options.props.children]
          }
        })
      })
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
