const express = require("express");
const router = express.Router();
const makeConnection = require("../utilities/makeConnection");
const safelyEscape = require("../utilities/safelyEscape");

// /api/products

/*- POST New Product
  1. URL: `/api/products`
  2. Body: `{ productName, description, typeId, cost, brand }`
  3. Query: `INSERT INTO product (product_name, description, type_id, cost, brand) ` +
     `VALUES("${body.productName}", "${body.description}", ${body.typeId}, ${body.cost}, "${body.brand}")`
  4. Response: `{ LAST_INSERT_ID(), ...Body, mainPhotoPath }` | error
- POST New Item
  1. `/api/products/:productId`
  2. Body: `{ color, amount }`
  3. Query: `INSERT INTO item (item_color, item_amount, product_id) ` +
     `VALUES("${body.color}", ${body.amount}, ${req.param.productId})`
  4. Response: `{ LAST_INSERT_ID(), ...Body, :productId }` | error */

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
