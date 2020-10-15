module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const ComponentCompiledSchema = new Schema({
    componentId: { type: String },
    componentResourcePath: { type: String },
    componentNpmVersion: { type: String },
    createDate: { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now }
  })

  return mongoose.model('componentCompiled', ComponentCompiledSchema)
}
