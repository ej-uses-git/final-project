const express = require("express");
const router = express.Router();
const makeConnection = require("../utilities/makeConnection");

// /usermanage/login

/* POST user login info verfication. */
router.post("/", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  const sql =
    `SELECT user_id FROM user ` +
    `WHERE username = "${req.body.username}" AND password = "${req.body.password}";`;
  try {
    await connect();
    const result = await query(sql);
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
