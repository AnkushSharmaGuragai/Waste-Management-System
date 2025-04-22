const express = require("express");
const {validateAdminLogin,handleModifyUser}= require ("../Controller/admin.js")
const {isAuthenticated,} = require("../Middleware/auth.js")

const router = express.Router();

router.get("/validateAdmin",isAuthenticated,validateAdminLogin)
router.post("/modifyUser",isAuthenticated,handleModifyUser)

module.exports = router;