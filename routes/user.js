let express = require("express"),
    userRoute = require("../controller/user"),
    router = express.Router();

router.post('/login', userRoute.login);
router.post('/login/setpwd', userRoute.fixPwd);

module.exports = router;