import jwt from "jsonwebtoken";

const isAuthenticated = async (req , res , next)=>{
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if(!token){
            return res.json({success:false , message : "Not Authorized"});
        }
        let decode;
        try{
            decode = await jwt.verify(token , process.env.JWT_SECRET_STRING);
        }catch(error){
            return res.json({success:false , message:"Please sign in Again"});
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log("Error in is authenticated middleware");
        return res.status(500).json({success:false , message:"Internal Server Error"});
    }
}

export default isAuthenticated;