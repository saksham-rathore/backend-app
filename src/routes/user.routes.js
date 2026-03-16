const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", userController.profile);
router.put("/profile", userController.updateProfile);
router.delete("/profile", userController.deleteProfile);

module.exports = router;