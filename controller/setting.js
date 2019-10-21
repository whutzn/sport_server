module.exports = {
    add: (req, res, next) => {
        let general = req.query.general || req.body.general || 0,
            vip = req.query.vip || req.body.vip || 0,
            deadline = req.query.deadline || req.body.deadline || 0,
            renew = req.query.renew || req.body.renew || 0,
            storeid = req.query.storeid || req.body.storeid;

        req.getConnection(function(err, conn) {
            if (err) return next(err);
            let sql =
                "INSERT INTO setting(general,vip,deadline,renew,storeid) VALUES (?,?,?,?,?);";

            conn.query(sql, [general, vip, deadline, renew, storeid], function(err, rows) {
                if (err) {
                    console.error("query error", err);
                    res.send({
                        code: 1,
                        desc: "add setting fail"
                    });
                } else {
                    res.send({
                        code: 0,
                        desc: rows.insertId
                    });
                }
            });
        });
    },
    set: (req, res, next) => {
        let general = req.query.general || req.body.general,
            vip = req.query.vip || req.body.vip,
            deadline = req.query.deadline || req.body.deadline,
            renew = req.query.renew || req.body.renew,
            storeid = req.query.storeid || req.body.storeid;

        req.getConnection(function(err, conn) {
            if (err) return next(err);
            let sql =
                "UPDATE setting SET general = ?, vip = ?, deadline = ?, renew = ? WHERE storeid = ?;";

            conn.query(sql, [general, vip, deadline, renew, storeid], function(err, rows) {
                if (err) {
                    console.error("query error", err);
                    res.send({
                        code: 1,
                        desc: "set setting fail"
                    });
                } else {
                    res.send({
                        code: 0,
                        desc: 'set setting success'
                    });
                }
            });
        });
    },
    setTaskTime: (req, res, next) => {
        let general = req.query.generalDate || req.body.generalDate || 0,
            vip = req.query.vipDate || req.body.vipDate || 0,
            deadline = req.query.deadlineDate || req.body.deadlineDate || 0,
            storeid = req.query.storeid || req.body.storeid;

        req.getConnection(function(err, conn) {
            if (err) return next(err);
            let sql =
                "UPDATE setting SET generalDate = ?, vipDate = ?, deadlineDate = ? WHERE storeid = ?;";

            conn.query(sql, [general, vip, deadline, storeid], function(err, rows) {
                if (err) {
                    console.error("query error", err);
                    res.send({
                        code: 1,
                        desc: "set setting fail"
                    });
                } else {
                    res.send({
                        code: 0,
                        desc: 'set setting success'
                    });
                }
            });
        });
    },
    remove: (req, res, next) => {
        let storeid = req.query.storeid || req.body.storeid;

        req.getConnection(function(err, conn) {
            if (err) return next(err);
            let sql =
                "DELETE FROM setting WHERE storeid = ?;";

            conn.query(sql, [storeid], function(err, rows) {
                if (err) {
                    console.error("query error", err);
                    res.send({
                        code: 1,
                        desc: "remove setting fail"
                    });
                } else {
                    res.send({
                        code: 0,
                        desc: 'remove setting success'
                    });
                }
            });
        });
    },
    list: (req, res, next) => {
        let storeid = req.query.storeid || req.body.storeid || 0;

        req.getConnection(function(err, conn) {
            if (err) return next(err);
            let sql = "SELECT * FROM setting ";

            if (storeid != 0) sql += "WHERE storeid = " + storeid;

            conn.query(sql, [], function(err, rows) {
                if (err) {
                    console.error("query error", err);
                    res.send({
                        code: 1,
                        desc: "get setting fail"
                    });
                } else {
                    res.send({
                        code: 0,
                        desc: rows
                    });
                }
            });
        });
    }
};