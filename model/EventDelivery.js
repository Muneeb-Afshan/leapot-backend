const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliveryMethodSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  langCode:{type: String, required: true , default : "en"},
});

module.exports = mongoose.model('DeliveryMethod', deliveryMethodSchema);
