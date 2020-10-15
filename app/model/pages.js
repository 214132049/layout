module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const PageSchema = new Schema({
    id: { type: Number },
    key: { type: String },
    name: { type: String },
    image: { type: String },
    desc: { type: String },
    content: { type: String },
    draft: { type: String },
    projectId: { type: Number },
    isHomePage: { type: Number },
    status: { type: Number },
    createDate: { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now },
  })

  return mongoose.model('page', PageSchema)
}
