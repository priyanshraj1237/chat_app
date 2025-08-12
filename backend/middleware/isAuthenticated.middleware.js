import jwt from "jsonwebtoken"
import {User} from '../modules/user.module.js'
const isauthenticated=async(req ,res , next)=>{
    try{
        const token=req.cookies.token|| req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            return res.status(401).json({ sucess:false,message :"user is not authenticated... please login..."})
        }
        // console.log(token)
        const decode=jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decode){
            return res.status(401).json({sucess:false,message:"invalid token..."})
        }

        const user=await User.findById(decode.userid).select("-password ")
        req.user=user
        console.log(user)    //just for testing the user   authentication.....
        next()
    }catch(err){
        console.log(err)
        return res.status(400).json({sucess:false,message:"invalid token"})
    }
}

export default isauthenticated