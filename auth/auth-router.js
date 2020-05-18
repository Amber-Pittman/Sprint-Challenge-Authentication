const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authenticate = require("./authenticate-middleware")
const Users = require("../users/users-model")

router.post('/register', async (req, res, next) => {
  // implement registration
  try {
		const { username } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		res.status(201).json(await Users.add(req.body))
	} catch(err) {
		next(err)
	}
})


router.post('/login', async (req, res, next) => {
  // implement login
  const authError = {
		message: "Invalid Credentials",
	}

	try {
		const user = await Users.findBy({ username: req.body.username }).first()
		if (!user) {
      return res.status(401).json(authError)
    }

		const passwordValid = await bcrypt.compare(req.body.password, user.password)
		if (!passwordValid) {
			return res.status(401).json(authError)
		}

		const tokenPayload = {
			userId: user.id,
			userRole: "admin", // this would normally come from the database
		}

		res.cookie("token", jwt.sign(tokenPayload, process.env.JWT_SECRET))

		res.json({
			message: `Welcome ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})


router.get("/logout", authenticate(), (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			next(err)
		} else {
			res.json({
				message: "Logged out",
			})
		}
	})
})

module.exports = router;
