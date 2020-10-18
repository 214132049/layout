const config = Object.assign(require('./' + (process.env.CODE_ENV || 'local')))

module.exports = config
