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

    if(type != '') sql += "WHERE type = 1";

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

module.exports = {
  uploadiconfile: uploadIconFile,
  typelist: typeList
};
