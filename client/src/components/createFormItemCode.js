export default function (list, craeteOptions) {
	let content = ''
	list.forEach(widget => {
		const {model, options, type} = widget
		let itemContent = ''
		let vModel = `models.${model}`
		switch (type) {
			case 'input':
				if (options.type === 'textarea') {
					itemContent = `
						<a-textarea
	            v-model="${vModel}"
	            placeholder="${options.placeholder}"
	            :disabled="${options.disabled}"
	          />`
				} else {
					itemContent = `
						<a-input
	            v-model="${vModel}"
	            placeholder="${options.placeholder}"
	            :disabled="${options.disabled}"
	          />`
				}
				break
			case 'inputNumber':
				itemContent = `
					<a-input-number
	          v-model.number="${vModel}"
	          :step="${options.step}"
	          :disabled="${options.disabled}"
	          :min="${options.min}"
	          :max="${options.max}"
	        />`
				break
			case 'radio':
				if (options.style === 'default') {
					itemContent = `
            <a-radio-group
              v-model="${vModel}"
              :disabled="${options.disabled}"
            >
	            <a-radio
	              style="{ display: ${options.inline ? 'inline-block' : 'block'}}"
	              :disabled="item.disabled"
	              :value="item.value" v-for="item in ${craeteOptions(model, options.optionsFn)}" :key="item.value"
	            >
	              {{item.label}}
	            </a-radio>
	          </a-radio-group>`
				} else {
					itemContent = `
	          <a-radio-group
	            v-model="${vModel}"
	            :disabled="${options.disabled}"
            >
	            <a-radio-button
	            :disabled="item.disabled"
	            :value="item.value"
	            v-for="item in ${craeteOptions(model, options.optionsFn)}"
	            :key="item.value"
	            >
	              {{item.label}}
	            </a-radio-button>
	          </a-radio-group>`
				}
				break
			case 'checkbox':
				itemContent = `
					<a-checkbox-group
		        v-model="${vModel}"
		        :disabled="${options.disabled}"
		      >
		        <a-checkbox
		          :value="item.value" v-for="item in ${craeteOptions(model, options.optionsFn)}" :key="item.value"
		        >
		          {{item.label}}
		        </a-checkbox>
		      </a-checkbox-group>`
				break
			case 'timePicker':
				itemContent = `
					<a-time-picker
		        v-model="${vModel}"
		        placeholder="${options.placeholder}"
		        :disabled="${options.disabled}"
		        :allow-clear="${options.allowClear}"
		        format="${options.format}"
		      />`
				break
			case 'datePicker':
				if (options.style === 'date') {
					itemContent = `
	          <a-date-picker
			        v-model="${vModel}"
			        placeholder="${options.placeholder}"
			        :disabled="${options.disabled}"
							:allow-clear="${options.allowClear}"
			        :show-time="${options.showtime}"
			      />`
				} else if (options.style === 'month') {
					itemContent = `
	          <a-month-picker
			        v-model="${vModel}"
			        :placeholder="${options.placeholder}"
			        :disabled="${options.disabled}"
							:allow-clear="${options.allowClear}"
			      />`
				} else {
					itemContent = `
	          <a-week-picker
			        v-model="${vModel}"
			        placeholder="${options.placeholder}"
			        :disabled="${options.disabled}"
							:allow-clear="${options.allowClear}"
		        />`
				}
				break
			case 'dateRangePicker':
				itemContent = `
					<a-range-picker
		        v-model="${vModel}"
		        :placeholder="[${options.startPlaceholder}, ${options.endPlaceholder}]"
		        :disabled="${options.disabled}"
						:allow-clear="${options.allowClear}"
						:show-time="${options.showtime}"
		      />`
				break
			case 'select':
				itemContent = `
					<a-select
		        v-model="${vModel}"
		        :disabled="${options.disabled}"
		        :multiple="${options.mode}"
		        :allow-clear="${options.allowClear}"
		        :placeholder="${options.placeholder}"
		      >
		        <a-select-option v-for="item in ${craeteOptions(model, options.optionsFn)}" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
		      </a-select>`
				break
			case 'switch':
				itemContent = `
					<a-switch
		        v-model="${vModel}"
		        :disabled="${options.disabled}"
		        :checked-children="${options.checkedChildren}"
		        :un-checked-children="${options.unCheckedChildren}"
		      />`
				break
			case 'slider':
				itemContent = `
					<a-slider
		        v-model="${vModel}"
		        :min="${options.min}"
		        :max="${options.max}"
		        :disabled="${options.disabled}"
		        :step="${options.step}"
		        :range="${options.range}"
		        :reverse="${options.reverse}"
		      />`
				break
			default:
				break
		}
		content += `
      <a-form-model-item label="${widget.name}" prop="${widget.model}">
        ${itemContent}
      </a-form-model-item>
    `
	})
	return content
}
