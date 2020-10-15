module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    userName: { type: String },
    userPassword: { type: String },
    userId: { type: String },
    userEmail: { type: String },
    status: { type: String },
    createDate: { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now },
  })

  return mongoose.model('users', UserSchema)
}
