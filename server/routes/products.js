const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const path = require("path");
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
});

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
    const lastId = selectIdResult[0]["LAST_INSERT_ID()"];
    await end();
    return res.json(lastId);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

/*  const { connect, query, end } = makeConnection();
  const createProduct =
    `INSERT INTO product (product_name, description, type_id, cost, brand) ` +
    `VALUES("${req.body.productName}", "${req.body.description}", ${req.body.typeId}, ${req.body.cost}, "${req.body.brand}")`;
  const selectId = `SELECT LAST_INSERT_ID();`;
  try {
    await connect();
    await query(createProduct);
    const selectIdResult = await query(selectId);
    const lastId = selectIdResult[0]["LAST_INSERT_ID()"];
    const dirPath = path.join(
      __dirname,
      "../public/images/items/",
      `${req.body.productName}${lastId}`
    );
    await query(
      `UPDATE item SET photos = "${req.body.productName}${lastId}" WHERE item_id = ${lastId}`
    );
    await end();
    const mkdirRes = await fs.mkdir(dirPath); */

/* POST new item. */
router.post("/:productId", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  const createItem =
    `INSERT INTO item (item_color, item_amount, product_id) ` +
    `VALUES("${req.body.color}", ${req.body.amount}, ${req.params.productId})`;
  try {
    await connect();
    await query(createItem);
    const selectIdResult = await query(`SELECT LAST_INSERT_ID();`);
    const lastId = selectIdResult[0]["LAST_INSERT_ID()"];
    const productName = await query(
      `SELECT product_name FROM product WHERE product_id = ${req.params.productId}`
    );
    await query(
      `UPDATE item SET photos = "${productName[0].product_name}${lastId}" WHERE item_id = ${lastId}`
    );
    await end();

    const mkdirRes = await fs.mkdir(
      path.join(
        __dirname,
        "../public/images/items",
        `${productName[0].product_name}${lastId}`
      )
    );

    return res.json(lastId);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
