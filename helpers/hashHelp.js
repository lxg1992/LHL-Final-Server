const bcrypt = require('bcryptjs')

async function hashPassword (plain) {

  const password = plain

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err) 
      bcrypt.hash(password, salt, function(err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
  })

  return hashedPassword
}

async function checkPassword (bodyPassword,  databasePassword) {

  const value =  await new Promise((resolve, reject) => {
      if(bcrypt.compareSync(bodyPassword, databasePassword)){
        resolve(true)
      } else {
        resolve(false)
      }
  })

  console.log('Password match?: ',value);

  return value
}

module.exports = {hashPassword, checkPassword}

