<template>
  <a-layout style="height: 100%; overflow: hidden;">
    <a-layout-sider width="300px" style="border-right: 1px solid #e8e8e8;" theme="light">
      <a-card title="基础字段" :bordered="false" style="width: 100%;" v-if="basicFields.length">
        <draggable tag="ul" class="component-list" :list="basicComponents" @end="handleMoveEnd" @start="handleMoveStart" :move="handleMove" v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}">
          <li v-if="basicFields.indexOf(item.type) >= 0" class="component-list-item" v-for="(item, index) in basicComponents" :key="index">
            <a-button block>
              <i class="icon iconfont" :class="item.icon"></i>
              <span>{{item.name}}</span>
            </a-button>
          </li>
        </draggable>
      </a-card>
      <a-card title="高级字段" :bordered="false" style="width: 100%;" v-if="advanceFields.length">
        <draggable tag="ul" class="component-list" :list="advanceComponents"  @end="handleMoveEnd" @start="handleMoveStart" :move="handleMove" v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}">
          <li v-if="advanceFields.indexOf(item.type) >= 0" class="component-list-item" v-for="(item, index) in advanceComponents" :key="index">
            <a-button block>
              <span>{{item.name}}</span>
            </a-button>
          </li>
        </draggable>
      </a-card>
      <a-card title="布局字段" :bordered="false" style="width: 100%;" v-if="advanceFields.length">
        <draggable tag="ul" class="component-list" :list="layoutComponents" @end="handleMoveEnd" @start="handleMoveStart" :move="handleMove" v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}">
          <li v-if="layoutFields.indexOf(item.type) >=0" class="component-list-item" v-for="(item, index) in layoutComponents" :key="index">
            <a-button block>
              <i class="icon iconfont" :class="item.icon"></i>
              <span>{{item.name}}</span>
            </a-button>
          </li>
        </draggable>
      </a-card>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="action-box">
        <a-button-group>
          <a-button v-if="upload" type="primary" @click="handleUpload">导入JSON</a-button>
          <a-button v-if="clearable" type="primary" @click="handleClear">清空</a-button>
          <a-button v-if="preview" type="primary" @click="handlePreview">预览</a-button>
          <a-button v-if="generateJson" type="primary" @click="handleGenerateJson">生成JSON</a-button>
          <a-button v-if="generateCode" type="primary" @click="handleGenerateCode">生成代码</a-button>
          <a-button type="primary">保存</a-button>
        </a-button-group>
      </a-layout-header>
      <a-layout-content>
        <widget-form v-if="!resetJson" ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></widget-form>
      </a-layout-content>
    </a-layout>
    <a-layout-sider width="400px" theme="light">
      <a-tabs v-model="configTab">
        <a-tab-pane key="widget" tab="字段属性">
          <widget-config v-show="configTab=='widget'" :data="widgetFormSelect" />
        </a-tab-pane>
        <a-tab-pane key="form" tab="表单属性">
          <form-config v-show="configTab=='form'" :data="widgetForm.config" />
        </a-tab-pane>
      </a-tabs>
    </a-layout-sider>

    <cus-dialog :visible="previewVisible" @on-close="previewVisible = false" ref="widgetPreview" width="1000px" form>
      <generate-form insite="true" @on-change="handleDataChange" v-if="previewVisible" :data="widgetForm" :value="widgetModels" :remote="remoteFuncs" ref="generateForm">

        <template v-slot:blank="scope">
          Width <a-input v-model="scope.model.blank.width" style="width: 100px"></a-input>
          Height <a-input v-model="scope.model.blank.height" style="width: 100px"></a-input>
        </template>
      </generate-form>

      <template slot="action">
        <a-button type="primary" @click="handleTest">获取数据</a-button>
        <a-button @click="handleReset">重置</a-button>
      </template>
    </cus-dialog>

    <cus-dialog :visible="uploadVisible" @on-close="uploadVisible = false" @on-submit="handleUploadJson" ref="uploadJson" width="800px" form :action="false">>
      <a-alert type="info" message="JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可" show-icon></a-alert>
      <div id="uploadeditor" style="height: 400px;width: 100%;">{{jsonEg}}</div>
    </cus-dialog>

    <cus-dialog :visible="jsonVisible" @on-close="jsonVisible = false" ref="jsonPreview" width="800px" form>
      <div id="jsoneditor" style="height: 400px;width: 100%;">{{jsonTemplate}}</div>
      <template slot="action">
        <a-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">复制数据</a-button>
      </template>
    </cus-dialog>

    <cus-dialog :visible="codeVisible" @on-close="codeVisible = false" ref="codePreview" width="800px" form :action="false">
      <a-tabs style="box-shadow: none;" v-model="codeActiveName">
        <a-tab-pane tab="Vue Component" key="vue" forceRender>
          <div id="vuecodeeditor" style="height: 500px; width: 100%;">{{vueTemplate}}</div>
        </a-tab-pane>
        <a-tab-pane tab="HTML" key="html" forceRender>
          <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div>
        </a-tab-pane>
      </a-tabs>
    </cus-dialog>
  </a-layout>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import CusDialog from './CusDialog'
