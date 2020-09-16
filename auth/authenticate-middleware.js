const jwt = require("jsonwebtoken")
const secret = require("../config/secret.js")

function authenticate() {
	return async (req, res, next) => {
		
		try {
			const authError = {
				message: "Invalid credentials",
			}
	
			console.log(req.headers)
			const token = req.headers.authorization
			//const token = req.cookies.token
 			if (!token) {
				return res.status(401).json(authError)
			}

			jwt.verify(token, secret, (err, decodedPayload) => {
				if (err) {
					return res.status(401).json(authError)
				}

				req.token = decodedPayload

				next()
			})
		} catch(err) {
			next(err)
		}
	}
}

module.exports = authenticate