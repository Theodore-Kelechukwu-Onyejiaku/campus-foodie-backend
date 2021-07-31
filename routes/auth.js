const router = require("express").Router();
const authController = require("../controllers/authController");
const jwtAuth = require("../auth/jwtVerification");

// SIGN UP
router.post("/local", authController.localSignup)
router.post("/google", authController.googleSignUp);

// LOG IN
router.post("/local-login", authController.localLogin);
router.post("/google-login", authController.googleLogin);

// VERIFY IF USER IS LOGGED IN
router.post("/verify", jwtAuth.verifyUser, authController.verifyLogin);

// ACTIVATE ACCOUNT OF USER
router.get("/activate/:userSignature/:userId", authController.activateAccount);

// RESET PASSWORD
router.get("/password-reset/:email", authController.getPasswordResetCode);
router.get("/password-reset/:resetCode/:userId", authController.getPasswordUser);
router.post("/password-reset", authController.changePassword);

module.exports = router;