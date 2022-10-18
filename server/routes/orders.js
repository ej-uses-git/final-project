const express = require("express");
const router = express.Router();

const makeConnection = require("../utilities/makeConnection");

// /api/orders

//* PUT REQUEST
// PUT Fulfill Order
router.put("/:orderId", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let result;
  try {
    await connect();
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

module.exports = router;
