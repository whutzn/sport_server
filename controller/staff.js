let login = (req, res, next) => {
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

        let sql = "SELECT * FROM staff WHERE account = ? ";

        conn.query(sql, [phone], function(err, rows) {
            if (err) return next("login error" + err);

            if (rows.length == 0) {
                res.send(
                    JSON.stringify({
                        code: 2,
                        desc: "no user"
                    })
                );
            } else if (rows[0].password != password) {
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
                        desc: rows[0]
                    })
                );
            }
        });
    });
};

let typeList = (req, res, next) => {
    req.getConnection(function(err, conn) {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql = "SELECT * FROM `type`;";

        conn.query(sql, [], function(err, rows) {
            if (err) {
                console.log("query error", err);
                res.send({ code: 11, desc: err });
                return;
            }
            res.send({ code: 0, desc: rows });
        });
    });
};

let addStaff = (req, res, next) => {
    let account = req.query.account || req.body.account || "",
        password = req.query.password || req.body.password || "",
        name = req.query.name || req.body.name || "",
        type = req.query.type || req.body.type || "",
        storeid = req.query.storeid || req.body.storeid || "";

    req.getConnection((err, conn) => {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql =
            "INSERT INTO staff(`name`,account,password,type,storeid) VALUES (?,?,?,?,?);";

        conn.query(sql, [name, account, password, type, storeid], (err, rows) => {
            if (err) {
                console.log("query error", err);
                if (err.hasOwnProperty("errno") && err.errno == 1062)
                    res.send({ code: 12, desc: "Duplicate account" });
                else res.send({ code: 11, desc: err });
                return;
            }
            res.send({ code: 0, desc: rows.insertId });
        });
    });
};

let setStaff = (req, res, next) => {
    let account = req.query.account || req.body.account || "",
        password = req.query.password || req.body.password || "",
        name = req.query.name || req.body.name || "",
        type = req.query.type || req.body.type || "",
        storeid = req.query.storeid || req.body.storeid || "",
        id = req.query.id || req.body.id || "";

    req.getConnection((err, conn) => {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql =
            "UPDATE staff SET name = ?, account = ?,password = ?, type = ?, storeid = ? WHERE id = ?;";

        conn.query(
            sql, [name, account, password, type, storeid, id],
            (err, rows) => {
                if (err) {
                    console.log("query error", err);
                    if (err.hasOwnProperty("errno") && err.errno == 1062)
                        res.send({ code: 12, desc: "Duplicate account" });
                    else res.send({ code: 11, desc: err });
                    return;
                }
                res.send({ code: 0, desc: "set success" });
            }
        );
    });
};

let removeStaff = (req, res, next) => {
    let id = req.query.id || req.body.id || "";

    req.getConnection((err, conn) => {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql = "DELETE FROM staff WHERE id = ?;";

        conn.query(sql, [id], (err, rows) => {
            if (err) {
                console.log("query error", err);
                res.send({ code: 11, desc: err });
                return;
            }
            res.send({ code: 0, desc: "remove success" });
        });
    });
};

let listStaff = (req, res, next) => {
    let id = req.query.id || req.body.id || "",
        key = req.body.key || req.query.key || "",
        type = req.body.type || req.query.type || "",
        pageSize = req.body.pageSize || req.query.pageSize || "",
        pageNum = req.body.pageNum || req.query.pageNum || "";

    req.getConnection((err, conn) => {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql = "SELECT * FROM staff ";
        let sql0 = "SELECT COUNT(*) as count FROM staff ";

        if (id != "") {
            sql += "WHERE storeid = " + id;
            sql0 += "WHERE storeid = " + id;
        }

        if (type != "") {
            if (sql.indexOf("WHERE") >= 0) {
                sql += " AND type = '" + type + "'";
                sql0 += " AND type = '" + type + "'";
            } else {
                sql += "WHERE type = '" + type + "'";
                sql0 += "WHERE type = '" + type + "'";
            }
        }

        if (pageNum != "" && pageSize != "") {
            let start = (pageNum - 1) * pageSize;
            sql += " LIMIT " + start + "," + pageSize;
        }

        let querySql = sql + ";" + sql0;

        conn.query(querySql, [], (err, rows) => {
            if (err) {
                console.log("query error", err);
                res.send({ code: 11, desc: err });
                return;
            }
            res.send({ code: 0, desc: rows[0], count: rows[1][0].count });
        });
    });
};

module.exports = {
    login: login,
    type: typeList,
    add: addStaff,
    set: setStaff,
    remove: removeStaff,
    list: listStaff
};