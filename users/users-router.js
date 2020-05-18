const express = require("express")
const Users = require("./users-model")
const authenticate = require("../auth/authenticate-middleware")

const router = express.Router()

// This endpoint is only available to logged-in admin users due to the `restrict` middleware
router.get("/", authenticate("admin"), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})

module.exports = router