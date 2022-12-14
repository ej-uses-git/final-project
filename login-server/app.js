const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/usermanage/register", registerRouter);
app.use("/usermanage/login", loginRouter);

module.exports = app;
