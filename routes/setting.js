let express = require("express"),
    settingRoute = require("../controller/setting"),
    router = express.Router();

router.post("/add", settingRoute.add);
router.post("/set", settingRoute.set);
router.post("/remove", settingRoute.remove);
router.post("/list", settingRoute.list);
router.post("/settasktime", settingRoute.setTaskTime);

module.exports = router;