const serverLogger = function (req, res, next) {

  console.log('METHOD:',req.method,';ROUTE:', req.originalUrl, ';TIME:',new Date().toLocaleTimeString())
  if(Object.keys(req.body).length !== 0){
    console.log('BODY:', req.body)
  }
  next();
}

module.exports = {serverLogger}

