const express = require("express");
const AuthController = require("../controllers/auth");
const router = express.Router();

//  /api/auth
router.post("/register", AuthController.registerUser);
//  /api/auth
router.post("/login", AuthController.loginUser);
//  /api/auth
router.post("/logout", AuthController.logoutUser);

module.exports = router;
