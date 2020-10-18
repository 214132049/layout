module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const CountersSchema = new Schema({
    _id: { type: String },
    sequence_value: { type: Number, default: 0 }
  })

  return mongoose.model('counters', CountersSchema)
}
