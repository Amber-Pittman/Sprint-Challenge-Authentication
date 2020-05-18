const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Users = require("./auth-model")
const authenticate = require("./authenticate-middleware")
const secret = require("../config/secret")
//const db = require("../database/dbConfig")

const router = require("express").Router()

router.post("/register", async (req, res, next) => {
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

router.post("/login", async (req, res, next) => {
	// const authError = {
	// 	message: "Invalid Credentials",
	// }

	// try {
	// 	const { username, password } = req.body
	// 	const user = await Users.findBy( username ).first()

	// 	const passwordValid = await bcrypt.compare(password)

	// 	if (!user || !passwordValid) {
	// 		return res.status(401).json(authError)
	// 	}

	// 	const tokenPayload = {
	// 		userId: user.id,
	// 		username: user.username
	// 	}

	// 	res.cookie("token", jwt.sign(tokenPayload, process.env.JWT_SECRET))

	// 	res.status(200).json({
	// 		message: `Welcome ${user.username}!`,
	// 	})
	// } catch(err) {
	// 	next(err)
	// }
	try {
		const { username, password } = req.body;
		const user = await usersModel.findBy({ username }).first();
		const pwValid = await bcrypt.compare(password, user.password);
		// console.log(res);

		if (user && pwValid) {
			const token = jwt.sign(
				{
					subject: user.id,
					username: user.username,
				},
				secrets.jwt,
				{
					expiresIn: '14d',
				}
			);

			res.status(200).json({
				message: 'Welcome, you are authorized!',
				token: token,
				userId: req.userId,
			});
		} else {
			res.status(401).json({
				message: 'Please sign-in!',
			});
		}
	} catch (err) {
		next(err);
	}
})

module.exports = router