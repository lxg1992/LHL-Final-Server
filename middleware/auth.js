const config = require('config');
const jwt = require('jsonwebtoken');

const auth = function (req, res, next) {
  const token = req.header('x-auth-token');

  //Check for token
  if(!token){
    res.status(401).json({error: 'No token, authorization failed'})
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    //Add user from payload
    req.user = decoded
    next();
  } catch (error) {
    res.status(400).json({error: 'Token is not valid'})
  }
}

module.exports = {auth}

