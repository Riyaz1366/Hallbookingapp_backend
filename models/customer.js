const mongoose = require('mongoose');

// Define the Customer schema
const customerSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  phoneNumber: Number,


},
{
    timestamps: true,
  }


);

// Create the Customer model
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;