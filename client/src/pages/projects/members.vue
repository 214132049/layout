<template>
  <div class="project-members-page">
    <a-form-model laba-width="80px" v-if="userInfo.id === userId">
      <a-form-model-item prop="member">
        <a-select mode="multiple" :value="newMember" placeholder="添加成员" @change="addMember"
        >
          <a-select-option v-for="item in options" :key="item.id" :disabled="member.includes(item.id)">
            {{ item.email }}
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="onSubmit">添加用户到项目</a-button>
      </a-form-model-item>
    </a-form-model>
    <a-list item-layout="horizontal" :data-source="tempMember">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta :description="item.email">
          <a-avatar slot="avatar" :src="item.photo | defaultHeader"/>
          <span slot="title">{{ item.name }} </span>
        </a-list-item-meta>
        <a-button slot="actions" v-if="userId === userInfo.id && item.id !== userId" type="link"
                  @click="changeAdmin(item)">设为管理员</a-button>
        <a-button slot="actions" v-if="item.id === userInfo.id && item.id !== userId" type="link"
                  @click="remove(item)">离开</a-button>
        <a-button slot="actions" v-if="userId === userInfo.id && item.id !== userId" type="link"
                  @click="remove(item)">移除</a-button>
        <a-tag color="pink" v-if="item.id === userId">管理员</a-tag>
        <a-tag color="pink" v-if="item.id === userInfo.id">当前用户</a-tag>
      </a-list-item>
    </a-list>
  </div>
</template>

<style lang="stylus" scoped>
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'

  export default {
    mixins: [BasePage],
    components: {},
    name: 'projectsMembers',
    props: {
      id: { // 项目id
        type: Number
      },
      userId: {
        type: String,
        default: ''
      },
      member: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        newMember: [],
        options: []
      }
    },
    computed: {
      tempMember () {
        return this.options.filter(({ id }) => this.member.includes(id))
      }
    },
    mounted () {
      this.getAllUsers()
    },
    methods: {
      addMember (value) {
        this.newMember = value
      },
      getAllUsers () {
        Server({
          url: 'api/user/find',
          method: 'get',
        }).then(({ data }) => {
          this.options = data.list
        })
      },
      onSubmit () {
        if (this.newMember.length === 0) {
          this.$message.error('先选择要添加的用户')
          return
        }
        Server({
          url: 'api/project/updateMember',
          method: 'post',
          data: {
            id: this.id,
            member: this.member.concat(this.newMember)
          }
        }).then(() => {
          this.$message.success('添加成功')
          this.newMember = []
          this.$emit('refresh')
        })
      },
      changeAdmin (item) {
        Server({
          url: 'api/project/changeAdmin',
          method: 'post',
          data: {
            id: this.id,
            userId: item.id
          }
        }).then(() => {
          this.$message.success('设置成功')
          this.$emit('refresh')
        })
      },
      remove (item) {
        Server({
          url: 'api/project/updateMember',
          method: 'post',
          data: {
            id: this.id,
            member: this.member.filter(id => id !== item.id)
          }
        }).then(() => {
          this.$message.success('删除成功')
          if (item.id === this.userInfo.id) {
            this.$router.push({ path: '/projects/list' })
          } else {
            this.$emit('refresh')
          }
        })
      }
    }
  }
</script>
