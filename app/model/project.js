module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const ProjectSchema = new Schema({
    id: { type: Number },
    name: { type: String },
    member: { type: Array },
    status: {  type: Number },
    desc: { type: String },
    image: { type: String, default: '' },
    userId: { type: String },
    createDate: { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now },
  })

  return mongoose.model('project', ProjectSchema)
}
