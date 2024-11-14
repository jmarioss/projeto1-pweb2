const asyncHandler = require("express-async-handler")

exports.login = asyncHandler(async ( req, res ) => {
    const { email, senha } = req.body
})

exports.cadasto = asyncHandler(async ( req, res ) => {
    const { email, senha, token } = req.body
})