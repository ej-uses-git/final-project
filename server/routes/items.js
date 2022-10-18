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
    result = await fs.readdir(
      path.join(__dirname, "../public/images/items/", result)
    );
    if (!(result instanceof Array)) return res.json([]);
    await end();
    res.json(result);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/:itemId/uplodaphotos", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let dirName;
  try {
    await connect();
    dirName = await query(
      `SELECT photos
      FROM item
      WHERE item_id = ${req.params.itemId}`
    );
    dirName = dirName[0]?.photos;
    if (!result) return res.json([]);

    for (let key in req.files) {
      const file = req.files[key];
      const newPath = path.join(
        __dirname,
        "../public/images/items/",
        dirName,
        file.name
      );
      const err = await util.promisify(file.mv)(newPath);
      if (err) throw new Error("couldn't upload files");
    }

    await end();
    res.send(true);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});
module.exports = router;
