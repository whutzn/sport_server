module.exports = {
  login: (req, res, next) => {
    let phone = req.query.account || req.body.account || "",
      password = req.query.password || req.body.password || "";

    if (phone == "" || password == "") {
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

      let sql = "SELECT pwd FROM usr WHERE user = ? ";

      conn.query(sql, [phone], function(err, rows) {
        if (err) return next("login error" + err);

        if (rows.length == 0) {
          res.send(
            JSON.stringify({
              code: 2,
              desc: "no user"
            })
          );
        } else if (rows[0].pwd != password) {
          res.send(
            JSON.stringify({
              code: 1,
              desc: "wrong password"
            })
          );
        } else {
          res.send(
            JSON.stringify({
              code: 0,
              desc: "login success"
            })
          );
        }
      });
    });
  },
  fixPwd: (req, res, next) => {
    let password = req.query.password || req.body.password || '';

    if (password == "") {
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

      var sql = "UPDATE usr SET pwd = ? WHERE user = 'admin' ";

      conn.query(sql, [password], function(err, rows) {
        if (err) {
          res.send(
            JSON.stringify({
              code: 1,
              desc: "set pwd error"
            })
          );
          return next("login error" + err);
        } else
          res.send(
            JSON.stringify({
              code: 0,
              desc: "set pwd success"
            })
          );
      });
    });
  }
};
