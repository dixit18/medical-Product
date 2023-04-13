const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');

const validated = async (req,res,next)=>{
  // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }
      if (!token) {
        return next(
          new Error('You are not logged in! Please log in to get access.', 401)
        );
      }
 // 2) Verification token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next(
          new Error(
            'The user belonging to this token does no longer exist.',
            401
          )
        );
      }
       // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();

}


module.exports = validated