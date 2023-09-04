const mongoose = require('mongoose');

// Define the Customer schema
const customerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },

},
{
    timestamps: true,
  }


);

// Create the Customer model
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;