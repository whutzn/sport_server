module.exports = {
  addWeight: (req, res, next) => {
    let customerid = req.query.customerid || req.body.customerid || 0,
      weight = req.query.weight || req.body.weight || 0,
      date = req.query.date || req.body.date || "";

    req.getConnection(function(err, conn) {
      if (err) return next(err);

      let sql =
        "INSERT INTO customer_weight(customerid,weight,date) VALUES(?,?,?);";

      conn.query(sql, [customerid, weight, date], function(err, rows) {
        if (err) return next("add weight" + err);
        res.send(
          JSON.stringify({
            code: 0,
            desc: "add weight success"
          })
        );
      });
    });
  },
  getWeight: (req, res, next) => {
    let customerid = req.query.customerid || req.body.customerid || 0;
    if (customerid == 0) {
      res.send(
        JSON.stringify({
          code: 3,
          desc: "invalid input"
        })
      );
      return;
    }

    req.getConnection(function(err, conn) {
      if (err) return next(err);

      let sql = "SELECT * FROM customer_weight WHERE customerid = ?";

      conn.query(sql, [customerid], function(err, rows) {
        if (err) return next("get weight" + err);
        res.send(
          JSON.stringify({
            code: 0,
            desc: rows
          })
        );
      });
    });
  },
  addIndex: (req, res, next) => {
    let customerid = req.query.customerid || req.body.customerid || 0,
      index = req.query.index || req.body.index || "",
      mode = req.query.mode || req.body.mode || 0;

    req.getConnection(function(err, conn) {
      if (err) return next(err);

      let sql =
        "	UPDATE customer_index SET `index` = ? WHERE customerid = ?;";

      if(mode == 0) sql = "INSERT INTO customer_index (`index`,customerid) VALUES(?,?)";

      conn.query(sql, [index, customerid], function(err, rows) {
        if (err) return next("add index" + err);
        res.send(
          JSON.stringify({
            code: 0,
            desc: "add index success"
          })
        );
      });
    });
  },
  getIndex: (req, res, next) => {
    let customerid = req.query.customerid || req.body.customerid || 0;
    if (customerid == 0) {
      res.send(
        JSON.stringify({
          code: 3,
          desc: "invalid input"
        })
      );
      return;
    }

    req.getConnection(function(err, conn) {
      if (err) return next(err);

      let sql = "SELECT * FROM customer_index WHERE customerid = ?";

      conn.query(sql, [customerid], function(err, rows) {
        if (err) return next("get index" + err);
        res.send(
          JSON.stringify({
            code: 0,
            desc: rows
          })
        );
      });
    });
  }
};
