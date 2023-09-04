const express = require("express");

const Room = require("../models/room");
const Booking = require("../models/booking");
const customer = require("../models/customer");
const router = express.Router();


router.get("/hallbooking", (req, res) => {
    res.send("Hall Booking APP");
  });

// add a room
router.post("/rooms", async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: "Invalid request data." });
  }
});

// Get all rooms
router.get("/getrooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve rooms." });
  }
});

// Get room details by ID
router.get("/rooms/:roomId", async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found." });
    }
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve room details." });
  }
});

// Update room details by ID
router.put("/rooms/:roomId", async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.roomId, req.body, {
      new: true,
    });
    if (!room) {
      return res.status(404).json({ error: "Room not found." });
    }
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: "Failed to update room details." });
  }
});

// Delete a room by ID
router.delete("/rooms/:roomId", async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found." });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete room." });
  }
});

router.post("/bookings", async (req, res) => {
  try {
    

    // Create a new booking
    const booking = new Booking(req.body);

    // Save the booking to the database
    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: "Invalid request data." });
  }
});

// Add a new customer
router.post("/customers", async (req, res) => {
    try {
      const { name, email, phoneNumber } = req.body;
  
      // Create a new customer
      const customer = new Customer({
        name,
        email,
        phoneNumber,
      });
  
      // Save the customer to the database
      await customer.save();
  
      res.status(201).json(customer);
    } catch (err) {
      res.status(400).json({ error: "Invalid request data." });
    }
  });
  



// API endpoint to list all rooms with booked data
router.get('/rooms-with-bookings', async (req, res) => {
    try {
      // Find all rooms and populate their bookings
      const roomsWithBookings = await Room.find()
        .populate({
          path: 'booking', 
          select: 'customerName date startTime endTime', 
        })
        .exec();
  
      const result = roomsWithBookings.map((room) => ({
        roomName: room.name,
        bookedStatus: room.bookings.length > 0, 
        bookings: room.bookings.map((booking) => ({
          customerName: booking.customerName,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
        })),
      }));
  
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve rooms with bookings.' });
    }
});
module.exports = router;
