const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // This field should be a reference to the User model.
    eventId: { type: mongoose.Schema.Types.ObjectId, required: true }, // This field should be a reference to the Event model.
    createdAt: { type: Date, required: true }, // This is the date and time the payment was made.
    paymentId: { type: String, required: true }, // This is the unique identifier for the payment transaction.
    transactionId: { type: String }, // This is the transaction ID associated with the payment.
    amount: { type: Number, required: true }, // This is the amount of money paid.
    transactionStatus: { type: Boolean, required: true }, // This indicates whether the payment was successful or not.
    langCode:{type: String, required: true , default : "en"},
  });
  
  module.exports = mongoose.model('Payment', PaymentSchema);
