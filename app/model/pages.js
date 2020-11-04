module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const PagesSchema = new Schema({
    id: { type: Number },
    name: { type: String },
    image: { type: String, default: '' },
    desc: { type: String, default: '' },
    content: { type: String, default: '' },
    projectId: { type: Number },
    status: { type: Number, default: 1 },
    pageUrl: { type: String, default: '' },
    createDate: { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now },
  })

  return mongoose.model('pages', PagesSchema)
}
