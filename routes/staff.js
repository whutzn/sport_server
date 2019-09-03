let express = require("express"),
  staffRoute = require("../controller/staff"),
  router = express.Router();

router.get("/type", staffRoute.type);
router.post("/login", staffRoute.login);
router.post("/add", staffRoute.add);
router.post("/set", staffRoute.set);
router.post("/remove", staffRoute.remove);
router.post("/list", staffRoute.list);

module.exports = router;
