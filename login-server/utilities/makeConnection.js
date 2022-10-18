const mysql = require("mysql");
const util = require("util");

function makeConnection() {
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hilma",
    database: "store",
  });

  const connect = util.promisify(con.connect).bind(con);
  const query = util.promisify(con.query).bind(con);
  const end = util.promisify(con.end).bind(con);

  return { connect, query, end };
}

module.exports = makeConnection;
