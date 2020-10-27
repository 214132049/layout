<template>
  <a-modal :title="title" :visible="dialogVisible" :close-on-click-modal="false" append-to-body center :width="width" ref="elDialog" :id="id" @cancel="close" @ok="submit" :footer="action">
    <span v-if="show">
      <slot></slot>
    </span>
    <span v-if="action" slot="footer" class="dialog-footer">
      <slot name="action">
        <a-button @click="close">取 消</a-button>
        <a-button type="primary" @click="submit">确 定</a-button>
      </slot>
    </span>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '600px'
    },
    form: {
      type: Boolean,
      default: true
    },
    action: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    show () {
      if (this.form) {
        return this.showForm
      } else {
        return true
      }
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      id: 'dialog_' + new Date().getTime(),
      showForm: false
    }
  },
  methods: {
    close () {
      this.dialogVisible = false
    },
    submit () {
      this.$emit('on-submit')
    },
  },
  mounted () {
  },
  watch: {
    dialogVisible (val) {
      if (!val) {
        this.$emit('on-close')
        setTimeout(() => {
          this.showForm = false
        }, 300)
      } else {
        this.showForm = true
      }
    },
    visible (val) {
      this.dialogVisible = val
    }
  }
}
</script>

<style lang="stylus">
.cus-dialog-container{
  .a-dialog__footer{
    margin: 0 20px;
    // border-top: 1px dashed #ccc;
    padding: 15px 0 16px;
    text-align: center;
    position: relative;

    .dialog-footer{
      display: block;

      .circular{
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
