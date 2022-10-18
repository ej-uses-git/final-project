const express = require("express");
const router = express.Router();

const makeConnection = require("../utilities/makeConnection");

// /api/types

//* GET REQUESTS
router.get("/:typeId/products", async (req, res, next) => {
  const { connect, query, end } = makeConnection();
  let result;
  try {
    await connect();
    result = await query(
      `SELECT *
      FROM product
      WHERE type_id = ${req.params.typeId}`
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
