const User = require('../models/userModel')
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email')

const signToken = id =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
}
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Remove password from output
    // user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };
const signUp = async(req,res)=>{
    try{

        const newUser = await User.create(req.body)
        
        // await sendEmail(newUser.email,newUser.name,newUser.password);

        createSendToken(newUser, 201, res)

    }catch(err){
        res.status(500).json({
            status:'fail',
            message:err
        })
    }
}


const login = async(req,res,next)=>{
    const {email , password} = req.body;
//check if email and password exist
    if(!email || !password){
        return next(new Error('Please provide email and password!', 400));
    }
    //check if user exirs & password is correct
    try{

        const user = await User.findOne({email}).select('+password')
        console.log(user)
       if (!user || !(await user.correctPassword(password, user.password))) {
         return next(new Error('Incorrect email or password', 401));
 }

 createSendToken(user, 200, res);
    }catch(err){
        res.status(500).json({
            status:"fail",
            message:err
        })
    }

}


module.exports = {
    signUp,
    login
}