const express = require("express");

const Room = require("../models/room");
const Booking = require("../models/booking");
const Customer = require("../models/customer");
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





// Request to book a room
router.post("/book-room", async (req, res) => {
  try {
    
    const { customerName, date, roomId,status } = req.body;

   
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

   
    const booking = new Booking({
      customerName,
      date,
      roomId,
      status,
    });

    await booking.save();


    room.bookings.push(booking);
    await room.save();

    res.status(201).json({ message: "Room booked successfully", booking });
  } catch (error) {
    res.status(400).json({ error: "Invalid request data" });
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

// Create a new booking
router.post("/bookings", async (req, res) => {
  try {
    const booking = new Booking(req.body);

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: "Invalid request data." });
  }
});

// Add a new customer
router.post("/customers", async (req, res) => {
  try {
    const { name, email, phoneNumber } = (req.body);

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
router.get("/rooms-with-bookings", async (req, res) => {
  try {

    const roomsWithBookings = await Room.find()
      .populate({
        path: "bookings",
        select: "customerName date",
      })
      .exec();

    const result = roomsWithBookings.map((room) => ({
      roomName: room.name,
      bookedStatus: room.bookings.length > 0,
      bookings: room.bookings.map((booking) => ({
        customerName: booking.customerName,
        date: booking.date,
     
      })),
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve rooms with bookings." });
  }
});





 //Request to list all customers with booked data
router.get("/customers-with-bookings", async (req, res) => {
  try {
 
    const bookingsWithRooms = await Booking.find()
      .populate({
        path: "roomId",
        select: "name", 
      })
      .select("customerName date startTime endTime")
      .exec();

    
    const customersWithBookings = bookingsWithRooms.map((booking) => ({
      customerName: booking.customerName,
      roomName: booking.roomId.name, 
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    }));

    res.status(200).json(customersWithBookings);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// Request to list customer bookings with details
router.get("/customer-bookings", async (req, res) => {
  try {
    
    const customerBookings = await Booking.find()
      .populate({
        path: "roomId",
        select: "name", 
      })
      .select("customerName date startTime endTime _id createdAt status roomId")
      .exec();

    
    const customerBookingDetails = {};

    customerBookings.forEach((booking) => {
      const customerId = booking.customerName;

      if (!customerBookingDetails[customerId]) {
        customerBookingDetails[customerId] = [];
      }

      const bookingDetails = {
        customerName: booking.customerName,
        roomName: booking.roomId.name, 
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingId: booking._id,
        bookingDate: booking.createdAt,
        bookingStatus: booking.status,
      };

      customerBookingDetails[customerId].push(bookingDetails);
    });

    res.status(200).json(customerBookingDetails);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
