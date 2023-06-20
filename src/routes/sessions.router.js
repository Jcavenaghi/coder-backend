import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import UserManager from '../dao/managers/UserManager.js';
import { createHash, validatePassword } from '../utils.js';
import Routers from './router.js';

// const router = Router();

const userManger = new UserManager();


export default class SessionRouter extends Routers{
    init(){
        this.post('/register', ["PUBLIC"], passport.authenticate('register', { failureRedirect:'/failregister'}), async(req,res) =>{
            res.send({status:"succes", message:"User registered"});

        })
        this.get('/failregister', ["PUBLIC"], async (req,res)=>{
            console.log('Fallo en el registro');
            res.send({error: 'Error en el registro'})
        })
        this.post('/login', ["PUBLIC"], passport.authenticate('login',{failureRedirect:'/faillogin'}), async (req,res)=>{
    
            if(!req.user) return res.status(400).send({status:"error", error: 'Invalid credentials'});
        
            req.session.user = {
                name: `${req.user.first_name} ${req.user.last_name}`,
                age: req.user.age,
                email: req.user.email,
                role: req.user.role
            }
            const email = req.user.email;
            const password = req.user.password;
            const token =  jwt.sign({email,password}, 'coderSecret',{expiresIn:"24h"})
            console.log(token);
            res.cookie('coderCokie', token, {httpOnly:true}).send({status:"success", message:'Ingreso correcto', token})
        })
        this.get('/current', ["USER", "ADMIN"], passport.authenticate('jwt', {session:false}), (req,res)=>{
            res.send({status:"success", payload:req.user})
        })
        this.get('/faillogin', ["PUBLIC"], async (req,res)=>{
            console.log('Fallo en el ingreso');
            res.send({error: 'Error en el ingreso'})
        
        })
        this.get('/logout', ["USER", "ADMIN"], (req,res)=>{
            req.session.destroy(err =>{
                if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
                res.redirect('/login');
            })
        })
        this.post('/restartPassword', ["USER", "ADMIN"],  async (req, res)=>{
            const {email, password } = req.body;
            console.log("toy aca")
            if(!email || !password ) return res.status(400).send({status:"error", error:"Datos incorrectos"})
            try {
                const user = await userManger.getUserByEmail(email);
                console.log(user);
                const newHashedPassword = createHash(password);
                await userManger.updateUser(user._id, newHashedPassword);
                res.send({status:"success", message:"Contraseña actualizada"})
            } catch (err) {
                return res.status(400).send({status:"error", error:"Datos incorrectos"})
            }   
        })
        this.get('/github', ["PUBLIC"], passport.authenticate('github', {scope:['user:email']}), async (req,res)=>{})

        this.get('/githubcallback', ["PUBLIC"], passport.authenticate('github',{failureRedirect:'/login'}), async (req,res)=>{
            req.session.user = req.user;
            res.redirect('/')
        })
        
    }
}

