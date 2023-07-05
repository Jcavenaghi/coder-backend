import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import UserManager from '../services/managers/UserManager.js';
import { createHash, validatePassword} from '../utils.js';
import Routers from './router.js';
import SessionController from '../controllers/sessions.controller.js';

const sessionControler = new SessionController();

const router = Router();

// const userManger = new UserManager();

router.post('/register', passport.authenticate('register', { failureRedirect:'/failregister'}), sessionControler.register)
router.get('/failregister', sessionControler.failRegister)
router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin'}), sessionControler.login)
router.get('/current', sessionControler.current)
router.get('/faillogin', sessionControler.failLogin)
router.get('/logout', sessionControler.logout)
router.post('/restartPassword', sessionControler.restartPassword)
router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res)=>{})
router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), sessionControler.githubCallback)
        
export default router
