let express = require("express"),
    storeRoute = require("../controller/store"),
    router = express.Router();

router.post("/uploadfile", storeRoute.uploadstorefile);
router.post("/add", storeRoute.addstore);
router.post("/set", storeRoute.setstore);
router.post("/remove", storeRoute.removestore);
router.get("/list", storeRoute.getstorelist);

module.exports = router;