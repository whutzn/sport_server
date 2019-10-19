module.exports = {
  add: (req, res, next) => {
    let customerid = req.query.customerid || req.body.customerid || 0;

    req.getConnection(function(err, conn) {
      if (err) return next(err);

      conn.beginTransaction(function(err) {
        if (err) {
          throw err;
        }

        let sql2 =
          "SELECT customer_base.`name`, customer.sale, customer.coach, customer.storeid, customer_base.gender FROM customer LEFT JOIN customer_base ON customer.id = customer_base.customerid WHERE customer.id = ?";
        conn.query(sql2, [customerid], function(err, result1) {
          if (err) {
            conn.rollback(function() {
              console.log("query error", err);
              res.send({ code: 11, desc: err });
              return;
            });
          }

          let sql1 =
            "INSERT INTO customer_standard(customerid,`name`,salename,coachname,gender,storeid) VALUES (?,?,?,?,?,?)";

          conn.query(
            sql1,
            [
              customerid,
              result1[0].name,
              result1[0].sale,
              result1[0].coach,
              result1[0].gender,
              result1[0].storeid
            ],
            function(err, result) {
              if (err) {
                conn.rollback(function() {
                  console.log("query error", err);
                  res.send({ code: 11, desc: err });
                  return;
                });
              }
              conn.commit(function(err) {
                if (err) {
                  conn.rollback(function() {
                    console.log("query error", err);
                    res.send({ code: 11, desc: err });
                    return;
                  });
                }
                res.send({ code: 0, desc: "add standard customer success" });
              });
            }
          );
        });
      });
    });
  },
  remove: (req, res, next) => {
    let id = req.query.id || req.body.id || 0;

    req.getConnection(function(err, conn) {
      if (err) return next(err);

      let sql = "DELETE FROM customer_standard WHERE id = ?";

      conn.query(sql, [id], function(err, rows) {
        if (err) return next("add result" + err);
        res.send(
          JSON.stringify({
            code: 0,
            desc: "remove standard customer success"
          })
        );
      });
    });
  },
  verify: (req, res, next) => {
    let id = req.query.id || req.body.id || 0,
      status = req.query.status || req.body.status || 1;

    req.getConnection(function(err, conn) {
      if (err) return next(err);

      let sql = "UPDATE customer_standard SET `status` = ? WHERE id = ?;";

      conn.query(sql, [status, id], function(err, rows) {
        if (err) return next("add result" + err);
        res.send(
          JSON.stringify({
            code: 0,
            desc: "verify standard customer success"
          })
        );
      });
    });
  },
  getList: (req, res, next) => {
    let storeid = req.query.storeid || req.body.storeid || 0,
      status = req.query.status || req.body.status || 0,
      pageSize = req.body.pageSize || req.query.pageSize || "",
      pageNum = req.body.pageNum || req.query.pageNum || "",
      salename = req.body.salename || req.query.salename || "";

    req.getConnection(function(err, conn) {
      if (err) return next(err);

      let sql =
        "SELECT SQL_CALC_FOUND_ROWS * FROM customer_standard WHERE storeid = " + storeid + " AND `status` = "+ status;

      if(salename != "") sql += " AND salename = '" + salename +"'"; 

      if (pageNum != "" && pageSize != "") {
        let start = (pageNum - 1) * pageSize;
        sql += " LIMIT " + start + "," + pageSize;
      }

      sql += ";SELECT FOUND_ROWS() AS total;";

      conn.query(sql, [], function(err, rows) {
        if (err) return next("add result" + err);
        res.send(
          JSON.stringify({
            code: 0,
            desc: rows
          })
        );
      });
    });
  },
  updateStatusAndTask: (req, res, next) => {

    req.getConnection(function(err, conn) {
        if (err) return next(err);

        let sql0 = "UPDATE customer SET taskNum = CASE `level` WHEN 'vip会员' THEN MOD(DATEDIFF(NOW(),time),15) WHEN '普通会员' THEN MOD(DATEDIFF(NOW(),time),30) WHEN '到期会员' THEN MOD(DATEDIFF(NOW(),time),90) END WHERE `level` IN ('vip会员','普通会员','到期会员') AND time IS NOT NULL;"
        conn.query(sql0, function(err0,rows0) {
          if(err0) {
            console.log('update task err: ', err0);
            return next(err0);
          }
          let sql1 = "SELECT customer.id, customer_base.`name`, customer.`level`, customer.sale, customer_base.phone, customer.storeid FROM customer LEFT JOIN customer_base ON customer.id = customer_base.customerid WHERE customer.taskNum = 0;";
          conn.query(sql1, function(err1, rows1){
            if(err1) {
              console.log('query task err: ', err1);
              return next(err1);
            }
            let arr = [];
            if(rows1.length == 0) {
              console.log('no task today');
              res.send({code:11,desc:'no task'});
              return;
            }else {
              rows1.forEach(element => {
                arr.push([element.id,element.name,element.level,element.sale,element.phone,element.storeid, new Date()]);
              });
              let sql = "INSERT INTO sale_task(customerid,`name`,`level`,sale,phone,storeid,date) VALUES ?";
              conn.query(sql,[arr],function(err,rows){
                if(err) {
                  console.log('query task err: ', err);
                  return next(err);
                }
                res.send({code:0,desc:'do task'});
              });
            }
          });
        });
    });
},
};
