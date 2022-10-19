const express = require("express");
const router = express.Router();
const makeConnection = require("../utilities/makeConnection");
const safelyEscape = require("../utilities/safelyEscape");

// /usermanage/login

/* POST user login info verfication. */
router.post("/", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  if (!req.body.username || !req.body.password)
    return res.status(400).send("Improper request fields.");
  const username = safelyEscape(req.body.username);
  const password = safelyEscape(req.body.password);
  try {
    await connect();
    const result = await query(
      `SELECT user_id 
      FROM user 
      WHERE username = "${username}" 
      AND password = "${password}"`
    );
    await end();
    if (result.length) return res.json(result[0].user_id);
    return res.send(false);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
