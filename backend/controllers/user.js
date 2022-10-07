

// const { validateEmail, validateLength, validateUserName } = require("../helpers/validation");
// const { validate } = require("../models/User");
// const User = require("../models/User")
// const bcrypt = require("bcrypt");
// const { generateToken } = require("../helpers/tokens");

// exports.register=async(req,res)=>{
   
//     try {
//         const{
//             first_name,
//             last_name,
//             username,
//             email,
//             password,
//             bYear,
//             bDay,
//             bMonth,
//             gender
      
//         }=req.body
   

//      if(!validateEmail(email)){
//          return res.status(400).json({
//              message:"invalid email address"
//          }) 
//      }  
       

//      const check = await  User.findOne({email})
//      if(check){
//         return res.status(400).json({
//             message:"This email address already exit try with a different email address "
//         }) ; 

//      }
      

//      if(!validateLength(first_name,3,30 )){
//         return res.status(400).json({
//             message:"First name must be between 3 and 30 charecters "
//         }) ; 

          
//      }

//      if(!validateLength(last_name,3,30 )){
//         return res.status(400).json({
//             message:"Last Name must be between 3 and 30 charecters "
//         }) ; 

          
//      }

//      if(!validateLength(password,6,30 )){
//         return res.status(400).json({
//             message:"password must be  6 characters"
//         }) ; 
  
//      } 

//      console.log("sinan")


//      const cryptedPassword=await bcrypt.hash(password,12)
 
//       let tempUserName  = first_name + last_name;
//       let newUsername  =await validateUserName(tempUserName);


 



//      console.log(validateEmail(email));
      

       
//         const user =await new User({
      
//           first_name,
//           last_name,
//           username: newUsername,
//           email,
//           password:cryptedPassword,
//           bYear,
//           bDay,
//           bMonth,
//           gender
      
//         }).save();
//      const emailVerificationToken = generateToken(
//          {id:user._id.toString()}
//          ,"30m"
//        );
//       const url =`${process.env.BASE_URL}/activate/${emailVerificationToken}`;
//       sendVerificationEmail(user.email,user.first_name,url)




//         console.log(emailVerificationToken);
        
//     } catch (error) {
//         res.status(500).json({message:error.message});  
        
//     }  
   


// } 

const {
    validateEmail,
    validateLength,
    validateUsername,
  } = require("../helpers/validation");
  const User = require("../models/User");
  const bcrypt = require("bcrypt");
  const { generateToken } = require("../helpers/tokens");
  const { sendVerificationEmail } = require("../helpers/mailer");
const jwt = require("jsonwebtoken");
  exports.register = async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        username,
        bYear,
        bMonth,
        bDay,
        gender,
      } = req.body;
  
      if (!validateEmail(email)) {
        return res.status(400).json({
          message: "invalid email address",
        });
      }
      const check = await User.findOne({ email });
      if (check) {
        return res.status(400).json({
          message:
            "This email address already exists,try with a different email address",
        });
      }
  
      if (!validateLength(first_name, 3, 30)) {
        return res.status(400).json({
          message: "first name must between 3 and 30 characters.",
        });
      }
      if (!validateLength(last_name, 3, 30)) {
        return res.status(400).json({
          message: "last name must between 3 and 30 characters.",
        });
      }
      if (!validateLength(password, 6, 40)) {
        return res.status(400).json({
          message: "password must be atleast 6 characters.",
        });
      }
  
      const cryptedPassword = await bcrypt.hash(password, 12);
  
      let tempUsername = first_name + last_name;
      let newUsername = await validateUsername(tempUsername);
      const user = await new User({
        first_name,
        last_name,
        email,
        password: cryptedPassword,
        username: newUsername,
        bYear,
        bMonth,
        bDay,
        gender,
      }).save();
      const emailVerificationToken = generateToken(
        { id: user._id.toString() },
        "30m"
      );
      const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
      sendVerificationEmail(user.email, user.first_name, url);
      const token = generateToken({ id: user._id.toString() }, "7d");
      res.send({
        id: user._id,
        username: user.username,
        picture: user.picture,
        first_name: user.first_name,
        last_name: user.last_name,
        token: token,
        verified: user.verified,
        message: "Register Success ! please activate your email to start",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

 exports.activateAccount=async(req,res)=>{
      const {token}=req.body;
      const user =  jwt.verify(token,process.env.TOKEN_SECRET );
      console.log(user);
      const check = await User.findById(user.id);
    if(check.verify ==true){
        return res.status(400).json({message:"this email is already activated"})
    }

 };


      