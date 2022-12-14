const { dir } = require("console");
const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const path = require("path");
const util = require("util");
const makeConnection = require("../utilities/makeConnection");
const safelyEscape = require("../utilities/safelyEscape");

// /api/products

//* GET REQUESTS
// GET Items For Product
router.get("/:productId/items", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let result;
  try {
    await connect();
    result = await query(
      `SELECT i.*,
        p.cost,
        p.product_name
      FROM item AS i
      JOIN product AS p
        USING (product_id)
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

// POST new product
router.post("/", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  try {
    await connect();
    await query(
      `INSERT INTO product (product_name, description, type_id, cost, brand) 
      VALUES(?, ?, ?, ?, ?)`,
      [
        req.body.productName,
        req.body.description,
        req.body.typeId,
        req.body.cost,
        req.body.brand,
      ]
    );
    const selectIdResult = await query(`SELECT LAST_INSERT_ID();`);
    const lastId = selectIdResult[0]["LAST_INSERT_ID()"];
    if (!lastId) throw new Error("Something went wrong.");
    const newPath = path.join(
      __dirname,
      "../public/images/items",
      req.body.productName
    );
    try {
      await fs.access(newPath);
      return res.status(400).send("Something went wrong.");
    } catch (error) {
      await fs.mkdir(newPath);
    }
    await end();
    return res.json(lastId);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

// PUT Edit Product
router.put("/:productId", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  try {
    await connect();
    await query(
      `UPDATE product 
      SET product_name = ?, 
        description = ?,
        cost = ?
      WHERE product_id = ?`,
      [
        req.body.productName,
        req.body.description,
        req.body.cost,
        req.params.productId,
      ]
    );
    let product = await query(
      `SELECT * 
      FROM product 
      WHERE product_id = ?`,
      [req.params.productId]
    );
    product = product[0];
    if (!product) return res.json(false);
    await end();
    return res.json(true);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

/* POST new item */
router.post("/:productId", async function (req, res, next) {
  const { connect, query, end } = makeConnection();
  try {
    await connect();
    await query(
      `INSERT INTO item (item_color, item_amount, product_id) 
      VALUES(?, ?, ?)`,
      [req.body.color, req.body.amount, req.params.productId]
    );
    const selectIdResult = await query(`SELECT LAST_INSERT_ID();`);
    const lastId = selectIdResult[0]["LAST_INSERT_ID()"];
    const productName = await query(
      `SELECT product_name 
      FROM product 
      WHERE product_id = ?`,
      [req.params.productId]
    );
    await query(
      `UPDATE item 
      SET photos = ? 
      WHERE item_id = ?`,
      [`${productName[0].product_name}/${lastId}`, lastId]
    );
    await end();

    const dirPath = path.join(
      __dirname,
      "../public/images/items",
      `${productName[0].product_name}/${lastId}`
    );

    try {
      await fs.access(dirPath);
    } catch (error) {
      await fs.mkdir(dirPath);
    } finally {
      return res.json(lastId);
    }
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

/* POST upload main photo */
router.post("/:productId/newphoto", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let file;
  try {
    await connect();

    file = req.files?.file;
    if (!file) return res.send(false);
    const fileName =
      req.params.productId + "." + file.name.replaceAll(/.*\./g, "");
    const newPath = path.join(
      __dirname,
      "../public/images/mainphotos",
      fileName
    );
    const err = await util.promisify(file.mv)(newPath);
    if (err) throw new Error("couldn't upload file");

    await query(
      `UPDATE product 
      SET main_photo = ? 
      WHERE product_id = ?`,
      [fileName, req.params.productId]
    );

    await end();
    res.send(true);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
