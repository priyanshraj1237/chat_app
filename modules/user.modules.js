import mongoose from 'mongoose'

const userschema= new mongoose.Schema({

    fullname:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    profilephoto:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        enum:["male","female"],
        require:true
    }

},{
    timestamp:true,
})

export const User=mongoose.model("User",userschema)