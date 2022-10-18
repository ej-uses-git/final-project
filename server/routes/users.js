const express = require("express");
const router = express.Router();

const makeConnection = require("../utilities/makeConnection");
const safelyEscape = require("../utilities/safelyEscape");

// /api/users

// GET User Info
router.get("/:userId/info", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let result;
  try {
    await connect();
    result = await query(
      `SELECT user_id, user_name, email
      FROM user
      WHERE user_id = ${req.params.userId}`
    );
    console.log("\n== result ==\n", result, "\n");
    res.send(result[0]);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

// GET Cart For User
router.get("/:userId/cart/:cartId", async (req, res, next) => {
  const {connect, query, end} = makeConnection();
  let result;
  try {
    await connect();
    result = await query(
      ``
    )
  } catch (error) {
    
  }
});

module.exports = router;
