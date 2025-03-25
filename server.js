const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

//Load env vars
dotenv.config({path: "./config/config.env"})

// Connect to database
connectDB();

const branches = require("./routes/branches");
const auth = require("./routes/auth");
const appointments = require("./routes/appointments");

const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

app.route("/").get((req, res) => (res.status(200).send("running")))
app.use("/api/v1/branches", branches);
app.use("/api/v1/auth", auth);
app.use("/api/v1/appointments", appointments);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('server running in', process.env.NODE_ENV, 'mode on', process.env.HOST + ":" + PORT));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log('Error:', err.stack);
    //Close Server & exit process
    server.close(() => {
        process.exit(1);
    })
})