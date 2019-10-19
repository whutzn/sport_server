let createError = require("http-errors");

module.exports = app => {
  // catch 404 and forward to error handler

  app.get("/", function(req, res, next) {
    res.render("../views/index");
  });

  app.use("/admin",require("./user"));
  app.use("/admin/store",require("./store"));
  app.use("/admin/staff",require("./staff"));
  app.use("/admin/customer",require("./customer"));
  app.use("/admin/setting",require("./setting"));
  app.use("/admin/class", require("./class"));

  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send({ code: 1, desc: "not found" });
  });

};
