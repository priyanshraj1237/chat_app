import express from "express"
const router=express.Router()


//demo routers...........................
router.get('/',(req,res)=>{
    res.send("this one is trial router....")
})

//user routes...
import user_routes from'./user.routes.js'
router.use('/api/user',user_routes)

//message routes....
import message_routes from './conversation.routes.js'
router.use('/api/message',message_routes)

export default router