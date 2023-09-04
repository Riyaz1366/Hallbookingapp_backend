const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: String,
    date: Date,
    startTime: String,
    endTime: String,
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

// const Room = mongoose.model('Room', roomSchema);
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = { Booking };
