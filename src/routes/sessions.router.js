import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import UserManager from '../services/managers/UserManager.js';
import { createHash, validatePassword} from '../utils.js';
import Routers from './router.js';
import SessionController from '../controllers/sessions.controller.js';

const sessionController = new SessionController();

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect:'/failregister'}), sessionController.register)
router.get('/failregister', sessionController.failRegister)
router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin'}), sessionController.login)
router.get('/current', sessionController.current)
router.get('/faillogin', sessionController.failLogin)
router.get('/logout', sessionController.logout)
router.post('/forgotPassword', sessionController.forgotPassword)
router.post('/restartPassword', sessionController.restartPassword)
router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res)=>{})
router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), sessionController.githubCallback)
        
export default router
