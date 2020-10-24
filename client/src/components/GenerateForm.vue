<template>
  <div class="fm-style">
    <a-form-model ref="generateForm" :model="models" :rules="rules" :label-align="data.config.labelAlign" :label-col="data.config.labelCol" :wrapper-col="data.config.wrapperCol">
      <template v-for="item in data.list">
        <a-row
          :key="item.key"
          type="flex"
          :gutter="item.options.gutter ? item.options.gutter : 0"
          :justify="item.options.justify"
          :align="item.options.align"
          v-if="item.type == 'grid'"
        >
          <a-col v-for="(col, colIndex) in item.columns" :key="colIndex" :span="col.span">
            <template v-for="citem in col.list" >
              <a-forml-model-item v-if="citem.type=='blank'" :label="citem.name" :prop="citem.model" :key="citem.key">
                <slot :name="citem.model" :model="models"></slot>
              </a-forml-model-item>
              <genetate-form-item v-else
                :key="citem.key"
                :models.sync="models"
                :remote="remote"
                :rules="rules"
                :widget="citem"
                @input-change="onInputChange">
              </genetate-form-item>
            </template>
          </a-col>
        </a-row>
        <a-form-model-item v-else-if="item.type == 'blank'" :label="item.name" :prop="item.model" :key="item.key">
          <slot :name="item.model" :model="models"></slot>
        </a-form-model-item>
        <genetate-form-item
          v-else
          :key="item.key"
          :models.sync="models"
          :rules="rules"
          :widget="item"
          @input-change="onInputChange"
          :remote="remote">
        </genetate-form-item>
      </template>
    </a-form-model>
  </div>
</template>

<script>
import GenetateFormItem from './GenerateFormItem'

export default {
  name: 'fm-generate-form',
  components: {
    GenetateFormItem
  },
  props: ['data', 'remote', 'value', 'insite'],
  data () {
    return {
      models: {},
      rules: {}
    }
  },
  created () {
    this.generateModle(this.data.list)
  },
  mounted () {
  },
  methods: {
    generateModle (genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this.generateModle(item.list)
          })
        } else {
          if (this.value && Object.keys(this.value).indexOf(genList[i].model) >= 0) {
            this.models[genList[i].model] = this.value[genList[i].model]
          } else {
            if (genList[i].type === 'blank') {
              this.$set(this.models, genList[i].model, genList[i].options.defaultType === 'String' ? '' : (genList[i].options.defaultType === 'Object' ? {} : []))
            } else {
              this.models[genList[i].model] = genList[i].options.defaultValue
            }
          }

          if (this.rules[genList[i].model]) {

            this.rules[genList[i].model] = [...this.rules[genList[i].model], ...genList[i].rules.map(item => {
              if (item.pattern) {
                return {...item, pattern: eval(item.pattern)}
              } else {
                return {...item}
              }
            })]
          } else {

            this.rules[genList[i].model] = [...genList[i].rules.map(item => {
              if (item.pattern) {
                return {...item, pattern: eval(item.pattern)}
              } else {
                return {...item}
              }
            })]
          }
        }
      }
    },
    getData () {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            resolve(this.models)
          } else {
            reject(new Error('表单数据校验失败').message)
          }
        })
      })
    },
    reset () {
      this.$refs.generateForm.resetFields()
    },
    onInputChange (value, field) {
      this.$emit('on-change', field, value, this.models)
    },
    refresh () {

    }
  },
  watch: {
    data: {
      deep: true,
      handler (val) {
        this.generateModle(val.list)
      }
    },
    value: {
      deep: true,
      handler (val) {
        console.log(JSON.stringify(val))
        this.models = {...this.models, ...val}
      }
    }
  }
}
</script>

<style lang="stylus">
// @import '../styles/cover.scss';
</style>
