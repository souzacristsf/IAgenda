const jwt = require('../lib/jwt')

let valitateJwt = async (req, res, next) => {
  try {
    const user = await jwt.validateToken(req.headers)
    // console.log('User: ', user)
    req.user = user
    next()
  } catch (exception) {
    // console.log('entrou no exception: ', exception.message)
    next(exception)
    // return res.status(401).json({error: true, message: exception})
  }
}

module.exports = { valitateJwt }
