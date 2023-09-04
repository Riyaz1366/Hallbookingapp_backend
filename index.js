require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
const roomRoute = require("./routes/roomroute");

const app = express();



app.use(express.json());
app.use(express.urlencoded({extended:false}))


const url = process.env.MONGODB_URL;

const port = process.env.PORT;
mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => {
    console.log("mongodb Connected");
  })
  .catch((error) => {
    console.log(error);
  });


  app.use("/api", roomRoute);




app.listen(port, () => {
  console.log("Running on port");
});
