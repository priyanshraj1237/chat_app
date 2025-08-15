import express from 'express'
const router=express.Router()
import * as controllers from '../controllers/message.controllers.js'
import isauthenticated from '../middleware/isAuthenticated.middleware.js'

//api route for sending message....
router.post('/p1/:id',isauthenticated,controllers.send_message)

//api route for reciving message....
router.get('/p1/:id',isauthenticated,controllers.recive_message)


export default router
