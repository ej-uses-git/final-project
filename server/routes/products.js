const express = require("express");
const router = express.Router();

const SERVER_URL = require('../utilities/server-url.json')
// /api/products

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;