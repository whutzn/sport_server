let express = require("express"),
    axios = require("axios"),
    schedule = require("node-schedule"),
    customerRoute = require("../controller/customer"),
    customerIndex = require("../controller/customerIndex"),
    customerWork = require("../controller/customerWork"),
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
router.post("/buycard", customerIndex.buyCard);

router.post("/addweight", customerIndex.addWeight);
router.post("/getweight", customerIndex.getWeight);
router.post("/addindex", customerIndex.addIndex);
router.post("/getindex", customerIndex.getIndex);
router.post("/uploadimage", customerRoute.addcustomerfile);
router.post("/getimage", customerIndex.getImage);
router.post("/addresult", customerIndex.addResult);
router.post("/getresult", customerIndex.getResult);

router.post("/getclassbycustomerid", customerIndex.getClassByCustomerid);
router.post("/setclassbycustomerid", customerIndex.setClassByCustomerid);
router.post("/updatecoord", customerRoute.updatecoord);

router.post("/standard/add", customerWork.add);
router.post("/standard/remove", customerWork.remove);
router.post("/standard/verify", customerWork.verify);
router.post("/standard/list", customerWork.getList);
router.post("/standard/batchverify", customerWork.batchVerify);

router.post("/dotask", customerWork.updateStatusAndTask);
router.post("/tasklist", customerWork.taskList);
router.post("/settask", customerWork.setTask);
router.post("/removetask", customerWork.removeTask);

router.post("/statistics", customerWork.getStatistics);
router.post("/batchtask", customerWork.batchTask);

router.post("/uploadbmi", customerIndex.uploadBmi);

schedule.scheduleJob("30 0 0 * * *", () => {
    console.log("taskTime:" + new Date());
    axios
        .post("http://localhost:3000/admin/customer/dotask")
        .then(respose => {
            console.log('do task', respose.data);
        })
        .catch(err => {
            console.log('task err', err);
        });
});
module.exports = router;