import express from "express"
const router=express.Router()


//demo routers...........................
router.get('/',(req,res)=>{
    res.send("this one is trial router....")
})


import user_routes from'./user.routes.js'
router.use('/api/user',user_routes)

export default router