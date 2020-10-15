module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const ComponentSchema = new Schema({
    componentId: { type: String },
    componentName: { type: String },
    componentNpmName: { type: String },
    projectId: { type: String },
    componentNpmVersion: { type: String },
    createDate: { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now }
  })

  return mongoose.model('component', ComponentSchema)
}