import GenerateForm from './GenerateForm'
import Clipboard from 'clipboard'
import {basicComponents, layoutComponents, advanceComponents} from './componentsConfig.js'
import request from '../extend/Server'
import generateCode from './generateCode.js'

export default {
  name: 'fm-making-form',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm
  },
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    generateCode: {
      type: Boolean,
      default: false
    },
    generateJson: {
      type: Boolean,
      default: false
    },
    upload: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    basicFields: {
      type: Array,
      default: () => ['input', 'textarea', 'number', 'radio', 'checkbox', 'time', 'date', 'rate', 'color', 'select', 'switch', 'slider', 'text']
    },
    advanceFields: {
      type: Array,
      default: () => ['blank', 'editor', 'cascader']
    },
    layoutFields: {
      type: Array,
      default: () => ['grid']
    }
  },
  data () {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      resetJson: false,
      widgetForm: {
        list: [],
        config: {
          labelCol: {
            span: 3
          },
          wrapperCol: {
            span: 12
          },
          labelAlign: 'right',
          size: 'default'
        },
      },
      configTab: 'widget',
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      remoteFuncs: {
        func_test (resolve) {
          setTimeout(() => {
            const options = [
              {id: '1', name: '1111'},
              {id: '2', name: '2222'},
              {id: '3', name: '3333'}
            ]

            resolve(options)
          }, 2000)
        },
        funcGetToken (resolve) {
          request.get('http://tools-server.xiaoyaoji.cn/api/uptoken').then(res => {
            resolve(res.uptoken)
          })
        },
        upload_callback (response, file, fileList) {
          console.log('callback', response, file, fileList)
        }
      },
      widgetModels: {},
      blank: '',
      htmlTemplate: '',
      vueTemplate: '',
      jsonTemplate: '',
      uploadEditor: null,
      jsonCopyValue: '',
      jsonClipboard: null,
      jsonEg: `{
        "list": [],
        "config": {
          "labelCol": {
            "span": 3
          },
          "wrapperCol": {
            "span": 12
          },
          "labelAlign": "right",
          "size": "default"
        }
      }`,
      codeActiveName: 'vue',
    }
  },
  watch: {
    codeActiveName () {

    }
  },
  mounted () {
  },
  methods: {
    handleMoveEnd (evt) {
      console.log('end', evt)
    },
    handleMoveStart ({oldIndex}) {
      console.log('start', oldIndex, this.basicComponents)
    },
    handleMove () {
      return true
    },
    handlePreview () {
      console.log(this.widgetForm)
      this.previewVisible = true
    },
    handleTest () {
      this.$refs.generateForm.getData().then(data => {
        this.$alert(data, '').catch(e=>{})
        this.$refs.widgetPreview.end()
      }).catch(e => {
        this.$refs.widgetPreview.end()
      })
    },
    handleReset () {
      this.$refs.generateForm.reset()
    },
    handleGenerateJson () {
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      console.log(JSON.stringify(this.widgetForm))
      this.$nextTick(() => {

        const editor = ace.edit('jsoneditor')
        editor.session.setMode("ace/mode/json")

        if (!this.jsonClipboard) {
          this.jsonClipboard = new Clipboard('.json-btn')
          this.jsonClipboard.on('success', (e) => {
            this.$message.success(this.$t('fm.message.copySuccess'))
          })
        }
        this.jsonCopyValue = JSON.stringify(this.widgetForm)
      })
    },
    handleGenerateCode () {

      this.codeVisible = true
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm), 'html')
      this.vueTemplate = generateCode(JSON.stringify(this.widgetForm), 'vue')
      this.$nextTick(() => {
        const editor = ace.edit('codeeditor')
        editor.session.setMode("ace/mode/html")

        const vueeditor = ace.edit('vuecodeeditor')
        vueeditor.session.setMode("ace/mode/html")
      })
    },
    handleUpload () {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.uploadEditor = ace.edit('uploadeditor')
        this.uploadEditor.session.setMode("ace/mode/json")
      })
    },
    handleUploadJson () {
      try {
        this.setJSON(JSON.parse(this.uploadEditor.getValue()))
        this.uploadVisible = false
      } catch (e) {
        this.$message.error(e.message)
        this.$refs.uploadJson.end()
      }
    },
    handleClear () {
      this.widgetForm = {
        list: [],
        config: {
          labelCol: {
            span: 3
          },
          wrapperCol: {
            span: 12
          },
          labelAlign: 'right',
          size: 'default',
          customClass: ''
        },
      }

      this.widgetFormSelect = {}
    },
    clear () {
      this.handleClear()
    },
    getJSON () {
      return this.widgetForm
    },
    getHtml () {
      return generateCode(JSON.stringify(this.widgetForm))
    },
    setJSON (json) {
      this.widgetForm = json

      if (json.list.length> 0) {
        this.widgetFormSelect = json.list[0]
      }
    },
    handleInput (val) {
      console.log(val)
      this.blank = val
    },
    handleDataChange (field, value, data) {
      console.log(field, value, data)
    }
  }
}
</script>
