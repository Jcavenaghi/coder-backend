import { Router } from 'express';
import userModel from '../dao/models/users.js';
import UserManager from '../dao/managers/UserManager.js';

const router = Router();

const userManger = new UserManager();

router.post('/register', async (req, res) =>{

    const {first_name, last_name, email, age, password} = req.body;
    const user = {
        first_name, last_name, email, age, password
    };
    try {
        const result = await userManger.createUser(user);
        res.send({status:"success", message:"User registered"});
    }catch (err) { 
        return res.status(400).send({status:"error", error:"User already exists"});
    }


})

router.post('/login', async (req,res)=>{
    const { email, password } = req.body;
    try {
        const user = await userManger.getUser(email,password)

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            // role: user.role
        }
        res.send({status:"success", payload:req.res.user, message:"Primer logueo!!"})
    } catch (err) {
        return res.status(400).send({status:"error", error:"Datos incorrectos"})
    }
    
})

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
        res.redirect('/login');
    })
})

export default router;