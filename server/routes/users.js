const express = require("express");
const router = express.Router();

const makeConnection = require("../utilities/makeConnection");

const SERVER_URL = require('../utilities/server-url.json')
// /api/users

// GET User Info
router.get("/:userId/info", async (req, res, next) => {
  const {connect, query, end} = makeConnection();
  let result;
  try {
    await connect();
    result = await query()
  } catch (error) {
    
  }
});

module.exports = router;
