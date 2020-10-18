const { Service } = require('egg')

class CountersService extends Service {
  async getNextId (sequenceName) {
    const { ctx } = this
    const exsit = await ctx.model.Counters.findOne({
      _id: sequenceName
    })
    if (!exsit) {
      await ctx.model.Counters.create({
        _id: sequenceName,
        sequence_value: 0
      })
    }
    const sequenceDocument = await ctx.model.Counters.findOneAndUpdate({
      _id: sequenceName
    }, {
      $inc: { sequence_value: 1 }
    }, {
      new: true,
      upsert: true
    })
    return sequenceDocument.sequence_value
  }
}

module.exports = CountersService
