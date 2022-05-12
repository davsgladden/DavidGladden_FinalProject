const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stateSchema = new Schema({
  stateCode: {
    type: String,
    required: true,
    quique: true,
  },
  funfacts: {
    type: Array,
  },
});

module.exports = mongoose.model("State", stateSchema);
