const router = require("express").Router();
const authController = require("../controllers/authController");
const jwtAuth = require("../auth/jwtVerification");


router.post("/local", authController.localSignup)
router.post("/google", authController.googleSignUp);

router.post("/verify", jwtAuth.verifyUser, authController.verifyLogin);

module.exports = router;