const express = require("express");
const router = express.Router();

const makeConnection = require("../utilities/makeConnection");

//* POST REQUESTS
// POST New Order
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

// ADD Item To Order
router.post("/:orderId/items", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  try {
    await connect();
    let amount = await query(
      `SELECT item_amount
      FROM item
      WHERE item_id = ${req.body.itemId}`
    );
    amount = amount[0].item_amount;
    if (amount < req.body.amount) {
      await end();
      return res.json(false);
    }
    let result = await query(
      `SELECT item_id 
      FROM order_item
      WHERE item_id = ${req.body.itemId}
      AND order_id = ${req.params.orderId}`
    );
    if (result.length) {
      await query(
        `UPDATE order_item
        SET amount = ${req.body.amount} + amount
        WHERE item_id = ${req.body.itemId}
        AND order_id = ${req.params.orderId}`
      );
      await end();
      return res.json({ amount: req.body.amount });
    }
    await query(
      `INSERT INTO order_item (order_id, item_id, amount)
      VALUES(${req.params.orderId}, ${req.body.itemId}, ${req.body.amount});`
    );
    const selectIdResult = await query(`SELECT LAST_INSERT_ID();`);
    await end();
    return res.json(selectIdResult[0]["LAST_INSERT_ID()"]);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

//* PUT REQUEST
// PUT Fulfill Order
router.put("/:orderId", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let result;
  try {
    await connect();
    result = await query(
      `SELECT
        i.item_id, 
        i.item_amount,
        oi.amount AS order_amount
      FROM item AS i
      JOIN order_item AS oi
      USING (item_id)
      WHERE oi.order_id = ${req.params.orderId}`
    );
    // const newResult = new Set(result.map((item) => item.item_id));
    // result = [...newResult].map((itemId) => ({
    //   item_amount: result.find((item) => item.item_id === itemId).item_amount,
    //   order_amount: result.reduce(
    //     (acc, curr) => acc + (curr.item_id === itemId ? curr.order_amount : 0),
    //     0
    //   ),
    // }));
    if (result.find((item) => item.item_amount < item.order_amount)) {
      await end();
      return res.json(false);
    }
    result = await query(
      `UPDATE \`order\`
        SET status = 'fulfilled'
        WHERE order_id = ${req.params.orderId}`
    );
    result = await query(
      `INSERT INTO purchase_history
      (order_id, purchase_date, total_cost, payment_info_id)
      VALUES
      (${req.params.orderId}, CURDATE(), ${req.body.totalCost}, ${req.body.paymentInfoId})`
    );
    result = await query(
      `SELECT *
      FROM purchase_history
      WHERE purchase_history_id = LAST_INSERT_ID();`
    );
    if (!result) throw new Error("Problem with order timing.");
    await query(
      `UPDATE item AS i
      JOIN order_item AS oi
	      USING (item_id)
      SET i.item_amount = i.item_amount - oi.amount
      WHERE oi.order_id = ${req.params.orderId};`
    );
    await end();
    res.json(result);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

// DECREASE Item Amount
router.put("/:orderId/items/:itemId", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let result;
  try {
    await connect();
    if (req.body.amount === 0) {
      result = await query(
        `DELETE FROM order_item
        WHERE order_id = ${req.params.orderId}
        AND item_id = ${req.params.itemId}`
      );
      await end();
      return res.json(true);
    }
    result = await query(
      `UPDATE order_item
      SET amount = ${req.body.amount}
      WHERE item_id = ${req.params.itemId}`
    );
    await end();
    return res.json(true);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
