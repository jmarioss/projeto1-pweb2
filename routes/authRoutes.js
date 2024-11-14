const express = require("express")
const router = express.Router
const auth_controllers = require("../controllers/authControllers") 

router.post("/login", auth_controllers.login)