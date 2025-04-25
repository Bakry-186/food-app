const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
require("./config/connect");
const authRouter = require("./routes/authRoutes.js");
const userRouter = require("./routes/usersRoutes.js");
const resturnatRouter = require("./routes/resturantRoutes.js");
const categoryRouter = require("./routes/categoryRoutes.js");
const foodRouter = require("./routes/foodRoutes.js");
const orderRouter = require("./routes/orderRoutes.js");

const app = express();

// Middlewars
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/resturant", resturnatRouter);
app.use("/api/category", categoryRouter);
app.use("/api/food", foodRouter);
app.use("/api/order", orderRouter);

// Port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
