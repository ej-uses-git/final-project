const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const path = require("path");

const makeConnection = require("../utilities/makeConnection");

// /api/items

//* GET REQUESTS
// GET Photos For Item
router.get("/:itemId/photos", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let result;
  try {
    await connect();
    result = await query(
      `SELECT photos
      FROM item
      WHERE item_id = ${req.params.itemId}`
    );
    result = result[0]?.photos;
    if (!result) return res.json([]);
    result = await fs.readdir(path.join(__dirname, "../public/images", result));
    if (!(result instanceof Array)) return res.json([]);
    await end();
    res.json(result);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
