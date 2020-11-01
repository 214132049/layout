<template>
	<div>
		<div :id="id" class="editor">{{ template }}</div>
		<a-button size="small" @click="getOptions" type="primary" v-if="showTest">测试获取</a-button>
	</div>
	
</template>

<script>
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
			},
			model: {
				type: String,
				default: ''
			}
		},
		data () {
			return {
				id: (Date.now() + Math.random() * 1000).toString(32),
				editor: null
			}
		},
		watch: {
			model () {
				if (this.editor) {
					this.getOptions()
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.editor = ace.edit(this.id, {
					theme: 'ace/theme/monokai',
					mode: `ace/mode/${this.mode}`,
					enableLiveAutocompletion: true,
					tabSize: 2
				})
				this.getOptions()
			})
		},
		methods: {
			getOptions () {
				this.$emit('change', this.editor.getValue())
			}
		},
		beforeDestroy() {
			this.editor.destroy();
		}
	}
</script>

<style scoped>
.editor {
	height: calc(100% - 60px);
	width: 100%;
}
</style>
