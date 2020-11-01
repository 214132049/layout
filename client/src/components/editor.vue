<template>
	<div>
		<div :id="id" class="editor">{{ template }}</div>
		<a-button size="small" @click="getOptions" type="primary" v-if="showTest">测试获取</a-button>
	</div>
	
</template>

<script>
	import lodash from 'lodash'
	
	export default {
		name: 'editor',
		props: {
			mode: {
				type: String,
				default: 'html'
			},
			template: {
				type: String,
				default: ''
			},
			showTest: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				id: (Date.now() + Math.random() * 1000).toString(32),
				editor: null
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.editor = ace.edit(this.id, {
					theme: 'ace/theme/monokai',
					mode: `ace/mode/${this.mode}`,
					enableLiveAutocompletion: true
				})
			})
		},
		methods: {
			async getOptions () {
				let getOptions;
				eval(this.editor.getValue())
				const options = await getOptions()
				this.$emit('change', options)
			}
		},
		beforeDestroy() {
			this.editor.destroy();
		}
	}
</script>

<style scoped>
.editor {
	height: 300px;
	width: 100%;
}
</style>
