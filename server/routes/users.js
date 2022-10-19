const express = require("express");
const router = express.Router();

const makeConnection = require("../utilities/makeConnection");
const safelyEscape = require("../utilities/safelyEscape");

// /api/users

//* GET REQUESTS
// GET User Info
router.get("/:userId/info", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let result;
  try {
    await connect();
    result = await query(
      `SELECT 
        u.user_id, 
        u.username, 
        u.email, 
        u.address, 
        u.phone_number, 
        u.permission,
        o.order_id
      FROM user AS u
      LEFT JOIN \`order\` AS o
        USING (user_id)
      WHERE 
        u.user_id = ${req.params.userId}
        AND (o.status = 'cart' OR u.permission = 'admin')`
    );

    await end();
    res.json(result[0]);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

// GET Cart For User
router.get("/:userId/cart/:cartId", async (req, res, next) => {
  const { connect, query, end } = makeConnection();

  let result;
  try {
    await connect();
    result = await query(
      `SELECT 
        oi.amount,
        p.product_name,
        i.*
      FROM \`order\` AS o
      JOIN order_item AS oi
        USING (order_id)
      JOIN item AS i
        USING (item_id)
      JOIN product AS p
        USING (product_id)
      WHERE o.order_id = ${req.params.cartId}
      AND o.status = 'cart'`
    );
    await end();
    res.json(result);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

// GET Purchase History For User
router.get("/:userId/purchase%20history", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let result;
  try {
    await connect();
    result = await query(
      `SELECT *
      FROM purchase_history AS ph
      JOIN \`order\` AS o
        USING (order_id)
      WHERE o.user_id = ${req.params.userId} `
    );
    await end();
    res.json(result);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/:userId/payment%20methods", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let result;
  try {
    await connect();
    result = await query(
      `SELECT *
      FROM payment_info
      WHERE user_id = ${req.params.userId}`
    );
    await end();
    res.json(result);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

//* POST REQUESTS
// POST new payment info
router.post("/:userId/pay", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  const createPay =
    `INSERT INTO payment_info (credit_number, cvv, expiration_date, user_id, active) ` +
    `VALUES(${req.body.creditNum}, ${req.body.cvv}, '${req.body.expDate}', ${req.params.userId}, true);`;
  const updateActive = `UPDATE payment_info SET active = false WHERE user_id = ${req.params.userId};`;
  const selectId = `SELECT LAST_INSERT_ID();`;
  try {
    await connect();
    await query(updateActive);
    await query(createPay);
    const selectIdResult = await query(selectId);
    await end();
    return res.json(selectIdResult[0]["LAST_INSERT_ID()"]);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

//* PUT REQUESTS
// PUT Fulfill Order
router.put("/:userId/activepay", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let result;
  try {
    await connect();
    result = await query(
      `UPDATE payment_info 
      SET active = false
      WHERE user_id = ${req.params.userId};`
    );
    if (result instanceof Error) throw result;
    result = await query(
      `UPDATE payment_info SET active = true
      WHERE payment_info_id = ${req.body}`
    );
    if (result instanceof Error) throw result;
    await end();
    result.json(true);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
