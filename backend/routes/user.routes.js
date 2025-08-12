import express from "express"
const router=express.Router()
import * as controllers from '../controllers/user.controllers.js'
import isauthenticated from '../middleware/isAuthenticated.middleware.js'

router.get('/trial',(req,res)=>{
    res.send("this one is user routes testing...")
})
//user registeration...routes....
router.post('/register',controllers.register)

//user login route.....
router.post('/login',controllers.login)

//user routes for logout....
router.get('/logout',isauthenticated,controllers.logout)

//dummy func testing for authentication purpose....
router.get('/demo',isauthenticated,controllers.demo)

export default router