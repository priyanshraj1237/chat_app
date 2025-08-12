console.log("server.js")
import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectionDB from "./config/conndb.js";
import routes from "./routes/index.routes.js"
const app=express()

//.env file connection....
dotenv.config({})

//database connection calling....
connectionDB()

app.use(express.json())
app.use(express.urlencoded({extended:true})) //
app.use(cookieParser())

//api default rendpoint...
app.use('/',routes)

const port=process.env.PORT||4000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})