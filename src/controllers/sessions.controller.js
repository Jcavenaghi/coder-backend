import { GetUserDto } from "../dao/dto/user.dto.js";
import UserManager from "../services/managers/UserManager.js";
import { sendRecoveryPass } from "../config/gmail_config.js";
import { validatePassword, generateEmailToken, verifyEmailToken, createHash } from "../utils.js";
const userManager = new UserManager();
class SessionController {
    register = async(req,res) =>{
        res.send({status:"succes", message:"User registered"});
    }

    failRegister = async (req,res)=>{
        req.logger.warning("fallo en el registro");
        res.send({error: 'Error en el registro'});
    }

    login = async (req,res)=>{
    
        if(!req.user) {
            req.logger.warning("Credenciales invalidas");
            return res.status(400).send({status:"error", error: 'Invalid credentials'});
        }
        req.session.user = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role
        }
        req.logger.info("Ingreso exitoso");
        res.send({status:"success", payload:req.user, message: "Logueo exitoso"})
    }
    failLogin = async (req,res)=>{
        req.logger.warning("fallo en el ingreso");
        res.send({error: 'Error en el ingreso'})
    
    }

    current = (req,res)=>{
        // loguearse para obtenerlo
        console.log(req.query.token)
        const user = new GetUserDto(req.user);
        res.send({status:"success", user})
    }

    logout = (req,res)=>{
        req.session.destroy(err =>{
            if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
            res.redirect('/login');
        })
    }

    forgotPassword = async (req,res ) => {
        try {
            const { email } = req.body;
            //verifico si existe
            const user = await userManager.getUserByEmail(email);
            if(!user){
                return res.send(`<div>Error, <a href="/forgotPassword">Intente de nuevo</a></div>`)
            }
            const token = generateEmailToken(email,3*60);
            await sendRecoveryPass(email,token);
            res.cookie('CoderCookie',token)
            res.send("Se envio un correo a su cuenta para restablecer la contraseña, volver  <a href='/login'>al login</a>")
        } catch (error) {
            return res.send(`<div>Error, <a href="/forgotPassword">Intente de nuevo</a></div>`)
        }
    }
    restartPassword = async (req, res)=>{
        try {
            const token = req.query.token;
            const {email, password } = req.body;
            const validToken = verifyEmailToken(token);
            console.log(email)
            console.log(password);
            if(!email || !password ) return res.status(400).send({status:"error", error:"Datos incorrectos"})
            if (!validToken) {
                return res.send(`El enlace ya no es valido, genere uno nuevo: <a href="/forgotPassword">Nuevo enlace</a>.`)
            }
            const user = await userManager.getUserByEmail(email);
            if (!user) {
                return res.send("El usuario no esta registrado.")
            }
            if (validatePassword(password,user)) {
                return res.send("No puedes usar la misma contraseña.")
            }
                const newHashedPassword = createHash(password);
                await userManager.updateUser(user._id, newHashedPassword);
                req.logger.info(`Se actualizo la contraseña de ${email}`)
                res.redirect('/login');
        } catch (err) {
            return res.status(400).send({status:"error", message: err.message})
        }   
    }

    githubCallback = async (req,res)=>{
        req.session.user = req.user;
        res.redirect('/')
    }

}

export default SessionController