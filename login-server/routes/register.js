const express = require("express");
const router = express.Router();
const makeConnection = require("../utilities/makeConnection");

// /usermanage/register

/* POST new user */
router.post("/", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  const createUser =
    `INSERT INTO user (username, password, email, phone_number, address, permission) ` +
    `VALUES("${req.body.username}", "${req.body.password}", "${req.body.email}", "${req.body.phoneNumber}", "${req.body.address}", "${req.body.permission}");`;
  const selectId = `SELECT LAST_INSERT_ID();`;
  try {
    await connect();
    await query(createUser);
    const selectIdResult = await query(selectId);
    await end();
    return res.json(selectIdResult[0]["LAST_INSERT_ID()"]);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

/* POST new user verfication. */
router.post("/check", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  const sql = `SELECT * FROM user WHERE username = "${req.body.username}" OR email = "${req.body.email}";`;
  try {
    await connect();
    const result = await query(sql);
    await end();
    if (result.length) return res.send(false);
    return res.send(true);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
