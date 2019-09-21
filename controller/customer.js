let multer = require("multer"),
  fs = require("fs"),
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
      console.log("upload store file1", err);
      res.send({
        code: 1,
        desc: err
      });
    } else if (err) {
      console.log("upload store file2", err);
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
            desc: rows.insertId
          });
        }
      });
    });
  });
}

let typeList = (req, res, next) => {
  let type = req.query.type ||　req.body.type || '';
  req.getConnection(function(err, conn) {
    if (err) {
      console.log("error db link", err);
      res.send({ code: 10, desc: err });
      return;
    }

    let sql = "SELECT * FROM sourcetype ";

    if(type != '') sql += "WHERE type = " + type;

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
  let name = req.query.name ||　req.body.name || '', gender = req.query.gender ||　req.body.gender || '', birth = req.query.birth || req.body.birth || '',
   height = req.query.height || req.body.height || '', weight = req.query.weight || req.body.weight || '', wx = req.query.wx || req.body.wx || '',
   qq = req.query.qq || req.body.qq || '', phone = req.query.phone || req.body.phone || '', address = req.query.address || req.body.address || '',
   coord = req.query.coord || req.body.coord || '', hobby = req.query.hobby || req.body.hobby || '', profession = req.query.profession || req.body.profession || '',
   remarks = req.query.remarks || req.body.remarks || '', visitsource = req.query.visitsource || req.body.visitsource || '', performancesource = req.query.performancesource || req.body.performancesource || '',
   target = req.query.target || req.body.target || '', classid = req.query.classid || req.body.classid || '', memberid = req.query.memberid || req.body.memberid || '',
   coachid = req.query.coachid || req.body.coachid || '', saleid = req.query.saleid || req.body.saleid || '', pid = req.query.pid || req.body.pid || '';

  req.getConnection(function(err, conn) {
    if (err) {
      console.log("error db link", err);
      res.send({ code: 10, desc: err });
      return;
    } 

    let arr = [name,gender,birth,height,weight,wx,qq,phone,address,coord,hobby,profession,remarks,visitsource,performancesource,target,classid,memberid,coachid,saleid,pid];

    let sql = "INSERT INTO customer (name,gender,birth,height,weight,wx,qq,phone,address,coord,hobby,profession,remarks,visitsource,performancesource,target,classid,memberid,coachid,saleid,pid ) VALUES (?) ";

    conn.query(sql, [arr], function(err, rows) {
      if (err) {
        console.log("query error", err);
        res.send({ code: 11, desc: err });
        return;
      }
      res.send({ code: 0, desc: rows.insertId });
    });
  });
};

module.exports = {
  uploadiconfile: uploadIconFile,
  typelist: typeList,
  addcustomer: addCustomer
};
