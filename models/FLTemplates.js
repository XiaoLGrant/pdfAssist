const mongoose = require('mongoose')

const FLTemplatesSchema = new mongoose.Schema({
  templateType: {
    type: String,
    required: true,
  },
  stateName: {
    type: String,
    required: true,
  },
  countyName: {
    type: String,
    required: true,
  },
  tier: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    //type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  private: {
    type: Boolean,
    required: true
  }
})

module.exports = mongoose.model('FLTemplates', FLTemplatesSchema, "fl-templates")