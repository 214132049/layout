module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const CategorySchema = new Schema({
    id: { type: Number },
    name: { type: String },
    status: { type: Number },
    type: { type: Number },
    desc: { type: String },
    createDate: { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now },
  })

  return mongoose.model('category', CategorySchema)
}
