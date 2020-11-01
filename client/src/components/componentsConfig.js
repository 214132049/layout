const basePlaceholder = {label: '占位符', type: 'input', value: ''}
const baseDisabled = {label: '禁用', type: 'switch', value: false}
const baseRequired = {label: '必填', type: 'switch', value: false, message: ''}
const baseDataType =  {label: '值类型', type: 'select',
  selectOptions: [
    {value: 'string', label: '字符串'},
    {value: 'number', label: '数字'},
    {value: 'boolean', label: '布尔值'},
    {value: 'integer', label: '整数'},
    {value: 'float', label: '浮点数'},
    {value: 'url', label: 'URL地址'},
    {value: 'email', label: '邮箱地址'}
  ],
  value: 'string', message: '' }
const basePattern = { label: '正则', type: 'input', value: '', message: '' }

export const basicComponents = [
  {
    type: 'input',
    name: '输入框',
    options: {
      type: {
        label: '类型',
        type: 'select',
        selectOptions: [
          {value: 'text', label: '单行文本'},
          {value: 'textarea', label: '多行文本'}
        ],
        value: 'text'
      },
      placeholder: {...basePlaceholder},
      required: {...baseRequired},
      dataType: {...baseDataType},
      pattern: {...basePattern},
      disabled: {...baseDisabled}
    }
  },
  {
    type: 'inputNumber',
    name: '计数器',
    options: {
      min: {
        label: '最小值',
        type: 'inputNumber',
        value: 0
      },
      max: {
        label: '最大值',
        type: 'inputNumber',
        value: 1000
      },
      step: {
        label: '步长',
        type: 'inputNumber',
        value: 1
      },
      required: {...baseRequired},
      disabled: {...baseDisabled}
    }
  },
  {
    type: 'radio',
    name: '单选框',
    options: {
      inline: {
        label: '行内展示',
        type: 'switch',
        value: false
      },
      style: {
        label: '样式',
        type: 'select',
        selectOptions: [
          {value:'default', label: '默认样式'},
          {value:'button', label: '按钮样式'}
        ],
        value: 'default'
      },
      options: {
        label: '选项',
        type: 'editor',
        tip: '定义个getOptions函数，返回对象数组，其中：label字段为展示，value字段为值, disabled字段为禁用',
        value: [],
        fn: '() => {}'
      },
      required: {...baseRequired},
      dataType: {...baseDataType},
      disabled: {...baseDisabled}
    }
  },
  {
    type: 'checkbox',
    name: '多选框',
    options: {
      options: {
        label: '选项',
        type: 'editor',
        tip: '定义个getOptions函数，返回对象数组，其中：label字段为展示，value字段为值, disabled字段为禁用',
        value: [],
        fn: '() => {}'
      },
      required: {...baseRequired},
      disabled: {...baseDisabled}
    }
  },
  {
    type: 'select',
    name: '下拉选择框',
    options: {
      allowClear: {
        label: '展示清除按钮',
        type:'switch',
        value: false
      },
      mode: {
        label: '模式',
        type:'select',
        selectOptions: [
          {value: 'default', label: '单选'},
          {value: 'multiple', label: '多选'}
        ],
        value: 'default'
      },
      placeholder: {...basePlaceholder},
      options: {
        label: '选项',
        type: 'editor',
        tip: '定义个getOptions函数，返回对象数组，其中：label字段为展示，value字段为值, disabled字段为禁用',
        value: [],
        fn: '() => {}'
      },
      required: {...baseRequired},
      disabled: {...baseDisabled}
    }
  },
  {
    type: 'timePicker',
    name: '时间选择器',
    options: {
      disabled: {...baseDisabled},
      allowClear: {
        label: '展示清除按钮',
        type:'switch',
        value: false
      },
      placeholder: {...basePlaceholder},
      format: {
        label: '时间展示格式',
        type:'input',
        value: 'HH:mm:ss'
      },
      required: {...baseRequired},
    }
  },
  {
    type: 'datePicker',
    name: '日期选择器',
    options: {
      disabled: {...baseDisabled},
      allowClear: {
        label: '展示清除按钮',
        type:'switch',
        value: false
      },
      placeholder: {...basePlaceholder},
      type: {
        label: '类型',
        type: 'select',
        selectOptions: [
          {label: '日期选择', value: 'date'},
          {label: '周选择', value: 'week'},
          {label: '月选择', value: 'month'},
        ],
        value: 'date'
      },
      showtime: {
        label: '增加时间选择',
        tip: '只对日期选择有效',
        type:'switch',
        value: false
      },
      required: {...baseRequired},
    }
  },
  {
    type: 'dateRangePicker',
    name: '日期范围选择器',
    options: {
      disabled: {...baseDisabled},
      allowClear: {
        label: '展示清除按钮',
        type:'switch',
        value: false
      },
      startPlaceholder: {...basePlaceholder, label: '开始占位符'},
      endPlaceholder: {...basePlaceholder, label: '结束占位符'},
      showtime: {
        label: '增加时间选择',
        type:'switch',
        value: false
      },
      required: {...baseRequired},
    }
  },
  {
    type: 'switch',
    name: '开关',
    options: {
      checkedChildren: {
        ...basePlaceholder,
        label: '开状态文案'
      },
      unCheckedChildren: {
        ...basePlaceholder,
        label: '关状态文案'
      },
      required: {...baseRequired},
      disabled: {...baseDisabled}
    }
  },
  {
    type: 'slider',
    name: '滑块',
    options: {
      required: {...baseRequired},
      disabled: {...baseDisabled},
      min: {
        label: '最小值',
        type: 'inputNumber',
        minValue: 0,
        value: 0
      },
      max: {
        label: '最大值',
        type: 'inputNumber',
        maxValue: 100,
        value: 100
      },
      step: {
        label: '步长',
        type: 'inputNumber',
        value: 1
      },
      range: {
        label: '双滑块模式',
        type: 'switch',
        value: false
      },
      reverse: {
        label: '反向坐标轴',
        type: 'switch',
        value: false
      }
    }
  }
]

export const advanceComponents = []
