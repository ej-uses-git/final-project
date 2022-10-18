const express = require("express");
const router = express.Router();

const makeConnection = require("../utilities/makeConnection");
const safelyEscape = require("../utilities/safelyEscape");

// /api/orders
//
//
//
//
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
////
//
//
router.post("/neworder/:userId", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  const createOrder = `INSERT INTO \`order\` (user_id,status) VALUES(${req.params.userId}, 'cart')`;
  const selectId = `SELECT LAST_INSERT_ID();`;
  try {
    await connect();
    await query(createOrder);
    const selectIdResult = await query(selectId);
    await end();
    return res.json(selectIdResult[0]["LAST_INSERT_ID()"]);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/:orderId/items", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  const createItem =
    `INSERT INTO order_item (order_id, item_id, amount) ` +
    `VALUES(${req.params.orderId}, ${req.body.itemId}, ${req.body.amount});`;
  const selectId = `SELECT LAST_INSERT_ID();`;
  try {
    await connect();
    await query(createItem);
    const selectIdResult = await query(selectId);
    await end();
    return res.json(selectIdResult[0]["LAST_INSERT_ID()"]);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
