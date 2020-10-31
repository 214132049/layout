module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const ComponentSchema = new Schema({
    id: { type: Number },
    name: { type: String },
    npmName: { type: String },
    projectId: { type: String },
    npmVersion: { type: String },
    status: { type: Number },
    createDate: { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now }
  })

  return mongoose.model('components', ComponentSchema)
}
