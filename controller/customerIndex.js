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

            if (mode == 0) sql = "INSERT INTO customer_index (`index`,customerid) VALUES(?,?)";

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
    }
};