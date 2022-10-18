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
      `SELECT 
        u.user_id, 
        u.user_name, 
        u.email, 
        u.address, 
        u.phone_number, 
        u.permission,
        o.order_id
      FROM user AS u
      JOIN \`order\` AS o
        USING (user_id)
      WHERE 
        u.user_id = ${req.params.userId}
        AND o.status = 'cart'`
    );
    console.log("\n== result ==\n", result, "\n");
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

module.exports = router;
