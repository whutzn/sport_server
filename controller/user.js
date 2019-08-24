module.exports = {
  login: (req, res, next) => {
    let phone = req.query.account || req.body.account,
      password = req.query.password || req.body.password;

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
  }
};
