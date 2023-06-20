class SessionController {
    register = async(req,res) =>{
        res.send({status:"succes", message:"User registered"});
    }

    failRegister = async (req,res)=>{
        console.log('Fallo en el registro');
        res.send({error: 'Error en el registro'})
    }

    login = async (req,res)=>{
    
        if(!req.user) return res.status(400).send({status:"error", error: 'Invalid credentials'});
    
        req.session.user = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role
        }
        res.send({status:"success", payload:req.user, message: "Logueo exitoso"})
    }
    failLogin = async (req,res)=>{
        console.log('Fallo en el ingreso');
        res.send({error: 'Error en el ingreso'})
    
    }

    current = (req,res)=>{
        res.send({status:"success", payload:req.user})
    }

    logout = (req,res)=>{
        req.session.destroy(err =>{
            if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
            res.redirect('/login');
        })
    }

    restartPassword = async (req, res)=>{
        const {email, password } = req.body;
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
    }

    githubCallback = async (req,res)=>{
        req.session.user = req.user;
        res.redirect('/')
    }

}

export default SessionController