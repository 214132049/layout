module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    name: { type: String },
    password: { type: String },
    id: { type: String },
    email: { type: String },
    status: { type: String },
    photo: { type: String },
    createDate: { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now },
  })

  return mongoose.model('users', UserSchema)
}
