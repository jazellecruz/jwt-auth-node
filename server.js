require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const {connectToDb} = require("./src/db/db");


// --routers--
const authRoutes = require("./src/routes/auth");
const secretRoutes = require("./src/routes/secret");

// Initialize db
connectToDb();

// Middlewares for modifying req headers and body
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up view engine for our ejs files
app.set("view engine", "ejs");

// --routes--
app.use("/", authRoutes);
app.use("/", secretRoutes);

app.get("/", (req, res) => {
  res.send("Implementation of Token-based authentication using JWT on Node apps.");
});

app.get("*", (req, res) => {
  res.status(404).send("No matching url found...")
});

app.listen("8000", (err) => {
  console.log("Howdy from port 8000! 🤠");
});