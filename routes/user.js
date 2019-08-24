let express = require("express"),
userRoute = require("../controller/user"),
router = express.Router();

router.post('/login',userRoute.login);

module.exports = router;