const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(email){
      if(!validator.isEmail(email)){
        throw new Error('Invalid Email')
      }
    }
  },
  password: {
    type: String
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
},{
  timestamps: true,
  toJSON: { virtuals: true }
})

userSchema.statics.findByCredentials = async(email, password) => {
  // console.log('start')
  const user = await User.findOne({email: email})
  // console.log(user)
  // console.log('hello')
  if(!user){
    throw new Error('Unable to find you in Database')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    throw new Error("Password didn't match")
  }
  return user;
}

userSchema.methods.toJSON = function (){
  const user = this;
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject
}

userSchema.methods.generateAuthToken = async function(){
  const user = this;
  const token = jwt.sign({_id: user._id.toString()}, 'KTJ_WEBSITE_2023')

  user.tokens = user.tokens.concat({token})
  await user.save();
  return token;
}


userSchema.pre('save', async function(next){
  const user = this;

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8);
  }
  next()
})




const User = mongoose.model('User', userSchema)

module.exports = User;