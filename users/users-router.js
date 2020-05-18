const express = require("express")
const Users = require("./users-model")
const authenticate = require("../auth/authenticate-middleware")

const router = express.Router()

router.get("/", authenticate(), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})

module.exports = router