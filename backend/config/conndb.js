import mongoose from 'mongoose'

const connectionDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            dbname:"chat_app_learning"
        })
        console.log("MongoDB connected sucessfully......!!")

    }catch(err){
        console.log("MongoDb connection failed :",err)
        process.exit(1)
    }
}
export default connectionDB