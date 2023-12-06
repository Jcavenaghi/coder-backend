import { GetUserDto } from "../dao/dto/user.dto.js";
import UserManager from "../services/managers/UserManager.js";
import { sendRecoveryPass } from "../config/gmail_config.js";
import { validatePassword, generateEmailToken, verifyEmailToken, createHash } from "../utils.js";
const userManager = new UserManager();
class SessionController {
    register = async(req,res) =>{
        // res.send({status:"success", message:"User registered"});
        res.json({ status: "success", message: "User registered" });
    }

    failRegister = async (req,res)=>{
        req.logger.warning("fallo en el registro");
        res.send({error: 'Error en el registro'});
        res.json({ status: "error", message: "El usuario no pudo registrarse" });
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
            role: req.user.role,
            cartId: req.user.cart
        }
        req.logger.info("Ingreso exitoso");
        res.send({status:"success", payload:req.user, message: "Logueo exitoso"})
    }
    failLogin = async (req,res)=>{
        req.logger.warning("fallo en el ingreso");
        res.send({error: 'Error en el ingreso'})
        res.redirect('/');
        /* here add render to "/" and message with "error in log in" */
    
    }

    current = (req,res)=>{
        // loguearse para obtenerlo
        const user = new GetUserDto(req.user);
        res.send({status:"success", user})
    }

    logout = (req,res)=>{
        req.session.destroy(err =>{
            if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
            res.redirect('/login');
        /* perfect example to redirect. add alert with message "sesión cerrada" */
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
}

export default SessionController