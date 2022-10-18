const express = require("express");
const router = express.Router();

const makeConnection = require("../utilities/makeConnection");

// /api/users

// GET User Info
router.get("/:userId/info", async (req, res, next) => {
  const {connect, query, end} = makeConnection();
  let result;
  try {
    await connect();
    result = await query(`${SERVER_URL}`)
  } catch (error) {
    
  }
});

module.exports = router;
