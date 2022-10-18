const express = require("express");
const router = express.Router();

// /api/types

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;