let multer = require("multer"),
    fs = require("fs"),
    axios = require("axios"),
    storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, "./public/class");
        },
        filename: function(req, file, cb) {
            let str = file.originalname.split(".");
            cb(null, Date.now() + "." + str[1]);
        }
    }),
    upload = multer({ storage: storage });

function uploadClassFile(req, res, next) {
    upload.single("file")(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.log("upload class file1", err);
            res.send({
                code: 1,
                desc: err
            });
        } else if (err) {
            console.log("upload class file2", err);
            res.send({
                code: 1,
                desc: err
            });
        }
        let metadata = [
            req.file.filename,
            req.file.encoding,
            req.file.mimetype,
            req.file.size,
            req.file.path,
            new Date()
        ];
        req.getConnection(function(err, conn) {
            if (err) return next(err);
            let addSQL =
                "INSERT INTO classfiles(filename, encoding, mimetype, size, filepath, addTime) VALUES ( ? )";

            conn.query(addSQL, [metadata], function(err, rows) {
                if (err) {
                    console.error("query error" + err);
                    res.send({
                        code: 1,
                        desc: "database error"
                    });
                } else {
                    res.send({
                        code: 0,
                        desc: req.file.filename
                    });
                }
            });
        });
    });
}

function addClass(req, res, next) {
    let name = req.query.name || req.body.name,
        content = req.query.content || req.body.content,
        days = req.query.days || req.body.days,
        pnames = req.query.pnames || req.body.pnames,
        storeid = req.query.storeid || req.body.storeid,
        price = req.query.price || req.body.price || 0;
    req.getConnection(function(err, conn) {
        if (err) return next(err);
        let sql = "INSERT INTO classinfo(`name`,content,days,pnames,storeid,price) VALUES (?,?,?,?,?,?);";

        conn.query(sql, [name, content, days, pnames, storeid, price], function(err, rows) {
            if (err) {
                console.error("query error", err);
                res.send({
                    code: 1,
                    desc: "add class fail"
                });
            } else {
                res.send({
                    code: 0,
                    desc: rows.insertId
                });
            }
        });
    });
}

function setClass(req, res, next) {
    let name = req.query.name || req.body.name,
        content = req.query.content || req.body.content,
        days = req.query.days || req.body.days,
        pnames = req.query.pnames || req.body.pnames,
        storeid = req.query.storeid || req.body.storeid,
        price = req.query.price || req.body.price || 0,
        id = req.query.id || req.body.id;
    req.getConnection(function(err, conn) {
        if (err) return next(err);
        let sql = "UPDATE classinfo SET `name` = ?, content = ?, days = ?, pnames = ?, storeid = ?, price = ? WHERE id = ?;";

        conn.query(sql, [name, content, days, pnames, storeid, price, id], function(err, rows) {
            if (err) {
                console.error("query error", err);
                res.send({
                    code: 1,
                    desc: "set class fail"
                });
            } else {
                res.send({
                    code: 0,
                    desc: 'set class success'
                });
            }
        });
    });
}

function removeClass(req, res, next) {
    let id = req.query.id || req.body.id;
    req.getConnection(function(err, conn) {
        if (err) return next(err);
        let sql = "DELETE FROM classinfo WHERE id = ?;";

        conn.query(sql, [id], function(err, rows) {
            if (err) {
                console.error("query error", err);
                res.send({
                    code: 1,
                    desc: "remove class fail"
                });
            } else {
                res.send({
                    code: 0,
                    desc: 'remove class success'
                });
            }
        });
    });
}

function getList(req, res, next) {
    let id = req.query.id || req.body.id || 0,
        pageSize = req.body.pageSize || req.query.pageSize || "",
        pageNum = req.body.pageNum || req.query.pageNum || "";
    req.getConnection(function(err, conn) {
        if (err) return next(err);
        let sql = "SELECT SQL_CALC_FOUND_ROWS * FROM classinfo ";

        if (id != 0) sql += "WHERE storeid = " + id;

        if (pageNum != "" && pageSize != "") {
            let start = (pageNum - 1) * pageSize;
            sql += " LIMIT " + start + "," + pageSize;
        }

        sql += ";SELECT FOUND_ROWS() AS total;";

        conn.query(sql, [], function(err, rows) {
            if (err) {
                console.error("query error", err);
                res.send({
                    code: 1,
                    desc: "get class list fail"
                });
            } else {
                rows[0].forEach(element => {
                    let pnames = element.pnames.split(','),
                        pcontents = element.content.split('$'),
                        files = [];
                    pnames.forEach(element1 => {
                        let file = "http://121.41.28.144:3000/class/" + element1;
                        files.push(file);
                    });
                    element.contents = pcontents;
                    element.files = files;
                });
                res.send({
                    code: 0,
                    desc: rows
                });
            }
        });
    });
}

module.exports = {
    uploadclassfile: uploadClassFile,
    addclass: addClass,
    setclass: setClass,
    removeclass: removeClass,
    list: getList
};