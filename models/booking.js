const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: String,
    date: Date,
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      name: String, 
     bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
    },

    status: {
      type: String,
      default: 'Pending', 
      enum: ['Pending', 'Confirmed', 'Cancelled'],
    },
    
  },
  {
    timestamps: true,
  }
);

// const Room = mongoose.model('Room', roomSchema);
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
