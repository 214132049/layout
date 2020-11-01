export default function getPostConfig (list) {
	return list.map(v => {
		const { options } = v
		const _options = {}
		Object.keys(options).forEach(key => {
			if (['radio', 'checkbox', 'select'].includes(v.type) && key === 'options') {
				_options[`${key}Fn`] = options[key].fn
			}
			_options[key] = options[key].value
		})
		return {
			...v,
			options: _options
		}
	})
}
