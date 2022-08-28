const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req, res, next) => {
  console.log('auth')
  try{
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log(token)
    const decode = jwt.verify(token, 'KTJ_WEBSITE_2023');
    console.log(decode)
    const user = await User.findById({_id: decode._id})
    console.log(user)

    if(!user){
      throw new Error()
    }

    req.token = token
    req.user = user
    next()

  }catch(e){
    res.status(401).send({ error: 'Please Authenticate' })
  }
}

module.exports = auth;