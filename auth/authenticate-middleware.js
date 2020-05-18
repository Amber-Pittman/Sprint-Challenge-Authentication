/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require("jsonwebtoken")

function restrict(role = "normal") {
  return async (req, res, next) => {
    const authError = {
      message: "You shall not pass!",
    }

    try {
      console.log(req.headers)

      const token = req.cookies.token
      if (!token) {
        return res.status(401).json(authError)
      }

      jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decodedPayload) => {
          if (err || decodedPayload.userRole !== role) {
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

module.exports = restrict