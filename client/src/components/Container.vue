<template>
  <a-layout style="height: 100%; overflow: hidden;">
    <a-layout-sider width="300px" style="border-right: 1px solid #e8e8e8; overflow: auto;" theme="light">
      <a-card title="基础组件" :bordered="false" style="width: 100%;">
        <draggable tag="ul" class="component-list" :list="basicComponents" v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}">
          <li class="component-list-item" v-for="(item, index) in basicComponents" :key="index">
            <a-button block type="small">
              <span>{{item.name}}</span>
            </a-button>
          </li>
        </draggable>
      </a-card>
      <a-card title="高级组件" :bordered="false" style="width: 100%;">
        <draggable tag="ul" class="component-list" :list="advanceComponents" v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}">
          <li class="component-list-item" v-for="(item, index) in advanceComponents" :key="index">
            <a-button block type="small">
              <span>{{item.name}}</span>
            </a-button>
          </li>
        </draggable>
      </a-card>
      <a-card title="组件树" :bordered="false" style="width: 100%;">
        <a-tree class="node-tree"
          :selectedKeys="selectedKeys"
          @select="handleTreeSelect"
          :default-expanded-keys="['root']"
          :tree-data="treeData"
        />
      </a-card>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="action-box">
        <a-button-group>
          <a-button type="primary" @click="handleClear">清空</a-button>
          <a-button type="primary" @click="handlePreview">预览</a-button>
          <a-button type="primary" @click="handleGenerateCode">生成代码</a-button>
          <a-button type="primary">保存</a-button>
        </a-button-group>
      </a-layout-header>
      <a-layout-content>
        <widget-form ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></widget-form>
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
      <generate-form insite="true" v-if="previewVisible" :data="widgetForm" :value="widgetModels" ref="generateForm">
      </generate-form>
    </cus-dialog>

    <cus-dialog :visible="codeVisible" @on-close="codeVisible = false" ref="codePreview" width="800px" form :action="false">
      <a-tabs style="box-shadow: none;" v-model="codeActiveName">
        <a-tab-pane tab="Vue Component" key="vue" forceRender>
          <Editor style="height: 500px;" :template="vueTemplate" mode="html"/>
        </a-tab-pane>
        <a-tab-pane tab="HTML" key="html" forceRender>
          <div id="codeeditor" >{{htmlTemplate}}</div>
          <Editor style="height: 500px;" :template="htmlTemplate" mode="html"/>
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
import Editor from './editor'
import {basicComponents, advanceComponents} from './componentsConfig.js'
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
    GenerateForm,
    Editor
  },
  data () {
    return {
      basicComponents,
      advanceComponents,
      widgetForm: {
        list: [],
        config: {
          labelCol: {
            span: 3
          },
          wrapperCol: {
            span: 12
          },
          labelAlign: 'right'
        },
      },
      configTab: 'widget',
      widgetFormSelect: null,
      previewVisible: false,
      codeVisible: false,
      widgetModels: {},
      htmlTemplate: '',
      vueTemplate: '',
      codeActiveName: 'vue'
    }
  },
  computed: {
    treeData () {
      return [{
        key: 'root',
        title: '根Form容器',
        children: this.widgetForm.list.map(v => ({
          key: v.key,
          title: `${v.name}_${v.key}`
        }))
      }]
    },
    selectedKeys () {
      if (!this.widgetFormSelect) return []
      return [this.widgetFormSelect.key]
    }
  },
  methods: {
    handlePreview () {
      console.log(this.widgetForm)
      this.previewVisible = true
    },
    handleGenerateCode () {
      this.codeVisible = true
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm), 'html')
      this.vueTemplate = generateCode(JSON.stringify(this.widgetForm), 'vue')
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
    handleTreeSelect (keys) {
      this.widgetFormSelect = this.widgetForm.list.find(v => v.key === keys[0])
    }
  }
}
</script>
