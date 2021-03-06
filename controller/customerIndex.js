let axios = require("axios");
let mysql = require("mysql");

module.exports = {
    addWeight: (req, res, next) => {
        let customerid = req.query.customerid || req.body.customerid || 0,
            weight = req.query.weight || req.body.weight || 0,
            date = req.query.date || req.body.date || "";

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql1 = "SELECT * FROM customer_weight WHERE customerid = ? AND date = ? ;",
                sql = '';

            conn.query(sql1, [customerid, date], function(err, rows) {
                if (err) return next("add weight" + err);
                if (rows.length == 0) sql = "INSERT INTO customer_weight(weight,customerid,date) VALUES(?,?,?);";
                else sql = "UPDATE customer_weight SET weight = ? WHERE customerid = ? AND date = ?;";
                conn.query(sql, [weight, customerid, date], function(err, rows1) {
                    if (err) return next("add weight" + err);
                    res.send(
                        JSON.stringify({
                            code: 0,
                            desc: "add weight success"
                        })
                    );
                });
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

            let sql = "SELECT * FROM customer_weight WHERE customerid = ? ORDER BY date";

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
                "UPDATE customer_index SET `index` = ? WHERE customerid = ?;";

            if (mode == 0) sql = "INSERT INTO customer_index (`index`,customerid) VALUES(?,?)";

            conn.query(sql, [index, customerid], function(err, rows) {
                if (err) {
                    console.log("add index", err);
                    return next("add index" + err);
                }
                let indexObj = JSON.parse(index),
                    bmiIndex = 0,
                    fatIndex = 0,
                    indexArray = indexObj.bodyTableRow;

                if (indexArray.length > 0) {
                    bmiIndex = indexArray[indexArray.length - 1][6] == '' ? 0 : parseFloat(indexArray[indexArray.length - 1][6])
                    fatIndex = indexArray[indexArray.length - 1][3] == '' ? 0 : parseFloat(indexArray[indexArray.length - 1][3])

                    axios.post("http://localhost:3000/admin/customer/uploadbmi", {
                        customerid: customerid,
                        bmi: bmiIndex,
                        fat: fatIndex
                    });
                }
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
    },
    getImage: (req, res, next) => {
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

            let sql = "SELECT filename, addTime FROM customer_file WHERE customerid = ?";

            conn.query(sql, [customerid], function(err, rows) {
                if (err) return next("get image" + err);
                rows.forEach(element => {
                    element.filename = "http://121.41.28.144:3000/customer/" + element.filename;
                });
                res.send(
                    JSON.stringify({
                        code: 0,
                        desc: rows
                    })
                );
            });
        });
    },
    addResult: (req, res, next) => {
        let customerid = req.query.customerid || req.body.customerid || 0,
            result = req.query.result || req.body.result || "",
            classid = req.query.classid || req.body.classid || 0,
            day = req.query.day || req.body.day || 0;

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "INSERT INTO customer_result(customerid,classid,`day`,result) VALUES(?,?,?,?);";


            conn.query(sql, [customerid, classid, day, result], function(err, rows) {
                if (err) return next("add result" + err);
                res.send(
                    JSON.stringify({
                        code: 0,
                        desc: "add result success"
                    })
                );
            });
        });
    },
    getResult: (req, res, next) => {
        let customerid = req.query.customerid || req.body.customerid || 0,
            classid = req.query.classid || req.body.classid || 0,
            day = req.query.day || req.body.day || 0;

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "SELECT result FROM customer_result WHERE customerid = ? AND classid = ? AND day = ?";


            conn.query(sql, [customerid, classid, day], function(err, rows) {
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
    signClass: (req, res, next) => {
        let id = req.query.id || req.body.id || 0;

        req.getConnection(function(err, conn) {
            if (err) return next(err);
            conn.beginTransaction(function(err) {
                if (err) { throw err; }
                let sql2 = "SELECT classorder.customerid, classorder.classid AS class1, customer.classid AS class2 FROM classorder LEFT JOIN customer ON customer.id = classorder.customerid WHERE classorder.id = ?";

                conn.query(sql2, [id], function(err, result1) {
                    if (err) {
                        conn.rollback(function() {
                            console.log("query error", err);
                            res.send({ code: 11, desc: err });
                            return;
                        });
                    }

                    let curClass = JSON.parse(result1[0].class1),
                        classList = JSON.parse(result1[0].class2.replace(/[\r\n\s+]/g, ''));

                    for (let index = 0; index < classList.length; index++) {
                        if (classList[index].id == curClass.id) {
                            classList[index].last--;
                            break;
                        }
                    }

                    let sql1 = "UPDATE classorder SET `status` = 0 WHERE id = " + id;
                    sql1 += ";UPDATE customer SET classid = " + mysql.escape(JSON.stringify(classList)) + " WHERE id = " + result1[0].customerid;

                    conn.query(sql1, [], function(err, result) {
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
                            res.send({ code: 0, desc: 'sign class order success' });
                        });
                    });
                });
            });
        });
    },
    getClassByCustomerid: (req, res, next) => {
        let customerid = req.query.customerid || req.body.customerid || 0;
        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "SELECT classid AS classList FROM customer WHERE id = ?";


            conn.query(sql, [customerid], function(err, rows) {
                if (err) return next("add result" + err);
                res.send(
                    JSON.stringify({
                        code: 0,
                        desc: rows[0]
                    })
                );
            });
        });
    },
    setClassByCustomerid: (req, res, next) => {
        let customerid = req.query.customerid || req.body.customerid || 0,
            classid = req.query.classid || req.body.classid || '';

        req.getConnection(function(err, conn) {
            if (err) {
                console.log('set classid error', err);
                return next(err);
            }

            let sql = "UPDATE customer SET classid = ? WHERE id = ?";


            conn.query(sql, [classid, customerid], function(err, rows) {
                if (err) {
                    console.log('set classid result', err);
                    return next("add result" + err);
                }
                res.send(
                    JSON.stringify({
                        code: 0,
                        desc: 'set class success'
                    })
                );
            });
        });
    },
    stopClass: (req, res, next) => {
        let customerid = req.query.customerid || req.body.customerid || 0;
        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "UPDATE customer SET classStatus = '已停课', `status` = '停课会员' WHERE id = ?";


            conn.query(sql, [customerid], function(err, rows) {
                if (err) return next("add result" + err);
                res.send(
                    JSON.stringify({
                        code: 0,
                        desc: 'stop class success'
                    })
                );
            });
        });
    },
    buyCard: (req, res, next) => {
        let customerid = req.query.customerid || req.body.customerid || 0,
            endTime = req.query.endTime || req.body.endTime || null,
            time = req.query.time || req.body.time || null,
            price = req.query.price || req.body.price || 0,
            memberid = req.query.memberid || req.body.memberid || '';

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "UPDATE customer SET endTime = ?,level= '普通会员', time = ?, price = ?, memberid = ?, `status` = '在线会员' WHERE id = ?";

            conn.query(sql, [endTime, time, price, memberid, customerid], function(err, rows) {
                if (err) return next("add result" + err);
                let sql1 = "SELECT storeid FROM customer WHERE id = ?";
                conn.query(sql1, [customerid], function(err, rows1) {
                    if (err) return next("add result" + err);
                    let sql2 = "SELECT * FROM setting WHERE storeid = ?";
                    conn.query(sql2, [rows1[0].storeid], function(err, rows2) {
                        if (err) return next("add result" + err);
                        if (price > rows2[0].vip) {
                            let level = "vip会员",
                                sql3 = "UPDATE customer SET `level` = ? WHERE id = ?";
                            conn.query(sql3, [level, customerid], function(err, rows3) {
                                if (err) return next("add result" + err);
                                res.send(
                                    JSON.stringify({
                                        code: 0,
                                        desc: 'buy card success'
                                    })
                                );
                            });
                        } else res.send(
                            JSON.stringify({
                                code: 0,
                                desc: 'buy card success'
                            })
                        );
                    });

                });
            });
        });
    },
    uploadBmi: (req, res, next) => {
        let customerid = req.query.customerid || req.body.customerid || 0,
            bmi = req.query.bmi || 　req.body.bmi || 　0,
            fat = req.query.fat || req.body.fat || 0;

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "UPDATE customer_base SET bmi = ?, fat = ? WHERE customerid = ?";

            conn.query(sql, [bmi, fat, customerid], function(err, rows) {
                if (err) {
                    console.log("upload bmi", err);
                    return next("upload bmi" + err);
                }
                res.send(
                    JSON.stringify({
                        code: 0,
                        desc: 'upload bmi success'
                    })
                );
            });
        });
    }
};