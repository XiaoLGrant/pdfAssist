const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('customer', CustomerSchema)