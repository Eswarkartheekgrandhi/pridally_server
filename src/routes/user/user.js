var express = require("express");
var router = express.Router();
var userController = require("../../controller/user/user");

router.post("/register", userController.registerUser);
router.post("/version", userController.versionCheck);
router.post("/onboarding_preferences", userController.updateOnboardingPreferences);

module.exports = router;