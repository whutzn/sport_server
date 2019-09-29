let multer = require("multer"),
  fs = require("fs"),
  axios = require("axios"),
  storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./public/store");
    },
    filename: function(req, file, cb) {
      let str = file.originalname.split(".");
      cb(null, Date.now() + "." + str[1]);
    }
  }),
  upload = multer({ storage: storage });

function uploadStoreFile(req, res, next) {
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
        "INSERT INTO storefiles(filename, encoding, mimetype, size, filepath, addTime) VALUES ( ? )";

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

function addStore(req, res, next) {
  let account = req.query.account || req.body.account,
    pwd = req.query.pwd || req.body.pwd,
    name = req.query.name || req.body.name,
    pid = req.query.pid || req.body.pid;
  req.getConnection(function(err, conn) {
    if (err) return next(err);
    let sql = "INSERT INTO storeinfos(account,pwd,name,pid) VALUES (?,?,?,?);";

    conn.query(sql, [account, pwd, name, pid], function(err, rows) {
      if (err) {
        console.error("query error", err);
        res.send({
          code: 1,
          desc: "add store fail"
        });
      } else {
        axios.post("http://localhost:3000/admin/setting/add",{
          storeid: rows.insertId,
          general: 0,
          vip: 0,
          deadline: 0
        }).then((respose) => {
          res.send({
            code: 0,
            desc: rows.insertId
          });
        }).catch((err) => {
          res.send({
            code: 1,
            desc: "add store setting fail: "+ err
          });
        });
      }
    });
  });
}

function setStore(req, res, next) {
  let account = req.query.account || req.body.account,
    pwd = req.query.pwd || req.body.pwd,
    name = req.query.name || req.body.name,
    pid = req.query.pid || req.body.pid,
    id = req.query.id || req.body.id;
  req.getConnection(function(err, conn) {
    if (err) return next(err);
    let sql =
      "UPDATE storeinfos SET account = ?,pwd = ?,name = ?,pid = ? WHERE id = ?;";

    conn.query(sql, [account, pwd, name, pid, id], function(err, rows) {
      if (err) {
        res.send({
          code: 1,
          desc: "set store fail"
        });
        return next("query error" + err);
      } else {
        res.send({
          code: 0,
          desc: "set store success"
        });
      }
    });
  });
}

function removeStore(req, res, next) {
  let id = req.query.id || req.body.id;
  req.getConnection(function(err, conn) {
    if (err) return next(err);
    let querySql =
      "SELECT storefiles.filename FROM	storeinfos	LEFT JOIN storefiles ON storeinfos.pid = storefiles.id WHERE storeinfos.id = ? ";
    conn.query(querySql, [id], function(err, rows1) {
      if (err) return next("query error" + err);
      fs.unlink("./public/store/" + rows1[0].filename, err => {
        if (!err) {
          let sql =
            "DELETE storeinfos.*,storefiles.* FROM	storeinfos	LEFT JOIN storefiles ON storeinfos.pid = storefiles.id WHERE storeinfos.id = ? ";

          conn.query(sql, [id], function(err, rows) {
            if (err) {
              res.send({
                code: 1,
                desc: "query error"
              });
              return next("query error" + err);
            } else {
              axios.post("http://localhost:3000/admin/setting/add",{
                storeid: id
              }).then((respose) => {
                res.send({
                  code: 0,
                  desc: "remove success"
                });
              }).catch((err) => {
                res.send({
                  code: 1,
                  desc: "remove store error "+ err
                });
              });
            }
          });
        } else return next("delete error" + err);
      });
    });
  });
}

function getStoreList(req, res, next) {
  req.getConnection(function(err, conn) {
    if (err) return next(err);
    let sql =
      "SELECT storeinfos.*,storefiles.filename FROM storeinfos	LEFT JOIN storefiles ON storeinfos.pid = storefiles.id";

    conn.query(sql, [], function(err, rows) {
      if (err) {
        res.send({
          code: 1,
          desc: "add add fail"
        });
        return next("query error" + err);
      } else {
        rows.forEach(element => {
          element.filename =
            "http://121.41.28.144:3000/store/" + element.filename;
        });
        res.send({
          code: 0,
          desc: rows
        });
      }
    });
  });
}

function login(req, res, next){
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

      let sql = "SELECT pwd FROM storeinfos WHERE account = ? ";

      conn.query(sql, [phone], function(err, rows) {
          if (err) return next("login error" + err);

          if (rows.length == 0) {
              res.send(
                  JSON.stringify({
                      code: 2,
                      desc: "no user"
                  })
              );
          } else if (rows[0].pwd != password) {
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
                      desc: "login success"
                  })
              );
          }
      });
  });
}

module.exports = {
  uploadstorefile: uploadStoreFile,
  addstore: addStore,
  setstore: setStore,
  removestore: removeStore,
  getstorelist: getStoreList,
  login: login
};
