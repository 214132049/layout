<template>
  <a-upload action="#" class="image-uploader" list-type="picture-card" name="image" :show-upload-list="false" :before-upload="beforeUpload" @change="handleChange">
    <img class="image" :src="imageUrl" alt="image" />
  </a-upload>
</template>

<script>
  export default {
    name: 'uploadImg',
    props: {
      url: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        imageUrl: ''
      }
    },
    watch: {
      url: {
        handler (val) {
          this.imageUrl = val
        },
        immediate: true
      }
    },
    methods: {
      handleChange (info) {
        this.getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.$emit('ended', imageUrl)
        })
      },
      getBase64 (img, callback) {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
      },
      beforeUpload (file) {
        const isJpgOrPng = file.type.indexOf('image') > -1
        if (!isJpgOrPng) {
          this.$message.error('必须上传图片')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('图片大小不能超过2MB!')
        }
        return isJpgOrPng && isLt2M
      }
    }
  }
</script>

<style scoped lang="stylus">
  .image-uploader  {
    & >>> .ant-upload {
      width: 128px;
      height: 128px;
      padding 0
      .image {
        display block
        width 100%
        height 100%
      }
    }
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
