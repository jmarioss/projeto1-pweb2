const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

exports.login = asyncHandler(async ( req, res ) => {
    const { email, senha } = req.body
})

exports.cadasto = asyncHandler(async ( req, res ) => {
    const { email, senha, token } = req.body
})