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
                    "SELECT customer_base.`name`, customer.sale, customer.target, customer.coach, customer.storeid, customer_base.gender FROM customer LEFT JOIN customer_base ON customer.id = customer_base.customerid WHERE customer.id = " + customerid;

                sql2 += ";UPDATE customer SET isStandard = 2 WHERE id = " + customerid;
                conn.query(sql2, [], function(err, result1) {
                    if (err) {
                        conn.rollback(function() {
                            console.log("query error", err);
                            res.send({ code: 11, desc: err });
                            return;
                        });
                    }

                    let sql1 =
                        "INSERT INTO customer_standard(customerid,`name`,salename,coachname,gender,storeid,target) VALUES (?,?,?,?,?,?)";

                    conn.query(
                        sql1, [
                            customerid,
                            result1[0][0].name,
                            result1[0][0].sale,
                            result1[0][0].coach,
                            result1[0][0].gender,
                            result1[0][0].storeid,
                            result1[0][0].target
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
            status = req.query.status || req.body.status || 1,
            customerid = req.query.customerid || req.body.customerid || 0;

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "UPDATE customer_standard SET `status` = " + status + " WHERE id = " + id;

            if (status == 2) sql += ";UPDATE customer SET isStandard = 0 WHERE id = " + customerid;
            else if (status == 0) sql += ";UPDATE customer SET isStandard = 1 WHERE id = " + customerid;

            conn.query(sql, [], function(err, rows) {
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
    batchVerify: (req, res, next) => {
        let id = req.query.id || req.body.id || '',
            status = req.query.status || req.body.status || 1;
        customerid = req.query.customerid || req.body.customerid || '';

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "UPDATE customer_standard SET `status` = " + status + " WHERE id IN(" + id + ");";
            if (status == 2) sql += "UPDATE customer SET isStandard = 0 WHERE id IN(" + customerid + ");";
            else if (status == 0) sql += "UPDATE customer SET isStandard = 1 WHERE id IN(" + customerid + ");";

            conn.query(sql, [], function(err, rows) {
                if (err) return next("add result" + err);
                res.send(
                    JSON.stringify({
                        code: 0,
                        desc: "batch verify standard customer success"
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
            id = req.body.id || req.query.id || 0,
            salename = req.body.salename || req.query.salename || "",
            target = req.body.target || req.query.target || "",
            bmiRange = req.query.bmi ||　req.body.bmi ||　"",
            fatRange = req.query.fat || req.body.fat || "",
            gender = req.query.gender || req.body.gender || "",
            shape = req.query.shape || req.body.shape || "";

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql =
                "SELECT SQL_CALC_FOUND_ROWS customer_standard.*, customer_base.pname FROM customer_standard LEFT JOIN customer_base ON customer_standard.customerid = customer_base.customerid WHERE customer_standard.storeid = " + storeid + " AND customer_standard.`status` = " + status;

            if (salename != "") sql += " AND customer_standard.salename = '" + salename + "'";
            if (id != 0) sql += " AND customer_standard.id = " + id;
            if (target != "") sql += " AND customer_standard.target LIKE '%" + target + "%'";
            if (gender != "") sql += " AND customer_standard.gender = " + gender;
            if (shape != "") sql += " AND customer_base.shape = '" + shape + "'";
            if (bmiRange != "") {
                let bmiArray = bmiRange.split("-");
                sql += ` AND customer_base.bmi > ${parseFloat(bmiArray[0])} AND customer_base.bmi <= ${parseFloat(bmiArray[1])} `;
            }
            if (fatRange != "") {
                let fatArray = fatRange.split("-");
                sql += ` AND customer_base.fat > ${parseFloat(fatArray[0])} AND customer_base.fat <= ${parseFloat(fatArray[1])} `;
            }

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
            conn.query(sql0, function(err0, rows0) {
                if (err0) {
                    console.log('update task err: ', err0);
                    return next(err0);
                }
                let sql1 = "SELECT customer.id, customer_base.`name`, customer.`level`, customer.sale, customer_base.phone, customer.storeid FROM customer LEFT JOIN customer_base ON customer.id = customer_base.customerid WHERE customer.taskNum = 0;";
                conn.query(sql1, function(err1, rows1) {
                    if (err1) {
                        console.log('query task err: ', err1);
                        return next(err1);
                    }
                    let arr = [];
                    if (rows1.length == 0) {
                        console.log('no task today');
                        res.send({ code: 11, desc: 'no task' });
                        return;
                    } else {
                        rows1.forEach(element => {
                            arr.push([element.id, element.name, element.level, element.sale, element.phone, element.storeid, new Date()]);
                        });
                        let sql = "INSERT INTO sale_task(customerid,`name`,`level`,sale,phone,storeid,date) VALUES ?";
                        conn.query(sql, [arr], function(err, rows) {
                            if (err) {
                                console.log('query task err: ', err);
                                return next(err);
                            }
                            res.send({ code: 0, desc: 'do task' });
                        });
                    }
                });
            });
        });
    },
    taskList: (req, res, next) => {
        let storeid = req.query.storeid || req.body.storeid || 0,
            status = req.query.status || req.body.status || 1,
            pageSize = req.body.pageSize || req.query.pageSize || "",
            pageNum = req.body.pageNum || req.query.pageNum || "",
            id = req.body.id || req.query.id || 0,
            customerid = req.query.customerid || req.body.customerid || 0,
            salename = req.body.sale || req.query.sale || "";

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql =
                "SELECT SQL_CALC_FOUND_ROWS * FROM sale_task WHERE storeid = " + storeid + " AND `status` = " + status;

            if (salename != "") sql += " AND sale = '" + salename + "'";
            if (id != 0) sql += " AND id = " + id;
            if (customerid != 0) sql += " AND customerid = " + customerid;

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
    setTask: (req, res, next) => {
        let id = req.query.id || req.body.id || 0,
            status = req.query.status || req.body.status || 1,
            remarks = req.query.remarks || req.body.remarks || '';

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "UPDATE sale_task SET remarks = ?, `status` = ? WHERE id = ?";

            conn.query(sql, [remarks, status, id], function(err, rows) {
                if (err) return next("add result" + err);
                res.send(
                    JSON.stringify({
                        code: 0,
                        desc: "set task success"
                    })
                );
            });
        });
    },
    removeTask: (req, res, next) => {
        let id = req.query.id || req.body.id || 0;

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "DELETE FROM sale_task WHERE id = ?";

            conn.query(sql, [id], function(err, rows) {
                if (err) return next("add result" + err);
                res.send(
                    JSON.stringify({
                        code: 0,
                        desc: "remove task success"
                    })
                );
            });
        });
    },
    getStatistics: (req, res, next) => {
        let storeid = req.query.storeid || req.body.storeid || 0,
            queryString = '',
            startTime = req.query.startTime || req.body.startTime || "",
            endTime = req.query.endTime || req.body.endTime || "";

        req.getConnection(function(err, conn) {
            if (err) return next(err);
            if (storeid != 0) queryString = 'WHERE storeid = ' + storeid;

            let sql = `SELECT performancesource, COUNT(performancesource) AS count FROM customer ${queryString} GROUP BY performancesource;SELECT classStatus, COUNT(classStatus) AS count FROM customer ${queryString} GROUP BY classStatus;
          SELECT sale, count(case when classStatus ='已续费' then 1 end) as 续课会员, count(case when classStatus<>'跟踪客户' then 1 end) as 所有会员 FROM customer ${queryString} GROUP BY sale;SELECT count(case when classStatus ='已续费' then 1 end) as 续课会员, count(case when classStatus<>'跟踪客户' then 1 end) as 所有会员 FROM customer ${queryString};
          SELECT coach, count(case when classStatus ='已续费' then 1 end) as 续课会员, count(case when classStatus<>'跟踪客户' then 1 end) as 所有会员 FROM customer ${queryString} GROUP BY coach;`;

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
    batchTask: (req, res, next) => {
        let id = req.query.id || req.body.id || '';
        coach = req.query.coach || req.body.coach || '',
            sale = req.query.sale || req.body.sale || '',
            sql = "DELETE FROM customer WHERE id IN(";

        if (id == '') {
            res.send({ code: 1, desc: 'no id' });
            return;
        }

        if (coach != '') {
            sql = "UPDATE customer SET coach = '" + coach + "' WHERE id IN(" + id + ");";
        } else if (sale != '') {
            sql = "UPDATE customer SET sale = '" + sale + "' WHERE id IN(" + id + ");";
        } else sql += id + ");";

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            conn.query(sql, [], function(err, rows) {
                if (err) {
                    console.log(sql);
                    console.log("batch result" + err);
                    return next("batch result" + err);
                }
                res.send(
                    JSON.stringify({
                        code: 0,
                        desc: "batch task success"
                    })
                );
            });
        });
    },
};