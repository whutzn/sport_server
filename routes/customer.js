let express = require("express"),
    customerRoute = require("../controller/customer"),
    customerIndex = require("../controller/customerIndex"),
    router = express.Router();

router.post("/uploadicon", customerRoute.uploadiconfile);
router.post("/typelist", customerRoute.typelist);
router.post("/add", customerRoute.addcustomer);
router.post("/set", customerRoute.setcustomer);
router.post("/list", customerRoute.listcustomer);
router.post("/remove", customerRoute.removecustomer);
router.post("/setstatus", customerRoute.setstatus);

router.post("/addclass", customerRoute.addclass);
router.post("/removeclass", customerRoute.removeclass);
router.post("/setclass", customerRoute.setclass);
router.post("/listclass", customerRoute.listclass);
router.post("/signclass", customerIndex.signClass);
router.post("/stopclass", customerIndex.stopClass);

router.post("/addweight", customerIndex.addWeight);
router.post("/getweight", customerIndex.getWeight);
router.post("/addindex", customerIndex.addIndex);
router.post("/getindex", customerIndex.getIndex);
router.post("/uploadimage", customerRoute.addcustomerfile);
router.post("/getimage", customerIndex.getImage);
router.post("/addresult", customerIndex.addResult);
router.post("/getresult", customerIndex.getResult);

router.post("/getclassbycustomerid", customerIndex.getClassByCustomerid);

module.exports = router;