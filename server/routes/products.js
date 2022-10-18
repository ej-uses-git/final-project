const express = require("express");
const router = express.Router();
const makeConnection = require("../utilities/makeConnection");
const safelyEscape = require("../utilities/safelyEscape");

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

/* POST new product. */
router.post("/", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  const createProduct =
    `INSERT INTO product (product_name, description, type_id, cost, brand) ` +
    `VALUES("${req.body.productName}", "${req.body.description}", ${req.body.typeId}, ${req.body.cost}, "${req.body.brand}")`;
  const selectId = `SELECT LAST_INSERT_ID();`;
  try {
    await connect();
    await query(createProduct);
    const selectIdResult = await query(selectId);
    await end();
    return res.json(selectIdResult[0]["LAST_INSERT_ID()"]);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

/* POST new item. */
router.post("/:productId", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  const createItem =
    `INSERT INTO item (item_color, item_amount, product_id) ` +
    `VALUES("${req.body.color}", ${req.body.amount}, ${req.params.productId})`;
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
