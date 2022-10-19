const express = require("express");
const router = express.Router();

const makeConnection = require("../utilities/makeConnection");
const safelyEscape = require("../utilities/safelyEscape");

// /usermanage/register

// POST New User
router.post("/", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.email ||
    !req.body.phoneNumber ||
    !req.body.address ||
    !req.body.permission
  )
    return res.status(400).send("Improper request fields.");
  const username = safelyEscape(req.body.username);
  const password = safelyEscape(req.body.password);
  const email = safelyEscape(req.body.email);
  const phoneNumber = safelyEscape(req.body.phoneNumber);
  const address = safelyEscape(req.body.address);
  const permission = safelyEscape(req.body.permission);

  const createUser =
    `INSERT INTO user (username, password, email, phone_number, address, permission) ` +
    `VALUES
    ("${username}", "${password}", "${email}", "${phoneNumber}", "${address}", "${permission}");`;
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

// CHECK User Existence
router.post("/check", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  if (!req.body.username || !req.body.email)
    return res.status(400).send("Improper request fields.");
  const username = safelyEscape(req.body.username);
  const email = safelyEscape(req.body.email);
  try {
    await connect();
    const result = await query(
      `SELECT * 
      FROM user 
      WHERE username = "${username}" 
      OR email = "${email}"`
    );
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
