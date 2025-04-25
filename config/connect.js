const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to DB: ", err.message);
});
