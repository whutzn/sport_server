let express = require("express"),
  customerRoute = require("../controller/customer"),
  router = express.Router();

router.post("/uploadicon", customerRoute.uploadiconfile);
router.post("/typelist", customerRoute.typelist);

module.exports = router;