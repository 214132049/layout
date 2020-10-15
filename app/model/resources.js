module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const ResourceSchema = new Schema({
    id: { type: Number },
    name: { type: String },
    content: { type: String },
    categoryId: { type: Number },
    status: { type: Number },
    createDate: { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now },
  })

  return mongoose.model('resource', ResourceSchema)
}
