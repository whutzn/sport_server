let express = require("express"),
    customerRoute = require("../controller/customer"),
    router = express.Router();

router.post("/uploadicon", customerRoute.uploadiconfile);
router.post("/typelist", customerRoute.typelist);
router.post("/add", customerRoute.addcustomer);
router.post("/set", customerRoute.setcustomer);
router.post("/list", customerRoute.listcustomer);
router.post("/remove", customerRoute.removecustomer);

router.post("/addclass", customerRoute.addclass);
router.post("/removeclass", customerRoute.removeclass);
router.post("/setclass", customerRoute.setclass);
router.post("/listclass", customerRoute.listclass);

module.exports = router;