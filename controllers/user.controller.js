import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ************************* Function to create a token using JWT ********************************
const createToken = (userId)=>{
    return jwt.sign({userId} , process.env.JWT_SECRET_STRING , {expiresIn:'1d'});
}


// ************************* Controller to register a user *********************************
const register = async (req , res)=>{
    try{
        const {fullname , email , phoneNumber , password , role} = req.body;
        // If any field is not filled then throw error
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.json({ success:false , message:"Please fill all the required fields"});
        }

        // To check whether the email already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.json({success:false , message:"User already exists"});
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password , 10);

        // Create the User
        const newUser =  new User({
            fullname , 
            email , 
            phoneNumber , 
            password : hashedPassword , 
            role
        });
        await newUser.save();
        return res.status(200).json({success:true , message:"User registered Successfully"});
    }catch(error){
        console.log("Error in register controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}


// ************************* Controller to Login a User *************************************
const login = async (req , res)=>{
    try{
        const {email , password , role} = req.body;
        // If any field is not filled then throw error
        if(!email || !password || !role){
            return res.json({ success:false , message:"Please fill all the required fields"});
        }
        // Check whether the user with this email exists or not
        let user = await User.findOne({email}); 
        if(!user){
            return res.json({success:false , message:"User doesn't exists"});
        }
        // Email is correct now password is correct or not
        const isPasswordMatch = await bcrypt.compare(password , user.password);
        if(!isPasswordMatch){
            return res.json({success:false , message:"Incorrect Password"});
        }
        // check role is correct or not
        if(role != user.role){
            return res.json({success:false , message:"Account doesn't exist with current role"})
        }
        // When everthing is correct , generate token for the user
        const token = createToken(user._id);

        user = {
            _id : user._id,
            fullname : user.fullname,
            email : user.email,
            phoneNumber : user.phoneNumber,
            role : user.role,
            profile : user.profile 
         }

        return res.status(200).json({success:true , message:"User logged in successfully" , token , userId : user._id , user});

    }catch(error){
        console.log("Error in Login controller");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}


// ************************* Controller to Update Profile *************************************
const updateProfile = async (req , res)=>{
    try{
        const {fullname , email , phoneNumber , bio , skills } = req.body;
        // Convert skills string into array
        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        const userId = req.id; // comes through middleware
        // Find the user to update the profile
        let user = await User.findById(userId);
        if(!user){
            return res.json({success:false , message:"User not found"});
        }
        // update user
        if(fullname) user.fullname = fullname;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills = skillsArray;

        await user.save();

        user = {
           _id : user._id,
           fullname : user.fullname,
           email : user.email,
           phoneNumber : user.phoneNumber,
           role : user.role,
           profile : user.profile 
        }

        return res.status(200).json({success:true , message:"Profile updated successfully" , user});       
    }
    catch(error){
        console.log("Error in Update profile controller");
        return res.status(500).json({success:false , message:"Internal Server Error"}); 
    }
}

export {register , login , updateProfile};