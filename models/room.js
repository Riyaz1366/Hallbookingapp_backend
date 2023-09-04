const mongoose = require("mongoose");

const express = require("express");

// Define the room schema
const roomSchema = new mongoose.Schema(
  {
    name: String,
    seatsAvailable: Number,
    amenities: [String],
    pricePerHour: Number,
    bookings: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Booking',
        },
    ]
  },

  {
    timestamps: true,
  }
);

// Define the booking schema
// const bookingSchema = new mongoose.Schema({
//   customerName: String,
//   date: Date,
//   startTime: String,
//   endTime: String,
//   roomId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Room',
//   },
// }, {
//   timestamps: true,
// });

// Create the Room and Booking models
const Room = mongoose.model("Room", roomSchema);
// const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Room ;
