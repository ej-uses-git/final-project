const express = require("express");
const router = express.Router();

const makeConnection = require("../utilities/makeConnection");

// /api/products

//* GET REQUESTS
// GET Products For Type
router.get("/:productId/items", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let result;
  try {
    await connect();
    result = await query(
      `SELECT *
      FROM item
      WHERE product_id = ${req.params.productId}`
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
