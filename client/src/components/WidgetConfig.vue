<template>
  <div v-if="show">
    <a-form labal-align="right" :label-col="{span: 6}" :wrapper-col="{span: 16}">
      <a-form-item label="字段标识">
        <a-input v-model="data.model" dis></a-input>
      </a-form-item>
      <a-form-item label="标题" v-if="data.type!=='button'">
        <a-input v-model="data.name"></a-input>
      </a-form-item>
      <template v-if="data.type ==='button'">
        <a-form-item label="按钮类型" v-if="'type' in data.options">
          <a-select v-model="data.options.type">
            <a-select-option value="">Default</a-select-option>
            <a-select-option value="primary">primary</a-select-option>
            <a-select-option value="dashed">dashed</a-select-option>
            <a-select-option value="danger">danger</a-select-option>
            <a-select-option value="link">link</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="按钮尺寸" v-if="'size' in data.options">
          <a-select v-model="data.options.size">
            <a-select-option value="">Default</a-select-option>
            <a-select-option value="small">small</a-select-option>
            <a-select-option value="large">large</a-select-option>
          </a-select>
        </a-form-item>
      </template>
      <a-form-item label="宽度" v-if="Object.keys(data.options).indexOf('width')>=0">
        <a-input v-model="data.options.width"></a-input>
      </a-form-item>
      <a-form-item label="高度" v-if="Object.keys(data.options).indexOf('height')>=0">
        <a-input v-model="data.options.height"></a-input>
      </a-form-item>
      <a-form-item label="大小" v-if="data.type!=='button' && Object.keys(data.options).indexOf('size')>=0">
        宽度 <a-input style="width: 90px;" type="number" v-model.number="data.options.size.width"></a-input>
        高度 <a-input style="width: 90px;" type="number" v-model.number="data.options.size.height"></a-input>
      </a-form-item>
      <a-form-item label="占位内容" v-if="Object.keys(data.options).indexOf('placeholder')>=0 && (data.type!='time' || data.type!='date')">
        <a-input v-model="data.options.placeholder"></a-input>
      </a-form-item>
      <a-form-item label="布局方式" v-if="Object.keys(data.options).indexOf('inline')>=0">
        <a-radio-group v-model="data.options.inline">
          <a-radio-button label="false">块级</a-radio-button>
          <a-radio-button label="true">行内</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="显示输入框" v-if="Object.keys(data.options).indexOf('showInput')>=0">
        <a-switch v-model="data.options.showInput" ></a-switch>
      </a-form-item>
      <a-form-item label="最小值" v-if="Object.keys(data.options).indexOf('min')>=0">
        <a-input-number v-model="data.options.min" :min="0" :max="100" :step="1"></a-input-number>
      </a-form-item>
      <a-form-item label="最大值" v-if="Object.keys(data.options).indexOf('max')>=0">
        <a-input-number v-model="data.options.max" :min="0" :max="100" :step="1"></a-input-number>
      </a-form-item>
      <a-form-item label="步长" v-if="Object.keys(data.options).indexOf('step')>=0">
        <a-input-number v-model="data.options.step" :min="0" :max="100" :step="1"></a-input-number>
      </a-form-item>
      <template v-if="data.type=='select'">
        <a-form-item label="是否多选">
          <a-switch v-model="data.options.multiple" @change="handleSelectMuliple"></a-switch>
        </a-form-item>
        <a-form-item label="是否可搜索">
          <a-switch v-model="data.options.filterable"></a-switch>
        </a-form-item>
      </template>
      <a-form-item label="允许半选" v-if="Object.keys(data.options).indexOf('allowHalf')>=0">
        <a-switch v-model="data.options.allowHalf"></a-switch>
      </a-form-item>
      <a-form-item label="支持透明度选择" v-if="Object.keys(data.options).indexOf('showAlpha')>=0">
        <a-switch v-model="data.options.showAlpha"></a-switch>
      </a-form-item>
      <a-form-item label="是否显示标签" v-if="Object.keys(data.options).indexOf('showLabel')>=0">
        <a-switch v-model="data.options.showLabel"></a-switch>
      </a-form-item>
      <a-form-item label="选项" v-if="Object.keys(data.options).indexOf('options')>=0">
        <a-radio-group v-model="data.options.remote" size="small" style="margin-bottom:10px;">
          <a-radio-button label="false">静态数据</a-radio-button>
          <a-radio-button label="true">远端数据</a-radio-button>
        </a-radio-group>
        <template v-if="data.options.remote">
          <div>
            <a-input size="small" style="" v-model="data.options.remoteFunc">
              <template slot="prepend">远端方法</template>
            </a-input>
            <a-input size="small" style="" v-model="data.options.props.value">
              <template slot="prepend">值</template>
            </a-input>
            <a-input size="small" style="" v-model="data.options.props.label">
              <template slot="prepend">标签</template>
            </a-input>
          </div>
        </template>
        <template v-else>
          <template v-if="data.type=='radio' || (data.type=='select'&&!data.options.multiple)">
            <a-radio-group v-model="data.options.defaultValue">
              <draggable tag="ul" :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index" >
                  <a-radio
                    label="item.value"
                    style="margin-right: 5px;"
                  >
                    <a-input :style="{'width': data.options.showLabel? '90px': '180px' }" size="small" v-model="item.value"></a-input>
                    <a-input style="width:90px;" size="small" v-if="data.options.showLabel" v-model="item.label"></a-input>
                  </a-radio>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont icon-icon_bars"></i></i>
                  <a-button @click="handleOptionsRemove(index)" circle plain type="danger" size="small" icon="a-icon-minus" style="padding: 4px;margin-left: 5px;"></a-button>
                </li>
              </draggable>

            </a-radio-group>
          </template>

          <template v-if="data.type=='checkbox' || (data.type=='select' && data.options.multiple)">
            <a-checkbox-group v-model="data.options.defaultValue">

              <draggable tag="ul" :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index" >
                  <a-checkbox
                    label="item.value"
                    style="margin-right: 5px;"
                  >
                    <a-input :style="{'width': data.options.showLabel? '90px': '180px' }" size="small" v-model="item.value"></a-input>
                    <a-input style="width:90px;" size="small" v-if="data.options.showLabel" v-model="item.label"></a-input>
                  </a-checkbox>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont icon-icon_bars"></i></i>
                  <a-button @click="handleOptionsRemove(index)" circle plain type="danger" size="small" icon="a-icon-minus" style="padding: 4px;margin-left: 5px;"></a-button>

                </li>
              </draggable>
            </a-checkbox-group>
          </template>
          <div style="margin-left: 22px;">
            <a-button type="text" @click="handleAddOption">添加选项</a-button>
          </div>
        </template>

      </a-form-item>

      <a-form-item label="远端数据" v-if="data.type=='cascader'">
        <div>
          <a-input size="small" style="" v-model="data.options.remoteFunc">
            <template slot="prepend">远端方法</template>
          </a-input>
          <a-input size="small" style="" v-model="data.options.props.value">
            <template slot="prepend">值</template>
          </a-input>
          <a-input size="small" style="" v-model="data.options.props.label">
            <template slot="prepend">标签</template>
          </a-input>
          <a-input size="small" style="" v-model="data.options.props.children">
            <template slot="prepend">子选项</template>
          </a-input>
        </div>
      </a-form-item>

      <a-form-item label="默认值" v-if="Object.keys(data.options).indexOf('defaultValue')>=0 && (data.type == 'textarea' || data.type == 'input' || data.type=='rate' || data.type=='color' || data.type=='switch')">
        <a-input v-if="data.type=='textarea'" type="textarea" :rows="5" v-model="data.options.defaultValue"></a-input>
        <a-input v-if="data.type=='input'" v-model="data.options.defaultValue"></a-input>
        <a-rate v-if="data.type == 'rate'" style="display:inline-block;vertical-align: middle;" :max="data.options.max" :allow-half="data.options.allowHalf" v-model="data.options.defaultValue"></a-rate>
        <a-button type="text" v-if="data.type == 'rate'" style="display:inline-block;vertical-align: middle;margin-left: 10px;" @click="data.options.defaultValue=0">清空</a-button>
        <a-color-picker
          v-if="data.type == 'color'"
          v-model="data.options.defaultValue"
          :show-alpha="data.options.showAlpha"
        ></a-color-picker>
        <a-switch v-if="data.type=='switch'" v-model="data.options.defaultValue"></a-switch>
      </a-form-item>

      <template v-if="data.type == 'time' || data.type == 'date'">
        <a-form-item label="显示类型" v-if="data.type == 'date'">
          <a-select v-model="data.options.type">
            <a-select-option value="year">year</a-select-option>
            <a-select-option value="month">month</a-select-option>
            <a-select-option value="date">date</a-select-option>
            <a-select-option value="dates">dates</a-select-option>
            <!-- <a-select-option value="week"></a-select-option> -->
            <a-select-option value="datetime">datetime</a-select-option>
            <a-select-option value="datetimerange">datetimerange</a-select-option>
            <a-select-option value="daterange">daterange</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否为范围选择" v-if="data.type == 'time'">
          <a-switch
            v-model="data.options.isRange"
          >
          </a-switch>
        </a-form-item>
        <a-form-item label="是否获取时间戳" v-if="data.type == 'date'">
          <a-switch
            v-model="data.options.timestamp"
          >
          </a-switch>
        </a-form-item>
        <a-form-item label="占位内容" v-if="(!data.options.isRange && data.type == 'time') || (data.type != 'time' && data.options.type != 'datetimerange' && data.options.type != 'daterange')">
          <a-input v-model="data.options.placeholder"></a-input>
        </a-form-item>
        <a-form-item label="开始时间占位内容" v-if="(data.options.isRange) || data.options.type=='datetimerange' || data.options.type=='daterange'">
          <a-input v-model="data.options.startPlaceholder"></a-input>
        </a-form-item>
        <a-form-item label="结束时间占位内容" v-if="data.options.isRange || data.options.type=='datetimerange' || data.options.type=='daterange'">
          <a-input v-model="data.options.endPlaceholder"></a-input>
        </a-form-item>
        <a-form-item label="格式">
          <a-input v-model="data.options.format"></a-input>
        </a-form-item>
        <a-form-item label="默认值" v-if="data.type=='time' && Object.keys(data.options).indexOf('isRange')>=0">
          <a-time-picker
            key="1"
            style="width: 100%;"
            v-if="!data.options.isRange"
            v-model="data.options.defaultValue"
            :arrowControl="data.options.arrowControl"
            :value-format="data.options.format"
          >
          </a-time-picker>
          <a-time-picker
            key="2"
            v-if="data.options.isRange"
            style="width: 100%;"
            v-model="data.options.defaultValue"
            is-range
            :arrowControl="data.options.arrowControl"
            :value-format="data.options.format"
          >
          </a-time-picker>
        </a-form-item>
      </template>

      <template v-if="data.type=='blank'">
        <a-form-item label="绑定数据类型">
          <a-select v-model="data.options.defaultType">
            <a-select-option value="String">字符串</a-select-option>
            <a-select-option value="Object">对象</a-select-option>
            <a-select-option value="Array">数组</a-select-option>
          </a-select>
        </a-form-item>
      </template>

      <template v-if="data.type != 'grid'">
        <a-form-item label="操作属性">
          <a-checkbox v-model="data.options.readonly" v-if="Object.keys(data.options).indexOf('readonly')>=0">完全只读</a-checkbox>
          <a-checkbox v-model="data.options.disabled" v-if="Object.keys(data.options).indexOf('disabled')>=0">禁用	</a-checkbox>
          <a-checkbox v-model="data.options.editable" v-if="Object.keys(data.options).indexOf('editable')>=0">文本框可输入</a-checkbox>
          <a-checkbox v-model="data.options.clearable" v-if="Object.keys(data.options).indexOf('clearable')>=0">显示清除按钮</a-checkbox>
          <a-checkbox v-model="data.options.arrowControl" v-if="Object.keys(data.options).indexOf('arrowControl')>=0">使用箭头进行时间选择</a-checkbox>
          <a-checkbox v-model="data.options.isDelete" v-if="Object.keys(data.options).indexOf('isDelete')>=0">删除</a-checkbox>
          <a-checkbox v-model="data.options.isEdit" v-if="Object.keys(data.options).indexOf('isEdit')>=0">编辑}</a-checkbox>

        </a-form-item>
        <a-form-item label="校验" v-if="'required' in (data.options) || 'dataType' in (data.options) || 'pattern' in (data.options)">
          <div v-if="'required' in (data.options)">
            <a-checkbox v-model="data.options.required">必填</a-checkbox>
          </div>
          <a-select v-if="'dataType' in (data.options)" v-model="data.options.dataType" size="small" >
            <a-select-option value="string">字符串</a-select-option>
            <a-select-option value="number">数字</a-select-option>
            <a-select-option value="boolean">布尔值</a-select-option>
            <a-select-option value="integer">整数</a-select-option>
            <a-select-option value="float">浮点数</a-select-option>
            <a-select-option value="url">URL地址</a-select-option>
            <a-select-option value="email">邮箱地址</a-select-option>
            <a-select-option value="hex">十六进制</a-select-option>
          </a-select>
          <div v-if="'pattern' in (data.options)">
            <a-input size="small" v-model.lazy="data.options.pattern"  style=" width: 240px;" placeholder="填写正则表达式"></a-input>
          </div>
        </a-form-item>
      </template>
    </a-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable
  },
  props: ['data'],
  data () {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null
      }
    }
  },
  computed: {
    show () {
      if (this.data && Object.keys(this.data).length > 0) {
        return true
      }
      return false
    }
  },
  methods: {
    handleOptionsRemove (index) {
      if (this.data.type === 'grid') {
        this.data.columns.splice(index, 1)
      } else {
        this.data.options.options.splice(index, 1)
      }

    },
    handleAddOption () {
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: '新选项',
          label: '新选项'
        })
      } else {
        this.data.options.options.push({
          value: '新选项'
        })
      }

    },
    handleAddColumn () {
      this.data.columns.push({
        span: '',
        list: []
      })
    },
    generateRule () {
      this.data.rules = []
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key])
        }
      })
    },
    handleSelectMuliple (value) {
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [this.data.options.defaultValue]
        } else {
          this.data.options.defaultValue = []
        }

      } else {
        if (this.data.options.defaultValue.length>0){
          this.data.options.defaultValue = this.data.options.defaultValue[0]
        } else {
          this.data.options.defaultValue = ''
        }

      }
    },

    validateRequired (val) {
      if (val) {
        this.validator.required = {required: true, message: `${this.data.name}必须填写`}
      } else {
        this.validator.required = null
      }

      this.$nextTick(() => {
        this.generateRule()
      })
    },

    validateDataType (val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.type = {type: val, message: this.data.name + '格式不正确'}
      } else {
        this.validator.type = null
      }

      this.generateRule()
    },
    valiatePattern (val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.pattern = {pattern: val, message: this.data.name + '格式不匹配'}
      } else {
        this.validator.pattern = null
      }

      this.generateRule()
    }
  },
  watch: {
    'data.options.isRange': function(val) {
      if (typeof val !== 'undefined') {
        if (val) {
          this.data.options.defaultValue = null
        } else {
          if (Object.keys(this.data.options).indexOf('defaultValue')>=0)
            this.data.options.defaultValue = ''
        }
      }
    },
    'data.options.required': function(val) {
      this.validateRequired(val)
    },
    'data.options.dataType': function (val) {
      this.validateDataType(val)
    },
    'data.options.pattern': function (val) {
      this.valiatePattern(val)
    },
    'data.name': function (val) {
      if (this.data.options) {
        this.validateRequired(this.data.options.required)
        this.validateDataType(this.data.options.dataType)
        this.valiatePattern(this.data.options.pattern)
      }
    }
  }
}
</script>
