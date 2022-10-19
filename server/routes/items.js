const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const path = require("path");
const util = require("util");
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
    try {
      await fs.access(path.join(__dirname, "../public/images/items/", result));
    } catch (error) {
      return res.json(false);
    }
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

//* POST REQUESTS
// UPLOAD New Photo For Item
router.post("/:itemId/uploadphotos", async (req, res, next) => {
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
    if (!dirName) return res.json([]);
    if (!req.files) return res.send(false);

    for (let key in req.files) {
      console.log("\n== dirname ==\n", dirName, "\n");
      const file = req.files[key];
      console.log("\n== file ==\n", file, "\n");
      const newPath = path.join(
        __dirname,
        "../public/images/items",
        dirName,
        file.name
      );
      const err = await util.promisify(file.mv)(newPath);
      if (err) throw new Error("couldn't upload files");
    }

    await end();
    res.json(true);
  } catch (error) {
    if (!error.fatal) await end();
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
