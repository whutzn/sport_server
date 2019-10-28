let multer = require("multer"),
    fs = require("fs"),
    axios = require("axios"),
    storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, "./public/customer");
        },
        filename: function(req, file, cb) {
            let str = file.originalname.split(".");
            cb(null, Date.now() + "." + str[1]);
        }
    }),
    upload = multer({ storage: storage });

let uploadIconFile = (req, res, next) => {
    upload.single("file")(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.log("upload icon file1", err);
            res.send({
                code: 1,
                desc: err
            });
        } else if (err) {
            console.log("upload icon file2", err);
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
                "INSERT INTO iconfiles(filename, encoding, mimetype, size, filepath, addTime) VALUES ( ? )";

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

let uploadCustomerFile = (req, res, next) => {
    upload.single("file")(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.log("upload customer file1", err);
            res.send({
                code: 1,
                desc: err
            });
        } else if (err) {
            console.log("upload customer file2", err);
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
            new Date(),
            req.query.customerid
        ];
        req.getConnection(function(err, conn) {
            if (err) return next(err);
            let addSQL =
                "INSERT INTO customer_file(filename, encoding, mimetype, size, filepath, addTime, customerid) VALUES ( ? )";

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

let typeList = (req, res, next) => {
    let type = req.query.type || 　req.body.type || '';
    req.getConnection(function(err, conn) {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql = "SELECT * FROM sourcetype ";

        if (type != '') sql += "WHERE type = " + type;

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

let addCustomer = (req, res, next) => {
    let name = req.query.name || 　req.body.name || '',
        gender = req.query.gender || 　req.body.gender || 1,
        birth = req.query.birth || req.body.birth || '',
        age = req.query.age || req.body.age || 0,
        height = req.query.height || req.body.height || 0,
        weight = req.query.weight || req.body.weight || 0,
        wx = req.query.wx || req.body.wx || '',
        qq = req.query.qq || req.body.qq || '',
        phone = req.query.phone || req.body.phone || '',
        address = req.query.address || req.body.address || '',
        coord = req.query.coord || req.body.coord || '',
        hobby = req.query.hobby || req.body.hobby || '',
        nature = req.query.nature || req.body.nature || '',
        profession = req.query.profession || req.body.profession || '',
        remarks = req.query.remarks || req.body.remarks || '',
        pname = req.query.pname || req.body.pname || '',

        visitsource = req.query.visitsource || req.body.visitsource || '',
        performancesource = req.query.performancesource || req.body.performancesource || '',
        target = req.query.target || req.body.target || '',
        classid = req.query.classid || req.body.classid || '',
        memberid = req.query.memberid || req.body.memberid || '',
        coachid = req.query.coach || req.body.coach || '',
        saleid = req.query.sale || req.body.sale || '',
        status = req.query.status || req.body.status || '',
        storeid = req.query.storeid || req.body.storeid || 0,
        time = req.query.time || req.body.time || null,
        startTime = req.query.startTime || req.body.startTime || null,
        price = req.query.price || req.body.price || 0,
        classStatus = req.query.classStatus || req.body.classStatus || '';


    req.getConnection(function(err, conn) {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let arr2 = [visitsource, performancesource, target, classid, memberid, coachid, saleid, status, storeid, time, startTime, price, classStatus],

            sql2 = "INSERT INTO customer(visitsource,performancesource,target,classid,memberid,coach,sale,`status`,storeid,time, startTime,price, classStatus) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);";

        conn.beginTransaction(function(err) {
            if (err) { throw err; }
            conn.query(sql2, arr2, function(err, result) {
                if (err) {
                    conn.rollback(function() {
                        console.log("query error", err);
                        res.send({ code: 11, desc: err });
                        return;
                    });
                }

                let customerid = result.insertId,
                    arr1 = [name, gender, birth, age, height, weight, wx, qq, phone, address, coord, hobby, nature, profession, remarks, pname, result.insertId],

                    sql1 = "INSERT INTO customer_base ( `name`, gender, birth, age, height, weight, wx, qq, phone, address, coord, hobby, nature, profession, remarks, pname, customerid ) VALUES(?)";

                conn.query(sql1, [arr1], function(err, result) {
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
                        if(coord.indexOf(",") == -1 ) {
                            axios.post("http://localhost:3000/admin/customer/updatecoord",{
                                customerid: customerid,
                                address: address,
                                city: coord
                            });
                        }
                        res.send({ code: 0, desc: 'add customer success' });
                    });
                });
            });
        });
    });
};

let setCustomerStatus = (req, res, next) => {
    let price = req.query.price || req.body.price || 0,
        classid = req.query.classid || req.body.classid || '',
        customerid = req.query.customerid || req.body.customerid,
        endTime = req.query.endTime || req.body.endTime || null,
        storeid = req.query.storeid || req.body.storeid || 0,
        level = '普通会员';

    req.getConnection(function(err, conn) {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql2 = "SELECT * FROM setting WHERE storeid = ?";

        conn.beginTransaction(function(err) {
            if (err) { throw err; }
            conn.query(sql2, [storeid], function(err, result1) {
                if (err) {
                    conn.rollback(function() {
                        console.log("query error", err);
                        res.send({ code: 11, desc: err });
                        return;
                    });
                }

                let sql1 = "UPDATE customer SET `status` = ?,classStatus = ?, classid = ?,level = ?, endTime = ?, price = price + ? WHERE id = ?";
                if (price > result1[0].vip) level = "vip会员";

                conn.query(sql1, ['在线会员', '已续费', classid, level, endTime, price, customerid], function(err, result) {
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
                        res.send({ code: 0, desc: 'set customer status success' });
                    });
                });
            });
        });
    });

};

let setCustomer = (req, res, next) => {
    let name = req.query.name || 　req.body.name || '',
        gender = req.query.gender || 　req.body.gender || '',
        birth = req.query.birth || req.body.birth || '',
        age = req.query.age || req.body.age || 0,
        height = req.query.height || req.body.height || 0,
        weight = req.query.weight || req.body.weight || 0,
        wx = req.query.wx || req.body.wx || '',
        qq = req.query.qq || req.body.qq || '',
        phone = req.query.phone || req.body.phone || '',
        address = req.query.address || req.body.address || '',
        coord = req.query.coord || req.body.coord || '',
        hobby = req.query.hobby || req.body.hobby || '',
        nature = req.query.nature || req.body.nature || '',
        profession = req.query.profession || req.body.profession || '',
        remarks = req.query.remarks || req.body.remarks || '',
        pname = req.query.pname || req.body.pname || '',

        visitsource = req.query.visitsource || req.body.visitsource || '',
        performancesource = req.query.performancesource || req.body.performancesource || '',
        target = req.query.target || req.body.target || '',
        classid = req.query.classid || req.body.classid || '',
        memberid = req.query.memberid || req.body.memberid || '',
        coachid = req.query.coach || req.body.coach || '',
        saleid = req.query.sale || req.body.sale || '',
        status = req.query.status || req.body.status || '',
        storeid = req.query.storeid || req.body.storeid,

        time = req.query.time || req.body.time,
        startTime = req.query.startTime || req.body.startTime || null,
        price = req.query.price || req.body.price || 0,
        classStatus = req.query.classStatus || req.body.classStatus || '',
        customerid = req.query.customerid || req.body.customerid;


    req.getConnection(function(err, conn) {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql2 = "UPDATE customer SET visitsource = ?, performancesource = ?, target = ?, classid = ?, memberid = ?, coach = ?, sale = ?, `status` = ?, time = ?,startTime = ?, storeid = ?, price = ?, classStatus = ? WHERE id = ?";

        conn.beginTransaction(function(err) {
            if (err) { throw err; }
            conn.query(sql2, [visitsource, performancesource, target, classid, memberid, coachid, saleid, status, time, startTime, storeid, price, classStatus, customerid], function(err, result) {
                if (err) {
                    conn.rollback(function() {
                        console.log("query error", err);
                        res.send({ code: 11, desc: err });
                        return;
                    });
                }

                let sql1 = "UPDATE customer_base SET `name` = ?, gender = ?, birth = ?,age = ?, height = ?, weight = ?, wx = ?, qq = ?, phone = ?, address = ?, hobby = ?, nature = ?, profession = ?, remarks = ?, pname = ? WHERE customerid = ?";

                conn.query(sql1, [name, gender, birth, age, height, weight, wx, qq, phone, address, hobby, nature, profession, remarks, pname, customerid], function(err, result) {
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
                        if(coord.indexOf(",") == -1 ) {
                            axios.post("http://localhost:3000/admin/customer/updatecoord",{
                                customerid: customerid,
                                address: address,
                                city: coord
                            });
                        }
                        res.send({ code: 0, desc: 'set customer success' });
                    });
                });
            });
        });
    });
};

let customerList = (req, res, next) => {
    let storeid = req.query.storeid || 　req.body.storeid || 0,
        pageSize = req.body.pageSize || req.query.pageSize || "",
        pageNum = req.body.pageNum || req.query.pageNum || "",
        sale = req.body.sale || req.query.sale || "",
        coach = req.query.coach || req.body.coach || "",
        level = req.query.level || req.body.level || "",
        classStatus = req.query.classStatus || req.body.classStatus || '',
        status = req.query.status || req.body.status || "",
        name = req.query.name || 　req.body.name || '',
        customerid = req.query.customerid || req.body.customerid || '';

    req.getConnection(function(err, conn) {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql = "SELECT SQL_CALC_FOUND_ROWS customer.*, customer_base.* FROM customer LEFT JOIN customer_base ON customer.id = customer_base.customerid ";

        if (storeid != 0) sql += "WHERE customer.storeid = " + storeid;

        sql = searchFiled(sql, sale, 'sale');
        sql = searchFiled(sql, coach, 'coach');
        sql = searchFiled(sql, classStatus, 'classStatus');
        sql = searchFiled(sql, status, 'status');
        sql = searchFiled(sql, name, 'name');
        sql = searchFiled(sql, level, 'level');
        sql = searchFiled(sql, customerid, 'customerid');

        if (pageNum != "" && pageSize != "") {
            let start = (pageNum - 1) * pageSize;
            sql += " LIMIT " + start + "," + pageSize;
        }

        sql += ";SELECT FOUND_ROWS() AS total;";

        conn.query(sql, [], function(err, rows) {
            if (err) {
                console.log("query error", err);
                res.send({ code: 11, desc: err });
                return;
            }
            rows[0].forEach(element => {
                element.gender = element.gender == 1 ? '男' : '女';
                element.pname = "http://121.41.28.144:3000/customer/" + element.pname;
            });
            res.send({ code: 0, desc: rows });
        });
    });
};

let remove = (req, res, next) => {
    let id = req.query.id || req.body.id || 0;
    req.getConnection(function(err, conn) {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql = "DELETE customer.*, customer_base.* FROM customer LEFT JOIN customer_base ON customer.id = customer_base.customerid WHERE customer.id = ?";

        conn.query(sql, [id], function(err, rows) {
            if (err) {
                console.log("query error", err);
                res.send({ code: 11, desc: err });
                return;
            }
            res.send({ code: 0, desc: 'remove success' });
        });
    });
};


let addClass = (req, res, next) => {
    let customerid = req.query.customerid || req.body.customerid || 0,
        coachid = req.query.coachid || req.body.coachid || 0,
        coachname = req.query.coachname || req.body.coachname || '',
        date = req.query.date || req.body.date,
        time = req.query.time || req.body.time,
        remarks = req.query.remarks || req.body.remarks || '',
        saleid = req.query.saleid || req.body.saleid || '',
        salename = req.query.salename || req.body.salename || '',
        storeid = req.query.storeid || req.body.storeid || 0,
        classid = req.query.classid || req.body.classid || '';
    req.getConnection(function(err, conn) {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql = "INSERT INTO classorder(customerid,coachid,date,time,remarks,saleid,storeid,coachname,salename,classid) VALUES(?,?,?,?,?,?,?,?,?,?);";

        conn.query(sql, [customerid, coachid, date, time, remarks, saleid, storeid, coachname, salename, classid], function(err, rows) {
            if (err) {
                console.log("query error", err);
                res.send({ code: 11, desc: err });
                return;
            }
            res.send({ code: 0, desc: 'add classorder success' });
        });
    });
};

let setClass = (req, res, next) => {
    let customerid = req.query.customerid || req.body.customerid || 0,
        coachid = req.query.coachid || req.body.coachid || 0,
        coachname = req.query.coachname || req.body.coachname || '',
        date = req.query.date || req.body.date,
        time = req.query.time || req.body.time,
        remarks = req.query.remarks || req.body.remarks || '',
        saleid = req.query.saleid || req.body.saleid || '',
        salename = req.query.salename || req.body.salename || '',
        storeid = req.query.storeid || req.body.storeid || 0,
        classid = req.query.classid || req.body.classid || '';
    id = req.query.id || req.body.id;
    req.getConnection(function(err, conn) {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql = "UPDATE classorder set customerid = ?,coachid = ?,date = ?,time = ?,remarks = ?,saleid = ?,storeid = ?,coachname = ?,salename = ?,classid = ? WHERE id = ?;";

        conn.query(sql, [customerid, coachid, date, time, remarks, saleid, storeid, coachname, salename, classid, id], function(err, rows) {
            if (err) {
                console.log("query error", err);
                res.send({ code: 11, desc: err });
                return;
            }
            res.send({ code: 0, desc: 'set classorder success' });
        });
    });
};

let removeClass = (req, res, next) => {
    let id = req.query.id || req.body.id || 0;
    req.getConnection(function(err, conn) {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql = "DELETE FROM classorder WHERE id = ?";

        conn.query(sql, [id], function(err, rows) {
            if (err) {
                console.log("query error", err);
                res.send({ code: 11, desc: err });
                return;
            }
            res.send({ code: 0, desc: 'remove classorder success' });
        });
    });
};

let classList = (req, res, next) => {
    let storeid = req.query.storeid || req.body.storeid || 0,
        coachid = req.query.coachid || req.body.coachid || 0,
        saleid = req.query.saleid || req.body.saleid || 0,
        customerid = req.query.customerid || req.body.customerid || 0,
        pageSize = req.body.pageSize || req.query.pageSize || "",
        pageNum = req.body.pageNum || req.query.pageNum || "",
        date = req.body.date || req.query.date || "",
        status = req.body.status || req.query.status || 1;
    req.getConnection(function(err, conn) {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let sql = "SELECT SQL_CALC_FOUND_ROWS classorder.*, customer_base.`name` FROM classorder LEFT JOIN customer_base ON classorder.customerid = customer_base.customerid WHERE date > DATE_SUB(NOW(),INTERVAL 1 DAY) AND `status` = "+ status +" AND storeid = " + storeid;

        if (coachid != 0) sql += " AND classorder.coachid = " + coachid;
        if (customerid != 0) sql += " AND classorder.customerid = " + customerid;
        if (saleid != 0) sql += " AND classorder.saleid = " + saleid;
        if (date != "") sql += " AND classorder.date = '" + date + "'";

        if (pageNum != "" && pageSize != "") {
            let start = (pageNum - 1) * pageSize;
            sql += " LIMIT " + start + "," + pageSize;
        }

        sql += ";SELECT FOUND_ROWS() AS total;";

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

let updateCoord = (req, res, next) => {
    let customerid = req.query.customerid || req.body.customerid || 0,
    address = req.query.address || req.body.address || '',
    city = req.query.city || req.body.city || '';
    req.getConnection(function(err, conn) {
        if (err) {
            console.log("error db link", err);
            res.send({ code: 10, desc: err });
            return;
        }

        let address1 = encodeURI(address), city1 = encodeURI(city);

        axios.get(`https://restapi.amap.com/v3/geocode/geo?key=98e2c00ba0092e491d02373ffa743ad6&address=${address1}&city=${city1}`).then((respose) => {
            let resData = respose.data;
            if(resData.count > 0) {
                let sql = "UPDATE customer_base SET coord = ? WHERE customerid = ? ";
                conn.query(sql, [resData.geocodes[0].location, customerid], function(err, rows) {
                    if (err) {
                        console.log("query error", err);
                        res.send({ code: 11, desc: err });
                        return;
                    }
                    res.send({ code: 0, desc: 'set customer coord success' });
                    console.log("set customer coord success");
                });
            }else res.send({ code: 1, desc: 'set customer coord fail' });
        }).catch((err) => {
            console.log("set customer coord fail: ", err);
        });
    });
};

function searchFiled(sql, filed, name) {
    if (filed != "") {
        if (sql.indexOf("WHERE") >= 0) {
            sql += " AND " + name + "= '" + filed + "'";
        } else {
            sql += "WHERE " + name + " = '" + filed + "'";
        }
    }

    return sql;
};

module.exports = {
    uploadiconfile: uploadIconFile,
    typelist: typeList,
    addcustomer: addCustomer,
    listcustomer: customerList,
    removecustomer: remove,
    setcustomer: setCustomer,
    addclass: addClass,
    removeclass: removeClass,
    setclass: setClass,
    listclass: classList,
    addcustomerfile: uploadCustomerFile,
    setstatus: setCustomerStatus,
    updatecoord: updateCoord
};