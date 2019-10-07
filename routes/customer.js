let express = require("express"),
    customerRoute = require("../controller/customer"),
    router = express.Router();

router.post("/uploadicon", customerRoute.uploadiconfile);
router.post("/typelist", customerRoute.typelist);
router.post("/add", customerRoute.addcustomer);
router.post("/list", customerRoute.listcustomer);
router.post("/remove", customerRoute.removecustomer);
router.post("/addclass", customerRoute.addclass);
router.post("/removeclass", customerRoute.removeclass);

module.exports = router;