// Login Functionality
const User = require('../models/User');  // Your user model should expose a way to query users (e.g., via Mongoose)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// #1 Input Extraction & Validation
//  The controller function for login should extract the credentials (e.g.,
//  email/username and password) from the incoming request. It should
//  validate that these values are present and correctly formatted.

// #2 User Lookup
// It should interact with your User model to search for a user record that
// matches the provided identifier (typically the email or username).

// #3 Password Verficiation
// Once the user is found, the function should compare the provided
// password with the stored hashed password using a secure method.

// #4 Token Generation
// On a successful match, the function generates a JWT token (or
// another form of session token) that includes key information such as
// the user’s ID or roles.

// #5 Send back a response to the client
// Finally, it sends back a response to the client that contains the token
// and possibly some minimal user information, or an error if something
// went wrong.

const login = async (req,res) => {

    try{
        const {email, password}= req.body ;

        if (!email || !password){
            return res.status(400).json({error: 'Email and password not entered'}) ;
        }
    
        const user=User.findOne({email})
        if(!user){
            return res.status(401).json({error: 'User does not exist'}) ;
        }
    
        const comparePassword=await bcrypt.compare(password, user.password) ;
        if(!comparePassword){
            return res.status(401).json({error:"User's password does not match"}) ;
        }
    
        const payload = {id: user._id, email: user.email} ;
        const token =jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }) ;
    
        return res.status(200).json({
            token,
            user: {
              id: user._id,
              email: user.email,
            },
          });
    }
    
     catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Server error.' });
    
}
}

module.exports={login};