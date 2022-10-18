const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const usersRouter = require("./routes/users");
const itemsRouter = require("./routes/items");
const ordersRouter = require("./routes/orders");
const productsRouter = require("./routes/products");
const typesRouter = require("./routes/types");
const fileUpload = require("express-fileupload");
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", usersRouter);
app.use("/api/items", itemsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);
app.use("/api/types", typesRouter);

module.exports = app;
