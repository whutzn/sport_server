let express = require("express"),
    classRoute = require("../controller/class"),
    router = express.Router();

router.post("/uploadfile", classRoute.uploadclassfile);
router.post("/add", classRoute.addclass);
router.post("/set", classRoute.setclass);
router.post("/remove", classRoute.removeclass);
router.post("/list", classRoute.list);

module.exports = router;