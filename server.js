require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3000;

//Connect to MongoDB
connectDB();

//custom middleware logger
app.use(logger);

//Builtin middleware
app.use(express.urlencoded({ extended: false })); //Used to handel urlencoded data
app.use(express.json()); //parses incoming requests with JSON payloads.
//Handles the static files
app.use(express.static(path.join(__dirname, "/public")));
//All the routes
app.use("/states", require("./routes/api/states"));
//All the non-existing paths
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
