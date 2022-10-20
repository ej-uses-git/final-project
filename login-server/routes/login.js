const express = require("express");
const router = express.Router();
const makeConnection = require("../utilities/makeConnection");
const safelyEscape = require("../utilities/safelyEscape");
const { encryptFromKey } = require("../utilities/decrypt");

// /usermanage/login

/* POST user login info verfication. */
router.post("/", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  if (!req.body.username || !req.body.password)
    return res.status(400).send("Improper request fields.");
  const username = safelyEscape(req.body.username);
  try {
    await connect();
    const result = await query(
      `SELECT 
        user_id, 
        password 
      FROM user 
      WHERE username = "${username}";`
    );
    await end();
    if (!result.length) return res.json(false);
    if (encryptFromKey(req.body.password, result[0].password))
      return res.json(`${result[0].user_id}`);
    return res.json(false);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
